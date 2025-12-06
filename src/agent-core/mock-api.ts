import { AgentState, Post, Log } from './state';

export const mockApi = {
    // Simulate posting content
    publishPost: async (post: Post): Promise<boolean> => {
        console.log(`[API] Publishing post: ${post.content}`);
        await new Promise(r => setTimeout(r, 1000)); // Simulate delay
        return true;
    },

    // Simulate sending a reply
    sendReply: async (messageId: string, replyText: string): Promise<boolean> => {
        console.log(`[API] Replying to ${messageId}: ${replyText}`);
        await new Promise(r => setTimeout(r, 800));
        return true;
    },

    // Helper to add a log entry to state (conceptually, in a real app this might send to a server)
    createLogEntry: (action: string, details: string): Log => {
        return {
            timestamp: Date.now(),
            action,
            details
        };
    }
};
