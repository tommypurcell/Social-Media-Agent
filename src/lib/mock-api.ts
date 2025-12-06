import type { Post, Message } from './types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    async generateImage(prompt: string): Promise<string> {
        await delay(1500);
        // Return a placeholder image based on prompt (simulation)
        return `https://placehold.co/600x600?text=${encodeURIComponent(prompt.slice(0, 20))}`;
    },

    async postToInstagram(content: string, imageUrl: string): Promise<Post> {
        await delay(2000);
        if (Math.random() < 0.1) throw new Error("Instagram API Timeout");

        return {
            id: Math.random().toString(36).substr(2, 9),
            content,
            image: imageUrl,
            platform: 'instagram',
            likes: 0,
            comments: [],
            timestamp: Date.now(),
        };
    },

    async postToThreads(content: string): Promise<Post> {
        await delay(1500);
        return {
            id: Math.random().toString(36).substr(2, 9),
            content,
            platform: 'threads',
            likes: 0,
            comments: [],
            timestamp: Date.now(),
        };
    },

    async fetchMessages(): Promise<Message[]> {
        await delay(1000);
        // Simulate receiving new messages occasionally
        if (Math.random() > 0.7) {
            return [{
                id: Math.random().toString(36).substr(2, 9),
                sender: `user_${Math.floor(Math.random() * 1000)}`,
                content: "Hey, love your content! Collab?",
                isFromAgent: false,
                timestamp: Date.now()
            }];
        }
        return [];
    },

    async sendMessage(_to: string, content: string): Promise<Message> {
        await delay(1000);
        return {
            id: Math.random().toString(36).substr(2, 9),
            sender: 'agent',
            content,
            isFromAgent: true,
            timestamp: Date.now()
        };
    }
};
