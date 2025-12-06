// Mock Social Media Service - Simulates posting and engagement

export interface SimulatedPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'threads';
  caption: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
  timestamp: Date;
  engagement: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves?: number;
  };
  comments: SimulatedComment[];
  status: 'published' | 'processing' | 'failed';
}

export interface SimulatedComment {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
  likes: number;
}

class MockSocialMediaService {
  private posts: SimulatedPost[] = [];
  private postIdCounter = 1;

  // Simulated usernames for different platforms
  private instagramUsers = [
    'creative_explorer', 'visual_storyteller', 'dream_chaser_2024',
    'aesthetic_vibes', 'daily_inspiration', 'art_enthusiast',
    'lifestyle_guru', 'mindful_moments', 'passion_project'
  ];

  private tiktokUsers = [
    'trendy_creator', 'viral_vibes', 'fyp_master',
    'dance_lover', 'comedy_central', 'life_hacks_pro',
    'creativity_unleashed', 'cool_edits', 'trending_now'
  ];

  private threadsUsers = [
    'thought_leader', 'conversation_starter', 'real_talk',
    'authentic_voice', 'community_builder', 'deep_thoughts',
    'perspective_shift', 'honest_opinions', 'meaningful_chats'
  ];

  // Platform-specific comment templates
  private instagramComments = [
    'This is amazing! 😍',
    'Love this content! Keep it up 🔥',
    'So inspiring! ✨',
    'Beautiful work! 💫',
    'Need more of this! 🙌',
    'This made my day! 💖',
    'Absolutely stunning! 🌟',
    'Can\'t stop watching! 👏',
    'Pure perfection! ⭐',
    'This is everything! 💯'
  ];

  private tiktokComments = [
    'This is fire! 🔥🔥🔥',
    'The talent! 😱',
    'I can\'t- 💀',
    'This is why I\'m on TikTok',
    'WAIT THIS IS SO GOOD',
    'Adding this to my favorites rn',
    'Algorithm brought me here and I\'m not mad',
    'The way I RAN here',
    'This deserves more views!',
    'Main character energy ✨'
  ];

  private threadsComments = [
    'Great perspective! Thanks for sharing.',
    'This resonates so much.',
    'Needed to hear this today.',
    'Well said! 👏',
    'This is so important.',
    'Love this take.',
    'Absolutely agree with this.',
    'Thanks for putting this into words.',
    'This hit different.',
    'Real and authentic. Love it.'
  ];

  // Simulate posting to a platform
  async simulatePost(
    platform: 'instagram' | 'tiktok' | 'threads',
    caption: string,
    mediaUrl?: string,
    mediaType: 'image' | 'video' = 'image'
  ): Promise<SimulatedPost> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const postId = `${platform}_${this.postIdCounter++}_${Date.now()}`;

    // Generate platform-specific engagement
    const engagement = this.generateEngagement(platform, mediaType);

    // Generate comments
    const comments = this.generateComments(platform, Math.floor(engagement.comments * 0.3)); // Show 30% of comments

    const post: SimulatedPost = {
      id: postId,
      platform,
      caption,
      mediaUrl,
      mediaType,
      timestamp: new Date(),
      engagement,
      comments,
      status: 'published',
    };

    this.posts.push(post);

    // Simulate gradual engagement increase
    this.simulateEngagementGrowth(postId);

