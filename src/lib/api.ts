import axios from 'axios';
import type { Post, Message } from './types';

const client = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 30000, // Long timeout for generation
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    async generateImage(prompt: string): Promise<string> {
        try {
            console.log("Requesting image generation...", prompt);
            const response = await client.post('/generate/image', { prompt });
            if (response.data && response.data.url) {
                return response.data.url;
            } else if (response.data && response.data.image) { // Handle different formats
                return `data:image/png;base64,${response.data.image}`;
            }
            throw new Error("Invalid response from server");
        } catch (error) {
            console.warn("API Generation failed, falling back to placeholder", error);
            await delay(1000);
            return `https://placehold.co/600x600?text=${encodeURIComponent(prompt.slice(0, 20))}`;
        }
    },

    async generateVideo(prompt: string): Promise<string> {
        try {
            console.log("Requesting video generation...", prompt);
            const response = await client.post('/generate/video', { prompt });
            if (response.data && response.data.url) {
                return response.data.url;
            }
            throw new Error("Invalid response from server");
        } catch (error) {
            console.warn("API Video Generation failed, falling back to mock", error);
            await delay(2000);
            return "https://media.istockphoto.com/id/1400645607/video/abstract-background-rainbow-waves-on-white-background-3d-animation-loop.mp4?s=mp4-640x640-is&k=20&c=Jd1lA5Hl4mPfa9qF7vL0r4B5p0l1b1b1b1b1b1b1b1b1";
        }
    },

    async postToInstagram(content: string, imageUrl: string): Promise<Post> {
        await delay(2000);
        // Simulation
        if (Math.random() < 0.05) throw new Error("Instagram API Timeout");

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

    async postToLinkedin(content: string, imageUrl?: string): Promise<Post> {
        await delay(1800);
        return {
            id: Math.random().toString(36).substr(2, 9),
            content,
            image: imageUrl,
            platform: 'linkedin',
            likes: 0,
            comments: [],
            timestamp: Date.now(),
        };
    },

    async postToTwitter(content: string, imageUrl?: string): Promise<Post> {
        await delay(1200);
        return {
            id: Math.random().toString(36).substr(2, 9),
            content,
            image: imageUrl,
            platform: 'twitter',
            likes: 0,
            comments: [],
            timestamp: Date.now(),
        };
    },

    async postToFacebook(content: string, imageUrl?: string): Promise<Post> {
        await delay(1600);
        return {
            id: Math.random().toString(36).substr(2, 9),
            content,
            image: imageUrl,
            platform: 'facebook',
            likes: 0,
            comments: [],
            timestamp: Date.now(),
        };
    },

    async fetchMessages(): Promise<Message[]> {
        await delay(1000);
        // Simulate receiving new messages occasionally
        // In future, call client.get('/agent/messages')
        if (Math.random() > 0.8) {
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
