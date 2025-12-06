import { tokenStorage } from './tokenStorage';

const GRAPH_API_BASE = import.meta.env.VITE_META_GRAPH_API_BASE_URL;
const GRAPH_API_VERSION = import.meta.env.VITE_META_GRAPH_API_VERSION;
const INSTAGRAM_ACCOUNT_ID = import.meta.env.VITE_INSTAGRAM_ACCOUNT_ID;

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

export interface InstagramPostRequest {
  imageUrl?: string;
  videoUrl?: string;
  caption: string;
  carouselItems?: string[];
}

export interface InstagramInsights {
  impressions: number;
  reach: number;
  engagement: number;
  saved: number;
  profile_visits: number;
}

class InstagramApiService {
  private getAccessToken(): string {
    const token = tokenStorage.getAccessToken('instagram');
    if (!token) {
      throw new Error('Instagram not connected. Please connect your account first.');
    }
    return token;
  }

  private getAccountId(): string {
    return INSTAGRAM_ACCOUNT_ID || tokenStorage.getTokens('instagram')?.userId || '';
  }

  // Create a single image post
  async createImagePost(imageUrl: string, caption: string): Promise<{ id: string; permalink: string }> {
    try {
      const accessToken = this.getAccessToken();
      const accountId = this.getAccountId();

      // Step 1: Create media container
      const containerResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: imageUrl,
            caption: caption,
            access_token: accessToken,
          }),
        }
      );

      if (!containerResponse.ok) {
        const error = await containerResponse.json();
        throw new Error(error.error?.message || 'Failed to create media container');
      }

      const containerData = await containerResponse.json();

      // Step 2: Publish the media
      const publishResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}/media_publish`,
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
        throw new Error(error.error?.message || 'Failed to publish media');
      }

      const publishData = await publishResponse.json();

      // Get permalink
      const mediaResponse = await this.getMediaById(publishData.id);

      return {
        id: publishData.id,
        permalink: mediaResponse.permalink,
      };
    } catch (error) {
      console.error('Error creating Instagram post:', error);
      throw error;
    }
  }

  // Create a video post
  async createVideoPost(videoUrl: string, caption: string): Promise<{ id: string; permalink: string }> {
    try {
      const accessToken = this.getAccessToken();
      const accountId = this.getAccountId();

      // Step 1: Create media container
      const containerResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'VIDEO',
            video_url: videoUrl,
            caption: caption,
            access_token: accessToken,
          }),
        }
      );

      if (!containerResponse.ok) {
        const error = await containerResponse.json();
        throw new Error(error.error?.message || 'Failed to create video container');
      }

      const containerData = await containerResponse.json();

      // Step 2: Wait for video to be processed
      await this.waitForMediaProcessing(containerData.id);

      // Step 3: Publish the media
      const publishResponse = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}/media_publish`,
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
        throw new Error(error.error?.message || 'Failed to publish video');
      }

      const publishData = await publishResponse.json();
      const mediaResponse = await this.getMediaById(publishData.id);

      return {
        id: publishData.id,
        permalink: mediaResponse.permalink,
      };
    } catch (error) {
      console.error('Error creating Instagram video post:', error);
      throw error;
    }
  }

  // Create a carousel post
  async createCarouselPost(mediaUrls: string[], caption: string): Promise<{ id: string; permalink: string }> {
    try {
      const accessToken = this.getAccessToken();
      const accountId = this.getAccountId();

      // Step 1: Create containers for each media item
      const containerIds = await Promise.all(
        mediaUrls.map(async (url) => {
          const isVideo = url.match(/\.(mp4|mov|avi)$/i);
          const response = await fetch(
            `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}/media`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
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
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'CAROUSEL',
            children: containerIds,
            caption: caption,
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
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}/media_publish`,
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
      const mediaResponse = await this.getMediaById(publishData.id);

      return {
        id: publishData.id,
        permalink: mediaResponse.permalink,
      };
    } catch (error) {
      console.error('Error creating Instagram carousel:', error);
      throw error;
    }
  }

  // Get user's media feed
  async getMedia(limit: number = 10): Promise<InstagramMediaItem[]> {
    try {
      const accessToken = this.getAccessToken();
      const accountId = this.getAccountId();

      const fields = 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count';
      const params = new URLSearchParams({
        fields: fields,
        limit: limit.toString(),
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}/media?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch media');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Instagram media:', error);
      throw error;
    }
  }

  // Get specific media by ID
  async getMediaById(mediaId: string): Promise<InstagramMediaItem> {
    try {
      const accessToken = this.getAccessToken();

      const fields = 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count';
      const params = new URLSearchParams({
        fields: fields,
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${mediaId}?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch media');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Instagram media by ID:', error);
      throw error;
    }
  }

  // Get media insights
  async getMediaInsights(mediaId: string): Promise<InstagramInsights> {
    try {
      const accessToken = this.getAccessToken();

      const metrics = 'impressions,reach,engagement,saved,profile_visits';
      const params = new URLSearchParams({
        metric: metrics,
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${mediaId}/insights?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch insights');
      }

      const json = await response.json();
      const data = json.data as { name: string; values: { value: number }[] }[];
      const insights: InstagramInsights = {
        impressions: 0,
        reach: 0,
        engagement: 0,
        saved: 0,
        profile_visits: 0,
      };

      data.forEach((metric) => {
        insights[metric.name as keyof InstagramInsights] = metric.values[0].value;
      });

      return insights;
    } catch (error) {
      console.error('Error fetching Instagram insights:', error);
      throw error;
    }
  }

  // Wait for video processing
  private async waitForMediaProcessing(containerId: string, maxAttempts: number = 30): Promise<void> {
    const accessToken = this.getAccessToken();

    for (let i = 0; i < maxAttempts; i++) {
      const params = new URLSearchParams({
        fields: 'status_code',
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${containerId}?${params.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status_code === 'FINISHED') {
          return;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
    }

    throw new Error('Video processing timeout');
  }

  // Get account info
  async getAccountInfo(): Promise<Record<string, unknown>> {
    try {
      const accessToken = this.getAccessToken();
      const accountId = this.getAccountId();

      const fields = 'id,username,account_type,media_count,followers_count,follows_count';
      const params = new URLSearchParams({
        fields: fields,
        access_token: accessToken,
      });

      const response = await fetch(
        `${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${accountId}?${params.toString()}`
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch account info');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching Instagram account info:', error);
      throw error;
    }
  }
}

export const instagramApi = new InstagramApiService();
