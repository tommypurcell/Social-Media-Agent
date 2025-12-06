export interface Post {
    id: string;
    content: string;
    image?: string;
    platform: 'instagram' | 'threads' | 'tiktok' | 'linkedin' | 'twitter' | 'facebook';
    likes: number;
    comments: Comment[];
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
    type: 'plan_content' | 'generate_media' | 'post_content' | 'check_dms' | 'reply_dm' | 'idle';
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    description: string;
    metadata?: any;
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
}

export interface PostConfig {
    id: number;
    topic: string;
    platform: 'instagram' | 'tiktok' | 'threads' | 'linkedin' | 'twitter' | 'facebook';
    description?: string;
}

export interface WorkflowConfig {
    type: 'full_day' | 'content_only' | 'dm_only' | 'plan_posts' | 'custom';
    platforms: ('instagram' | 'tiktok' | 'threads' | 'linkedin' | 'twitter' | 'facebook')[];
    postCount: number;
    enableDMs: boolean;
    enableSelfCorrection: boolean;
    contentSource: 'upload' | 'ai_generated';
    uploadedFiles?: File[];
    individualPosts?: PostConfig[];
}
