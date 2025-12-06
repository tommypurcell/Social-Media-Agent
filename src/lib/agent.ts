import { useState, useEffect, useCallback } from 'react';
import type { AgentState, Task, Log, WorkflowConfig, Message, ChatMessage } from './types';
import { api } from './api';
import { mockSocialMedia } from '../services/mockSocialMedia';
import { generateMedia, getGeminiChatResponse } from '../services/mediaGenerator';

const INITIAL_STATE: AgentState = {
    isActive: false,
    currentTask: null,
    tasks: [],
    posts: [],
    messages: [],
    logs: [],
    chatHistory: [
        {
            id: 'init_1',
            role: 'agent',
            content: 'Hello! I am your AI Social Media Agent. How can I help you today?',
            timestamp: Date.now()
        }
    ]
};

export function useAgent() {
    const [state, setState] = useState<AgentState>(INITIAL_STATE);

    const addLog = useCallback((message: string, level: Log['level'] = 'info') => {
        setState(prev => ({
            ...prev,
            logs: [{
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
                level,
                message
            }, ...prev.logs.slice(0, 49)] // Keep last 50 logs
        }));
    }, []);

    const addTask = useCallback((description: string, type: Task['type'], metadata?: Record<string, unknown>) => {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            status: 'pending',
            description,
            metadata,
            createdAt: Date.now()
        };
        setState(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask]
        }));
        addLog(`Scheduled task: ${description}`);
    }, [addLog]);

    const toggleAgent = useCallback(() => {
        setState(prev => {
            const isActive = !prev.isActive;
            return { ...prev, isActive };
        });
        addLog("Agent toggled.", 'warning');
    }, [addLog]);

    const sendChatMessage = useCallback(async (content: string) => {
        // 1. Add User Message
        const userMsg: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            role: 'user',
            content,
            timestamp: Date.now()
        };

        setState(prev => ({
            ...prev,
            chatHistory: [...prev.chatHistory, userMsg]
        }));

        // 2. Analyze Intent & Respond
        let responseText = "";
        const lowercaseContent = content.toLowerCase();
        let attachments: string[] = [];

        // Check for Media Generation Intent
        const mediaMatch = lowercaseContent.match(/(?:make|create|generate|show)\s+(?:a|an)?\s*(video|image|picture|photo)/i);

        if (mediaMatch) {
            const mediaType = (mediaMatch[1] === 'video') ? 'video' : 'image';
            // Extract topic: everything after the "make a video" part roughly, or just use the whole message
            const topic = content.replace(/(?:make|create|generate|show)\s+(?:a|an)?\s*(video|image|picture|photo)(?: of| about| for)?/i, "").trim() || "something cool";

            // Temporary "Thinking" message
            setState(prev => ({
                ...prev,
                chatHistory: [...prev.chatHistory, {
                    id: 'temp_thinking',
                    role: 'agent',
                    content: `Generating ${mediaType} about "${topic}"...`,
                    timestamp: Date.now()
                }]
            }));

            try {
                const media = await generateMedia(topic, 'instagram', mediaType);
                attachments = [media.url];
                responseText = `Here is the ${mediaType} you asked for!`;

                // Also add a task for it so it appears in the timeline
                addTask(`Generate ${mediaType}: ${topic}`, 'generate_media', { imageUrl: media.url });

            } catch (e) {
                console.error(e);
                responseText = "I couldn't generate that media right now. Please try again.";
            }

            // Remove temp message
            setState(prev => ({
                ...prev,
                chatHistory: prev.chatHistory.filter(m => m.id !== 'temp_thinking')
            }));

        } else if (lowercaseContent.includes('start') && lowercaseContent.includes('agent')) {
            responseText = "Starting autonomous mode immediately.";
            setState(prev => ({ ...prev, isActive: true }));
        } else if (lowercaseContent.includes('stop') && lowercaseContent.includes('agent')) {
            responseText = "Stopping all activities. I'm now in standby.";
            setState(prev => ({ ...prev, isActive: false }));
        } else {
            // Use Gemini for general chat
            responseText = await getGeminiChatResponse(content);
        }

        const agentMsg: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            role: 'agent',
            content: responseText,
            timestamp: Date.now(),
            attachments
        };

        setState(prev => ({
            ...prev,
            chatHistory: [...prev.chatHistory, agentMsg]
        }));
    }, [addTask, addLog]);

    const executeTask = useCallback(async (task: Task) => {
        addLog(`Executing: ${task.description}...`);

        // Simulate thinking/working
        await new Promise(r => setTimeout(r, 1000));

        switch (task.type) {
            case 'check_dms': {
                const newMsgs = await api.fetchMessages();
                if (newMsgs.length > 0) {
                    addLog(`Received ${newMsgs.length} new DM(s).`, 'success');
                    setState(prev => ({ ...prev, messages: [...prev.messages, ...newMsgs] }));
                    // Auto-reply logic
                    newMsgs.forEach((msg) => {
                        addTask(`Reply to ${msg.sender}: "${msg.content.slice(0, 40)}..."`, 'reply_dm', { message: msg });
                    });
                } else {
                    addLog("Checked DMs: No new messages.");
                }
                break;
            }

            case 'plan_content':
                addTask("Generate Image: 'Sunset in futuristic city'", "generate_media");
                break;

            case 'generate_media': {
                const prompt = task.description.split("'")[1] || "A cool image";
                let imageUrl = "https://placehold.co/600x400";
                try {
                    imageUrl = await api.generateImage(prompt);
                    addLog(`Generated Media for: ${prompt}`, 'success');
                } catch {
                    addLog(`Failed to generate media for: ${prompt}`, 'error');
                }

                addTask(`Post to Instagram: ${prompt}`, 'post_content', { imageUrl });
                break;
            }

            case 'post_content': {
                const content = task.description.split(": ")[1] || task.description;
                const metadata = task.metadata as {
                    imageUrl?: string;
                    caption?: string;
                    platform?: 'instagram' | 'tiktok' | 'threads';
                    mediaType?: 'image' | 'video';
                    uploadedMedia?: string;
                } | undefined;

                const platform = metadata?.platform || 'instagram';
                const caption = metadata?.caption || content;
                const mediaUrl = metadata?.uploadedMedia || metadata?.imageUrl || "https://placehold.co/600x400";
                const mediaType = metadata?.mediaType || 'image';

                addLog(`Posting to ${platform}...`, 'info');

                // Use mock social media service for simulated posting
                const simulatedPost = await mockSocialMedia.simulatePost(
                    platform,
                    caption,
                    mediaUrl,
                    mediaType
                );

                addLog(`✅ Posted to ${platform}: ${simulatedPost.engagement.views} views, ${simulatedPost.engagement.likes} likes`, 'success');

                // Convert simulated post to our post format and add to state
                const post = {
                    id: simulatedPost.id,
                    content: simulatedPost.caption,
                    image: simulatedPost.mediaType === 'image' ? (simulatedPost.mediaUrl || '') : undefined,
                    mediaUrl: simulatedPost.mediaUrl,
                    mediaType: simulatedPost.mediaType,
                    timestamp: simulatedPost.timestamp.getTime(),
                    likes: simulatedPost.engagement.likes,
                    comments: simulatedPost.engagement.comments,
                    platform: simulatedPost.platform,
                    engagement: simulatedPost.engagement,
                    simulatedComments: simulatedPost.comments.map(c => ({
                        ...c,
                        timestamp: c.timestamp.toISOString()
                    }))
                };

                setState(prev => ({ ...prev, posts: [post, ...prev.posts] }));

                // Schedule auto-replies to first few comments
                if (simulatedPost.comments.length > 0) {
                    simulatedPost.comments.slice(0, 5).forEach(comment => {
                        addTask(
                            `Reply to ${comment.username} on ${platform}`,
                            'reply_comment',
                            {
                                postId: simulatedPost.id,
                                commentId: comment.id,
                                commenter: comment.username,
                                commentText: comment.text
                            }
                        );
                    });
                }
                break;
            }

            case 'reply_dm': {
                const msg = task.metadata as { message?: Message } | undefined;
                const sender = msg?.message?.sender || 'there';
                const original = msg?.message?.content || '';
                const replyContent = `Hey ${sender}, thanks for reaching out! Saw your note: "${original.slice(0, 80)}". I'll keep you posted.`;

                const sent = await api.sendMessage(sender, replyContent);
                setState(prev => ({ ...prev, messages: [...prev.messages, sent] }));
                addLog(`Sent auto-reply DM to ${sender}.`, 'success');
                break;
            }

            case 'reply_comment': {
                const meta = task.metadata as {
                    postId?: string;
                    commenter?: string;
                    commentText?: string;
                } | undefined;
                if (!meta?.postId) {
                    addLog("No post id for comment reply task", 'error');
                    break;
                }

                const commenter = meta.commenter || 'friend';
                const commentText = meta.commentText || '';
                const replyText = `Thanks ${commenter}! Appreciate your thoughts${commentText ? ` on "${commentText.slice(0, 60)}"` : ''}.`;

                await mockSocialMedia.addComment(meta.postId, replyText, 'agent');

                // Reflect reply in local state for UI
                setState(prev => ({
                    ...prev,
                    posts: prev.posts.map(p => p.id === meta.postId
                        ? {
                            ...p,
                            simulatedComments: [
                                {
                                    id: `agent_reply_${Date.now()}`,
                                    username: 'agent',
                                    text: replyText,
                                    timestamp: new Date().toISOString(),
                                    likes: 0
                                },
                                ...(p.simulatedComments || [])
                            ]
                        }
                        : p)
                }));

                addLog(`Replied to comment from ${commenter}.`, 'success');
                break;
            }
        }

        // Complete task
        setState(prev => ({
            ...prev,
            currentTask: null,
            tasks: prev.tasks.map(t => t.id === task.id ? { ...t, status: 'completed', completedAt: Date.now() } : t)
        }));
    }, [addLog, addTask]);

    // Main Agent Loop
    useEffect(() => {
        if (!state.isActive) return;

        const loop = async () => {
            // If busy, do nothing (wait for current task to finish)
            if (state.currentTask) return;

            // 1. Check for pending tasks
            const nextTask = state.tasks.find(t => t.status === 'pending');
            if (nextTask) {
                // Start task
                setState(prev => ({
                    ...prev,
                    currentTask: nextTask,
                    tasks: prev.tasks.map(t => t.id === nextTask.id ? { ...t, status: 'in_progress' } : t)
                }));

                try {
                    await executeTask(nextTask);
                } catch {
                    addLog(`Task failed: ${nextTask.description}`, 'error');
                    setState(prev => ({
                        ...prev,
                        currentTask: null,
                        tasks: prev.tasks.map(t => t.id === nextTask.id ? { ...t, status: 'failed' } : t)
                    }));
                }
                return;
            }

            // 2. If no tasks, Plan! (Simple planning logic)
            if (state.tasks.length === 0) {
                addLog("No tasks in queue. Planning content...", 'info');
                addTask("Check DMs", "check_dms");
                addTask("Plan morning post", "plan_content");
                return;
            }
        };

        const timer = setInterval(loop, 1000); // Check every second
        return () => clearInterval(timer);
    }, [state.isActive, state.currentTask, state.tasks, executeTask, addLog, addTask]);

    const generateSummary = useCallback(() => {
        const totalPosts = state.posts.length;
        const totalDMs = state.messages.filter(m => m.isFromAgent).length;
        const totalTasks = state.tasks.filter(t => t.status === 'completed').length;

        const summary = `
    📊 END OF DAY REPORT 📊
    -------------------------
    ✅ Tasks Completed: ${totalTasks}
    📸 Posts Published: ${totalPosts}
    💬 DMs Replied: ${totalDMs}
    -------------------------
    Agent shutting down for the day.
    `;

        addLog(summary, 'success');
        setState(prev => ({ ...prev, isActive: false })); // Stop agent
        alert(summary); // Simple UI for demo
    }, [state.posts.length, state.messages, state.tasks, addLog]);

    const startWorkflow = useCallback((config: WorkflowConfig) => {
        addLog(`Starting workflow: ${config.type}`, 'warning');

        // Reset state or keep logged in? Let's keep logged in but clear tasks? 
        // For now, let's just append tasks to start fresh-ish.
        setState(prev => ({ ...prev, isActive: true }));

        if (config.enableDMs) {
            addTask("Check DMs", "check_dms");
        }

        if (config.individualPosts && config.individualPosts.length > 0) {
            config.individualPosts.forEach(post => {
                addTask(`Plan and post to ${post.platform}: ${post.topic}`, "plan_content");
            });
        } else if (config.postCount > 0) {
            for (let i = 0; i < config.postCount; i++) {
                addTask(`Plan generic post #${i + 1}`, "plan_content");
            }
        }

        if (config.type === 'full_day') {
            // Maybe add long running background monitoring?
        }
    }, [addLog, addTask]);

    return { state, toggleAgent, addTask, generateSummary, startWorkflow, sendChatMessage };
}
