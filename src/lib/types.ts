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
    type: 'custom'; // Simplified to just custom for now, as we're dynamically building it
    platforms: ('instagram' | 'tiktok' | 'threads' | 'linkedin' | 'twitter' | 'facebook')[];
    contentType: 'video' | 'image' | 'text';
    inputMethod: 'upload' | 'idea' | 'auto';
    tone: 'default' | 'energetic' | 'professional' | 'educational' | 'inspirational' | 'meme';
    postCount: number;
    schedule: 'now' | 'scheduled' | 'draft';
    smartMode: boolean;
    // Optional fields for specific input methods
    userIdea?: string;
    uploadedFiles?: File[];
    individualPosts?: PostConfig[]; // Keep for compatibility or advanced mode if needed
    enableDMs: boolean; // Keep for now to avoid breaking other parts, but maybe hide in UI
    enableSelfCorrection: boolean; // Mapped to smartMode concept
}
