export interface Post {
    id: string;
    content: string;
    image?: string;
    platform: 'instagram' | 'threads';
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

export interface SocialPlatform {
    id: string;
    name: string;
    icon: string;
    connected: boolean;
    username?: string;
}

export interface BusinessProfile {
    companyName: string;
    industry: string;
    brandVoice: string;
    targetAudience: string;
    description: string;
}

export interface ContentPreferences {
    contentTypes: string[];
    topics: string[];
    tone: string;
    postingFrequency: string;
}

export interface PostingSchedule {
    timezone: string;
    preferredTimes: string[];
    activeDays: string[];
}

export interface OnboardingData {
    step: number;
    completed: boolean;
    platforms: SocialPlatform[];
    businessProfile: BusinessProfile;
    contentPreferences: ContentPreferences;
    postingSchedule: PostingSchedule;
}