    return post;
  }

  // Generate realistic engagement based on platform
  private generateEngagement(platform: string, mediaType: string) {
    const base = {
      instagram: {
        image: { views: 500, likes: 50, comments: 8, shares: 5, saves: 12 },
        video: { views: 2500, likes: 250, comments: 35, shares: 20, saves: 45 }
      },
      tiktok: {
        image: { views: 1000, likes: 100, comments: 15, shares: 8, saves: 20 },
        video: { views: 15000, likes: 1500, comments: 120, shares: 200, saves: 350 }
      },
      threads: {
        image: { views: 300, likes: 30, comments: 12, shares: 3 },
        video: { views: 800, likes: 80, comments: 25, shares: 8 }
      }
    };

    const baseMetrics = base[platform as keyof typeof base]?.[mediaType as keyof typeof base.instagram] || base.instagram.image;

    // Add randomness
    const variance = 0.3; // ±30%
    return {
      views: Math.floor(baseMetrics.views * (1 + (Math.random() - 0.5) * variance)),
      likes: Math.floor(baseMetrics.likes * (1 + (Math.random() - 0.5) * variance)),
      comments: Math.floor(baseMetrics.comments * (1 + (Math.random() - 0.5) * variance)),
      shares: Math.floor(baseMetrics.shares * (1 + (Math.random() - 0.5) * variance)),
      saves: 'saves' in baseMetrics ? Math.floor((baseMetrics as any).saves * (1 + (Math.random() - 0.5) * variance)) : undefined,
    };
  }

  // Generate simulated comments
  private generateComments(platform: string, count: number): SimulatedComment[] {
    const comments: SimulatedComment[] = [];
    let userPool: string[] = [];
    let commentPool: string[] = [];

    switch (platform) {
      case 'instagram':
        userPool = this.instagramUsers;
        commentPool = this.instagramComments;
        break;
      case 'tiktok':
        userPool = this.tiktokUsers;
        commentPool = this.tiktokComments;
        break;
      case 'threads':
        userPool = this.threadsUsers;
        commentPool = this.threadsComments;
        break;
    }

    for (let i = 0; i < count; i++) {
      const minutesAgo = Math.floor(Math.random() * 60);
      comments.push({
        id: `comment_${Date.now()}_${i}`,
        username: userPool[Math.floor(Math.random() * userPool.length)],
        text: commentPool[Math.floor(Math.random() * commentPool.length)],
        timestamp: new Date(Date.now() - minutesAgo * 60 * 1000),
        likes: Math.floor(Math.random() * 50),
      });
    }

    return comments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Simulate engagement growth over time
  private simulateEngagementGrowth(postId: string) {
    const intervals = [5000, 10000, 15000]; // 5s, 10s, 15s

    intervals.forEach((delay, index) => {
      setTimeout(() => {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          const growthFactor = 1 + (0.1 * (index + 1)); // 10%, 20%, 30% growth
          post.engagement.views = Math.floor(post.engagement.views * growthFactor);
          post.engagement.likes = Math.floor(post.engagement.likes * (1 + 0.05 * (index + 1)));
          post.engagement.comments += Math.floor(Math.random() * 3);

          // Add new comments
          if (Math.random() > 0.5) {
            const newComments = this.generateComments(post.platform, 1);
            post.comments.unshift(...newComments);
          }
        }
      }, delay);
    });
  }

  // Get all posts
  getPosts(): SimulatedPost[] {
    return [...this.posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get posts by platform
  getPostsByPlatform(platform: 'instagram' | 'tiktok' | 'threads'): SimulatedPost[] {
    return this.posts
      .filter(p => p.platform === platform)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get post by ID
  getPost(postId: string): SimulatedPost | undefined {
    return this.posts.find(p => p.id === postId);
  }

  // Simulate post deletion
  async deletePost(postId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      this.posts.splice(index, 1);
      return true;
    }
    return false;
  }

  // Simulate adding a comment
  async addComment(postId: string, text: string, username: string = 'you'): Promise<SimulatedComment | null> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const post = this.posts.find(p => p.id === postId);
    if (post) {
      const comment: SimulatedComment = {
        id: `comment_${Date.now()}`,
        username,
        text,
        timestamp: new Date(),
        likes: 0,
      };

      post.comments.unshift(comment);
      post.engagement.comments++;

      return comment;
    }

    return null;
  }

  // Get engagement summary
  getEngagementSummary() {
    const total = {
      posts: this.posts.length,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    this.posts.forEach(post => {
      total.views += post.engagement.views;
      total.likes += post.engagement.likes;
      total.comments += post.engagement.comments;
      total.shares += post.engagement.shares;
    });

    return total;
  }

  // Clear all posts (for testing)
  clearAllPosts() {
    this.posts = [];
    this.postIdCounter = 1;
  }
}

export const mockSocialMedia = new MockSocialMediaService();
