import { tokenStorage } from './tokenStorage';

const GRAPH_API_BASE = import.meta.env.VITE_META_GRAPH_API_BASE_URL;
const GRAPH_API_VERSION = import.meta.env.VITE_META_GRAPH_API_VERSION;

export interface ThreadsPost {
  id: string;
  text?: string;
  media_type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  media_url?: string;
  permalink: string;
  timestamp: string;
  is_reply?: boolean;
  has_replies?: boolean;
}

export interface ThreadsPostRequest {
  text: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO';
  replyToId?: string;
}

export interface ThreadsInsights {
  views: number;
  likes: number;
  replies: number;
  reposts: number;
  quotes: number;
}

class ThreadsApiService {
  private getAccessToken(): string {
    const token = tokenStorage.getAccessToken('threads');
    if (!token) {
      throw new Error('Threads not connected. Please connect your account first.');
    }
    return token;
  }

  private getUserId(): string {
    return tokenStorage.getTokens('threads')?.userId || '';
  }

  // Create a text post
  async createTextPost(text: string, replyToId?: string): Promise<{ id: string; permalink: string }> {
    try {
      const accessToken = this.getAccessToken();
      const userId = this.getUserId();

      // Step 1: Create media container
      const containerPayload: Record<string, unknown> = {
        media_type: 'TEXT',
        text: text,
        access_token: accessToken,
      };

      if (replyToId) {
        containerPayload.reply_to_id = replyToId;
      }

      const containerResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(containerPayload),
        }
      );

      if (!containerResponse.ok) {
        const error = await containerResponse.json();
        throw new Error(error.error?.message || 'Failed to create thread container');
      }

      const containerData = await containerResponse.json();

