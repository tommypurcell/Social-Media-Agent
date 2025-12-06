export interface Post {
    id: string;
    content: string;
    image?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    platform: 'instagram' | 'threads' | 'tiktok';
    likes: number;
    comments: number | Comment[]; // Allow number for mock data compatibility
    engagement?: {
        views: number;
        likes: number;
        comments: number;
        shares: number;
        saves?: number;
    };
    simulatedComments?: {
        id: string;
        username: string;
        text: string;
        timestamp: string;
        likes: number;
    }[];
    timestamp: number;
}

export interface Comment {
    id: string;
    username: string;
    text: string;
}

export interface Message {
    id: string;
    sender: string;
    content: string;
    isFromAgent: boolean;
    timestamp: number;
}

export interface Task {
    id: string;
    type: 'plan_content' | 'generate_media' | 'post_content' | 'check_dms' | 'reply_dm' | 'reply_comment' | 'idle';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    description: string;
    metadata?: Record<string, unknown>;
    createdAt: number;
    completedAt?: number;
}

export interface PlannedPost {
    id: number;
    platform: string;
    topic: string;
    caption: string;
    captionStarter: string;
    hashtags: string[];
    useHashtags: boolean;
    customHashtags: string;
    imagePrompt: string;
    postType: 'photo' | 'reel';
    scheduledTime: string;
    status: 'planning' | 'planned' | 'error';
    uploadedImage?: string; // URL for uploaded file
    workflowId?: string; // Links all posts from same workflow
    branches?: ContentBranch[]; // Different versions of this post
}

export interface ContentBranch {
    id: string;
    parentId?: string; // null for root, otherwise points to parent branch
    name: string;
    caption: string;
    hashtags: string[];
    mediaUrl?: string;
    platform: string;
    postType: 'photo' | 'reel';
    isSelected: boolean; // Whether this branch is selected for publishing
    createdAt: number;
}

export interface Log {
    id: string;
    timestamp: number;
    level: 'info' | 'warning' | 'error' | 'success';
    message: string;
}

export interface AgentState {
    isActive: boolean;
    currentTask: Task | null;
    tasks: Task[];
    posts: Post[];
    messages: Message[];
    logs: Log[];
    chatHistory: ChatMessage[];
}

export interface PostConfig {
    id: number;
    topic: string;
    platform: 'instagram' | 'tiktok' | 'threads';
    description?: string;
}

export interface WorkflowConfig {
    type: 'full_day' | 'content_only' | 'dm_only' | 'plan_posts' | 'custom';
    platforms: ('instagram' | 'tiktok' | 'threads')[];
    postCount: number;
    enableDMs: boolean;
    enableSelfCorrection: boolean;
    contentSource: 'upload' | 'ai_generated';
    uploadedFiles?: File[];
    individualPosts?: PostConfig[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'agent' | 'system';
    content: string;
    timestamp: number;
    attachments?: string[];
}
