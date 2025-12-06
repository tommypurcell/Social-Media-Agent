import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAgentContext } from '../lib/AgentContext';
import { Activity, Clock, FileVideo, CheckCircle2, AlertCircle, Play, Sparkles, Target } from 'lucide-react';
import { NewWorkflowModal } from '../components/NewWorkflowModal';
import type { WorkflowConfig, PlannedPost } from '../lib/types';
import { useOnboarding } from '../hooks/useOnboarding';

const AgentMonitor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, addTask, toggleAgent } = useAgentContext();
    const { onboardingData } = useOnboarding();
    const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
    const processedRef = useRef(false);

    // Handle return from Workflow Planner
    useEffect(() => {
        if (location.state?.plannedPosts && !processedRef.current) {
            const posts = location.state.plannedPosts as PlannedPost[];
            console.log("Received planned posts:", posts);

            posts.forEach(post => {
                // Determine stage based on post status/content
                const taskType = post.imagePrompt ? 'generate_media' : 'post_content';
                const description = post.imagePrompt
                    ? `Generate Image: '${post.imagePrompt}' for ${post.platform}`
                    : `Post to ${post.platform}: ${post.caption.substring(0, 30)}...`;

                addTask(description, taskType);
            });

            // Auto-start the agent if it's not running
            if (!state.isActive) {
                toggleAgent();
            }

            processedRef.current = true;
            // Clear location state to prevent duplicate addition
            window.history.replaceState({}, document.title);
        }
    }, [location.state, addTask, toggleAgent, state.isActive]);

    const handleStartWorkflow = (config: WorkflowConfig) => {
        console.log('Starting workflow with config:', config);
        navigate('/workflow-planner', { state: { config } });
    };

    // Map real tasks to UI format
    const activeTasks = state.tasks.map(task => ({
        id: task.id,
        title: task.description.split(':')[1] || task.description,
        status: task.status === 'in_progress' ? 'processing' : task.status === 'pending' ? 'queued' : task.status,
        stage: task.type.replace('_', ' ').toUpperCase(),
        progress: task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0,
        platform: task.description.toLowerCase().includes('instagram') ? 'Instagram' :
            task.description.toLowerCase().includes('tiktok') ? 'TikTok' : 'Social',
        thumbnail: null
    }));

    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const firstName = onboardingData?.fullName.split(' ')[0] || 'there';

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8">
            {/* Personalized Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl font-bold text-primary">
                        {getGreeting()}, {firstName}!
                    </h1>
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-secondary">Real-time supervision of your Marathon Agent activities.</p>

                {/* User Profile Summary */}
                {onboardingData && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        {onboardingData.primaryUseCase && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-sm">
                                <Target className="w-4 h-4 text-indigo-600" />
                                <span className="text-indigo-700 font-medium">{onboardingData.primaryUseCase}</span>
                            </div>
                        )}
                        {onboardingData.platforms && onboardingData.platforms.length > 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-sm">
                                <span className="text-purple-700 font-medium">
                                    {onboardingData.platforms.length} Platform{onboardingData.platforms.length !== 1 ? 's' : ''} Connected
                                </span>
                            </div>
                        )}
                        {onboardingData.goals && onboardingData.goals.length > 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm">
                                <span className="text-green-700 font-medium">
                                    {onboardingData.goals.length} Active Goal{onboardingData.goals.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Personalized Quick Actions */}
            {onboardingData && onboardingData.goals && onboardingData.goals.length > 0 && (
                <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {onboardingData.goals.includes('content-creation') && (
                            <button
                                onClick={() => navigate('/workflow-planner')}
                                className="p-4 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
                                    <FileVideo className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Plan Content</h3>
                                <p className="text-xs text-gray-600">Create your next post</p>
                            </button>
                        )}
                        {onboardingData.goals.includes('analytics') && (
                            <button
                                onClick={() => navigate('/reports')}
                                className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                                    <Activity className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
                                <p className="text-xs text-gray-600">Check performance</p>
                            </button>
                        )}
                        {onboardingData.goals.includes('engagement') && (
                            <button
                                onClick={() => navigate('/feed')}
                                className="p-4 bg-white rounded-lg border border-pink-200 hover:border-pink-400 hover:shadow-md transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-pink-200 transition-colors">
                                    <CheckCircle2 className="w-5 h-5 text-pink-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Engage Audience</h3>
                                <p className="text-xs text-gray-600">Respond to comments</p>
                            </button>
                        )}
                        {onboardingData.goals.includes('audience-growth') && (
                            <button
                                onClick={() => navigate('/planner')}
                                className="p-4 bg-white rounded-lg border border-green-200 hover:border-green-400 hover:shadow-md transition-all text-left group"
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                                    <Target className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">Growth Strategy</h3>
                                <p className="text-xs text-gray-600">Plan your growth</p>
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Status Overview Card */}
                <div className="col-span-full xl:col-span-3 bg-surface rounded-xl shadow-sm border border-border p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${state.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Activity className={`w-8 h-8 ${state.isActive ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary">
                                System Status: {state.isActive ? 'Active - Autonomous' : 'Standby'}
                            </h3>
                            <p className="text-sm text-secondary">
                                {state.tasks.filter(t => t.status === 'in_progress').length} jobs running, {state.tasks.filter(t => t.status === 'pending').length} queued.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <span className="block text-2xl font-bold text-primary">
                                {state.tasks.filter(t => t.status === 'completed').length}
                            </span>
                            <span className="text-xs text-secondary uppercase tracking-wider">Completed</span>
                        </div>
                        <div className="text-right border-l border-border pl-4">
                            <span className="block text-2xl font-bold text-accent">
                                {state.tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length}
                            </span>
                            <span className="text-xs text-secondary uppercase tracking-wider">Pending</span>
                        </div>
                    </div>
                </div>

                {activeTasks.map((task) => (
                    <div key={task.id} className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                        <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {task.thumbnail ? (
                                <>
                                    <img src={task.thumbnail} alt={task.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                                    {task.status === 'completed' && <Play className="absolute w-12 h-12 text-white opacity-80" fill="currentColor" />}
                                </>
                            ) : (
                                <FileVideo className="w-12 h-12 text-gray-300" />
                            )}

                            <div className="absolute top-3 right-3 py-1 px-3 rounded-full bg-surface/90 backdrop-blur-sm text-xs font-bold text-primary shadow-sm">
                                {task.platform}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg text-primary truncate max-w-[80%]">{task.title}</h3>
                                {task.status === 'processing' && <Clock className="w-5 h-5 text-accent animate-spin-slow" />}
                                {task.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                {task.status === 'queued' && <Clock className="w-5 h-5 text-gray-400" />}
                                {task.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">{task.stage}</span>
                                    <span className="font-medium text-primary">{task.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${task.status === 'completed' ? 'bg-green-500' :
                                            task.status === 'processing' ? 'bg-accent' :
                                                'bg-gray-300'
                                            }`}
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Upload New Card */}
                <div
                    onClick={() => setIsWorkflowModalOpen(true)}
                    className="bg-surface rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer min-h-[300px]"
                >
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <FileVideo className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg text-primary mb-1">New Workflow</h3>
                    <p className="text-secondary text-center max-w-xs text-sm">Upload raw video & prompts. The Agent will handle the rest.</p>
                </div>

            </div>

            {/* New Workflow Modal */}
            <NewWorkflowModal
                isOpen={isWorkflowModalOpen}
                onClose={() => setIsWorkflowModalOpen(false)}
                onStart={handleStartWorkflow}
            />
        </div>
    );
};

export default AgentMonitor;