      // Step 2: Publish the thread
      const publishResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: accessToken,
          }),
        }
      );

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        throw new Error(error.error?.message || 'Failed to publish thread');
      }

      const publishData = await publishResponse.json();

      // Get permalink
      const threadData = await this.getThreadById(publishData.id);

      return {
        id: publishData.id,
        permalink: threadData.permalink,
      };
    } catch (error) {
      console.error('Error creating Threads text post:', error);
      throw error;
    }
  }

  // Create an image post
  async createImagePost(imageUrl: string, text: string): Promise<{ id: string; permalink: string }> {
    try {
      const accessToken = this.getAccessToken();
      const userId = this.getUserId();

      // Step 1: Create media container
      const containerResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'IMAGE',
            image_url: imageUrl,
            text: text,
            access_token: accessToken,
          }),
        }
      );

      if (!containerResponse.ok) {
        const error = await containerResponse.json();
        throw new Error(error.error?.message || 'Failed to create image container');
      }

      const containerData = await containerResponse.json();

      // Step 2: Publish the thread
      const publishResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: accessToken,
          }),
        }
      );

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        throw new Error(error.error?.message || 'Failed to publish thread');
      }

      const publishData = await publishResponse.json();
      const threadData = await this.getThreadById(publishData.id);

      return {
        id: publishData.id,
        permalink: threadData.permalink,
      };
    } catch (error) {
      console.error('Error creating Threads image post:', error);
      throw error;
    }
  }

  // Create a video post
  async createVideoPost(videoUrl: string, text: string): Promise<{ id: string; permalink: string }> {
    try {
      const accessToken = this.getAccessToken();
      const userId = this.getUserId();

      // Step 1: Create media container
      const containerResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'VIDEO',
            video_url: videoUrl,
            text: text,
            access_token: accessToken,
          }),
        }
      );

      if (!containerResponse.ok) {
        const error = await containerResponse.json();
        throw new Error(error.error?.message || 'Failed to create video container');
      }

      const containerData = await containerResponse.json();

      // Step 2: Wait for video processing
      await this.waitForMediaProcessing(containerData.id);

      // Step 3: Publish the thread
      const publishResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: accessToken,
          }),
        }
      );

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        throw new Error(error.error?.message || 'Failed to publish video thread');
      }

      const publishData = await publishResponse.json();
      const threadData = await this.getThreadById(publishData.id);

      return {
        id: publishData.id,
        permalink: threadData.permalink,
      };
    } catch (error) {
      console.error('Error creating Threads video post:', error);
      throw error;
    }
  }

  // Create a carousel post
  async createCarouselPost(mediaUrls: string[], text: string): Promise<{ id: string; permalink: string }> {
    try {
      const accessToken = this.getAccessToken();
      const userId = this.getUserId();

      // Step 1: Create containers for each media item
      const containerIds = await Promise.all(
        mediaUrls.map(async (url) => {
          const isVideo = url.match(/\.(mp4|mov|avi)$/i);
          const response = await fetch(
            `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                media_type: isVideo ? 'VIDEO' : 'IMAGE',
                [isVideo ? 'video_url' : 'image_url']: url,
                is_carousel_item: true,
                access_token: accessToken,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to create carousel item');
          }

          const data = await response.json();
          return data.id;
        })
      );

      // Step 2: Create carousel container
      const carouselResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'CAROUSEL',
            children: containerIds,
            text: text,
            access_token: accessToken,
          }),
        }
      );

      if (!carouselResponse.ok) {
        const error = await carouselResponse.json();
        throw new Error(error.error?.message || 'Failed to create carousel');
      }

      const carouselData = await carouselResponse.json();

      // Step 3: Publish the carousel
      const publishResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: carouselData.id,
            access_token: accessToken,
          }),
        }
      );

      if (!publishResponse.ok) {
        const error = await publishResponse.json();
        throw new Error(error.error?.message || 'Failed to publish carousel');
      }

      const publishData = await publishResponse.json();
      const threadData = await this.getThreadById(publishData.id);

      return {
        id: publishData.id,
        permalink: threadData.permalink,
      };
    } catch (error) {
      console.error('Error creating Threads carousel:', error);
      throw error;
    }
  }

  // Get user's threads
  async getThreads(limit: number = 10): Promise<ThreadsPost[]> {
    try {
      const accessToken = this.getAccessToken();
      const userId = this.getUserId();

      const fields = 'id,text,media_type,media_url,permalink,timestamp,is_reply,has_replies';
      const params = new URLSearchParams({
        fields: fields,
        limit: limit.toString(),
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}/threads?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch threads');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Threads:', error);
      throw error;
    }
  }

  // Get specific thread by ID
  async getThreadById(threadId: string): Promise<ThreadsPost> {
    try {
      const accessToken = this.getAccessToken();

      const fields = 'id,text,media_type,media_url,permalink,timestamp,is_reply,has_replies';
      const params = new URLSearchParams({
        fields: fields,
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${threadId}?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch thread');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Thread by ID:', error);
      throw error;
    }
  }

  // Get thread insights
  async getThreadInsights(threadId: string): Promise<ThreadsInsights> {
    try {
      const accessToken = this.getAccessToken();

      const metrics = 'views,likes,replies,reposts,quotes';
      const params = new URLSearchParams({
        metric: metrics,
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${threadId}/insights?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch insights');
      }

      const json = await response.json();
      const data = json.data as { name: string; values: { value: number }[] }[];
      const insights: ThreadsInsights = {
        views: 0,
        likes: 0,
        replies: 0,
        reposts: 0,
        quotes: 0,
      };

      data.forEach((metric) => {
        insights[metric.name as keyof ThreadsInsights] = metric.values[0].value;
      });

      return insights;
    } catch (error) {
      console.error('Error fetching Threads insights:', error);
      throw error;
    }
  }

  // Get replies to a thread
  async getReplies(threadId: string): Promise<ThreadsPost[]> {
    try {
      const accessToken = this.getAccessToken();

      const fields = 'id,text,media_type,media_url,permalink,timestamp';
      const params = new URLSearchParams({
        fields: fields,
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${threadId}/replies?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch replies');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Thread replies:', error);
      throw error;
    }
  }

  // Reply to a thread
  async replyToThread(threadId: string, text: string): Promise<{ id: string; permalink: string }> {
    return this.createTextPost(text, threadId);
  }

  // Wait for video processing
  private async waitForMediaProcessing(containerId: string, maxAttempts: number = 30): Promise<void> {
    const accessToken = this.getAccessToken();

    for (let i = 0; i < maxAttempts; i++) {
      const params = new URLSearchParams({
        fields: 'status',
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${containerId}?${params.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'FINISHED') {
          return;
        }
        if (data.status === 'ERROR') {
          throw new Error('Video processing failed');
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
    }

    throw new Error('Video processing timeout');
  }

  // Get user profile
  async getProfile(): Promise<Record<string, unknown>> {
    try {
      const accessToken = this.getAccessToken();
      const userId = this.getUserId();

      const fields = 'id,username,threads_profile_picture_url,threads_biography';
      const params = new URLSearchParams({
        fields: fields,
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${userId}?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch profile');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Threads profile:', error);
      throw error;
    }
  }
}

export const threadsApi = new ThreadsApiService();
