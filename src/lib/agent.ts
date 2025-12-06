import { useState, useEffect, useCallback } from 'react';
import type { AgentState, Task, Log } from './types';
import { mockApi } from './mock-api';

const INITIAL_STATE: AgentState = {
    isActive: false,
    currentTask: null,
    tasks: [],
    posts: [],
    messages: [],
    logs: []
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

    const addTask = useCallback((description: string, type: Task['type']) => {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            status: 'pending',
            description
        };
        setState(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask]
        }));
        addLog(`Scheduled task: ${description}`);
    }, [addLog]);

    const toggleAgent = () => {
        setState(prev => ({ ...prev, isActive: !prev.isActive }));
        addLog(state.isActive ? "Agent stopped." : "Agent started.", 'warning');
    };

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
                } catch (error) {
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
    }, [state.isActive, state.currentTask, state.tasks]); // Dependencies

    const executeTask = async (task: Task) => {
        addLog(`Executing: ${task.description}...`);

        // Simulate thinking/working
        await new Promise(r => setTimeout(r, 1000));

        switch (task.type) {
            case 'check_dms':
                const newMsgs = await mockApi.fetchMessages();
                if (newMsgs.length > 0) {
                    addLog(`Received ${newMsgs.length} new DM(s).`, 'success');
                    setState(prev => ({ ...prev, messages: [...prev.messages, ...newMsgs] }));
                    // Auto-reply logic
                    newMsgs.forEach(msg => {
                        addTask(`Reply to ${msg.sender}: "Thanks for reaching out!"`, 'reply_dm');
                    });
                } else {
                    addLog("Checked DMs: No new messages.");
                }
                break;

            case 'plan_content':
                addTask("Generate Image: 'Sunset in futuristic city'", "generate_media");
                break;

            case 'generate_media':
                const prompt = task.description.split("'")[1] || "A cool image";
                await mockApi.generateImage(prompt);
                addLog(`Generated Media for: ${prompt}`, 'success');
                addTask(`Post to Instagram: ${prompt}`, 'post_content');
                // Store the generated image/prompt in detailed state if needed, but here we just pass it via description or assume context
                // For simplicity, we'll embed the image url in the next task description or store it? 
                // Let's cheat and store it in a temp way or just regenerate (mock).
                // Better: addTask can take metadata. But keeping it simple.
                break;

            case 'post_content':
                const content = task.description.split(": ")[1];
                const post = await mockApi.postToInstagram(content, "https://placehold.co/600x400"); // using static/mock for now since we didn't pass state
                addLog(`Posted to Instagram: ${post.id}`, 'success');
                setState(prev => ({ ...prev, posts: [post, ...prev.posts] }));
                break;

            case 'reply_dm':
                const replyContent = "I'm just an AI agent running a simulation! 🤖";
                await mockApi.sendMessage("user", replyContent);
                addLog("Sent reply DM.", 'success');
                break;
        }

        // Complete task
        setState(prev => ({
            ...prev,
            currentTask: null,
            tasks: prev.tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t)
        }));
    };

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

    return { state, toggleAgent, addTask, generateSummary };
}
