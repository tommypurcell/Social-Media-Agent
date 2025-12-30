import axios from 'axios';
import type { Post, Message } from './types';
import { database } from '../services/database';

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

        const post: Post = {
            id: Math.random().toString(36).substr(2, 9),
            content,
            image: imageUrl,
            platform: 'instagram',
            likes: 0,
            comments: [],
            timestamp: Date.now(),
            status: 'uploaded',
        };

        // Save to Firestore
        await database.savePost(post);
        return post;
    },

    async postToThreads(content: string): Promise<Post> {
        await delay(1500);
        const post: Post = {
            id: Math.random().toString(36).substr(2, 9),
            content,
            platform: 'threads',
            likes: 0,
            comments: [],
            timestamp: Date.now(),
            status: 'uploaded',
        };

        // Save to Firestore
        await database.savePost(post);
        return post;
    },

    generateText: async (prompt: string): Promise<Post> => {
        // Mock response for now
        return {
            id: Date.now().toString(),
            content: `Generated text for: ${prompt}`,
            platform: 'threads',
            likes: 0,
            comments: [],
            timestamp: Date.now(),
            status: 'uploaded',
        } as Post;
    },

    async fetchMessages(): Promise<Message[]> {
        // Fetch real messages from Firestore
        const messages = await database.getMessages();
        if (messages.length > 0) return messages;

        // Fallback or empty if no real messages yet
        return [];
    },

    async sendMessage(_to: string, content: string): Promise<Message> {
        const message: Message = {
            id: Math.random().toString(36).substr(2, 9),
            sender: 'agent',
            content,
            isFromAgent: true,
            timestamp: Date.now()
        };
        await database.saveMessage(message);
        return message;
    }
};
