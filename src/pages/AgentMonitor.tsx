import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAgentContext } from '../lib/AgentContext';
import { Activity, Clock, FileVideo, Play, Sparkles, Target, Square, Calendar } from 'lucide-react';
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
                // Create post_content task with all necessary metadata
                const description = `Post to ${post.platform}: ${post.caption.substring(0, 30)}...`;

                addTask(description, 'post_content', {
                    platform: post.platform,
                    caption: post.caption,
                    mediaType: post.postType === 'reel' ? 'video' : 'image',
                    uploadedMedia: post.uploadedImage, // Use uploaded media if available
                    imageUrl: post.uploadedImage || undefined,
                });
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
        thumbnail: null,
        timestamp: task.completedAt || task.createdAt // Use completedAt for order if done, else cratedAt
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
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleAgent}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm ${state.isActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:shadow-red-100'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200'
                                }`}
                        >
                            {state.isActive ? (
                                <>
                                    <Square className="w-4 h-4 fill-current" />
                                    Stop Agent
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 fill-current" />
                                    Start Agent
                                </>
                            )}
                        </button>

                        <div className="flex gap-4 border-l border-border pl-6">
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
                </div>

                {/* Timeline View */}
                <div className="col-span-full xl:col-span-3">
                    <div className="space-y-8">
                        {/* Group tasks by date */}
                        {Object.entries(activeTasks.reduce((groups, task) => {
                            const date = new Date(task.timestamp || Date.now()).toLocaleDateString(undefined, {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            });
                            if (!groups[date]) groups[date] = [];
                            groups[date].push(task);
                            return groups;
                        }, {} as Record<string, typeof activeTasks>)).map(([date, tasks]) => (
                            <div key={date} className="relative">
                                {/* Date Header (Sticky) */}
                                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 mb-4 border-b border-border">
                                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {date}
                                    </h3>
                                </div>

                                {/* Timeline Items */}
                                <div className="relative ml-3 space-y-6 pl-8 border-l-2 border-border/50">
                                    {tasks.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).map((task) => (
                                        <div key={task.id} className="relative group">
                                            {/* Timeline Node */}
                                            <div className={`absolute -left-[39px] mt-1.5 w-5 h-5 rounded-full border-4 border-background transition-colors ${task.status === 'processing' ? 'bg-accent animate-pulse' :
                                                task.status === 'completed' ? 'bg-green-500' :
                                                    task.status === 'failed' ? 'bg-red-500' :
                                                        'bg-gray-300'
                                                }`} />

                                            {/* Content Card */}
                                            <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-md transition-shadow group-hover:border-accent/30">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${task.status === 'processing' ? 'bg-accent/10 text-accent' :
                                                                task.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {task.status}
                                                            </span>
                                                            <span className="text-xs text-secondary">
                                                                {new Date(task.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-base font-semibold text-primary truncate">
                                                            {task.title}
                                                        </h4>
                                                        <p className="text-sm text-secondary mt-1">
                                                            {task.platform} • {task.stage}
                                                        </p>

                                                        {/* Progress Bar for Active Tasks */}
                                                        {task.status === 'processing' && (
                                                            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-accent rounded-full animate-progress" style={{ width: '60%' }} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Thumbnail (if exists) */}
                                                    {task.thumbnail && (
                                                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                                            <img src={task.thumbnail} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {activeTasks.length === 0 && (
                            <div className="text-center py-12 text-secondary">
                                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No activity yet. Start the agent to see the timeline.</p>
                            </div>
                        )}
                    </div>
                </div>

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
