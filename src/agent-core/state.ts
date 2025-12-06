export interface Post {
    id: string;
    content: string;
    imageDescription?: string; // Simple text description of the image to generate
    status: 'planned' | 'drafted' | 'published';
    timestamp: number;
}

export interface Message {
    id: string;
    from: string;
    text: string;
    reply?: string;
    processed: boolean;
}

export interface Task {
    id: string;
    description: string;
    completed: boolean;
}

export interface Log {
    timestamp: number;
    action: string;
    details: string;
}

// The core brain state
export interface AgentState {
    businessName: string;
    posts: Post[];
    messages: Message[];
    tasks: Task[];
    logs: Log[];
}

export const INITIAL_STATE: AgentState = {
    businessName: "My Awesome Business",
    posts: [],
    messages: [
        { id: "msg_1", from: "Alice", text: "Do you have vegan options?", processed: false },
        { id: "msg_2", from: "Bob", text: "What time do you open?", processed: false }
    ],
    tasks: [
        { id: "task_1", description: "Read business description", completed: false },
        { id: "task_2", description: "Plan daily content", completed: false }
    ],
    logs: []
};
