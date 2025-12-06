import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAgentContext } from '../lib/AgentContext';
import { Film, Calendar, CheckCircle2, Clock, AlertCircle, Play, Eye, Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';
import type { PlannedPost } from '../lib/types';

const ContentLibrary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, addTask, toggleAgent } = useAgentContext();
    const processedRef = useRef(false);
    const [notification, setNotification] = useState<string | null>(null);

    // Handle return from Workflow Planner
    useEffect(() => {
        if (location.state?.plannedPosts && !processedRef.current) {
            const posts = location.state.plannedPosts as PlannedPost[];
            const message = location.state.message as string | undefined;

            console.log("Received planned posts:", posts);

            // Show notification
            if (message) {
                setNotification(message);
                setTimeout(() => setNotification(null), 5000);
            }

            posts.forEach(post => {
                // Create post_content task with all necessary metadata
                const description = `Post to ${post.platform}: ${post.caption.substring(0, 30)}...`;

                addTask(description, 'post_content', {
                    platform: post.platform,
                    caption: post.caption,
                    mediaType: post.postType === 'reel' ? 'video' : 'image',
                    uploadedMedia: post.uploadedImage,
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

    // Get status icon and color
    const getStatusDisplay = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    icon: CheckCircle2,
                    text: 'Published',
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                    border: 'border-green-200'
                };
            case 'in_progress':
                return {
                    icon: Clock,
                    text: 'Processing',
                    color: 'text-orange-600',
                    bg: 'bg-orange-50',
                    border: 'border-orange-200'
                };
            case 'pending':
                return {
                    icon: Clock,
                    text: 'Queued',
                    color: 'text-gray-600',
                    bg: 'bg-gray-50',
                    border: 'border-gray-200'
                };
            case 'failed':
                return {
                    icon: AlertCircle,
                    text: 'Failed',
                    color: 'text-red-600',
                    bg: 'bg-red-50',
                    border: 'border-red-200'
                };
            default:
                return {
                    icon: Clock,
                    text: 'Unknown',
                    color: 'text-gray-600',
                    bg: 'bg-gray-50',
                    border: 'border-gray-200'
                };
        }
    };

    // Find corresponding post for each task
    const getPostForTask = (taskId: string) => {
        return state.posts.find(post => post.id.includes(taskId)) || state.posts[state.posts.length - 1];
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8">
            {/* Notification */}
            {notification && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
                    <Sparkles className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">{notification}</p>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Content Pipeline</h1>
                    <p className="text-secondary">Track your content as it moves through the workflow.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{state.tasks.length}</div>
                        <div className="text-xs text-secondary uppercase tracking-wide">Total Tasks</div>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{state.posts.length}</div>
                        <div className="text-xs text-secondary uppercase tracking-wide">Published</div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            {state.tasks.length === 0 ? (
                <div className="bg-surface rounded-xl shadow-sm border border-border p-12 text-center">
                    <Film className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No content yet</h3>
                    <p className="text-gray-600 mb-6">Start a new workflow to create and publish content.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-sm transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {state.tasks.map((task) => {
                        const statusDisplay = getStatusDisplay(task.status);
                        const StatusIcon = statusDisplay.icon;
                        const post = getPostForTask(task.id);
                        const metadata = task.metadata as {
                            platform?: string;
                            uploadedMedia?: string;
                            imageUrl?: string;
                            mediaType?: string;
                        } | undefined;

                        const platform = metadata?.platform || 'instagram';
                        const mediaUrl = metadata?.uploadedMedia || metadata?.imageUrl || post?.image;
                        const mediaType = metadata?.mediaType || 'image';

                        return (
                            <div
                                key={task.id}
                                className={`bg-surface rounded-xl border ${statusDisplay.border} overflow-hidden hover:shadow-lg transition-all group`}
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {mediaUrl ? (
                                        <>
                                            <img
                                                src={mediaUrl}
                                                alt={task.description}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {mediaType === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Play className="w-12 h-12 text-white opacity-80" fill="currentColor" />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Film className="w-12 h-12 text-gray-300" />
                                    )}

                                    {/* Platform Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full capitalize">
                                            {platform}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <div className={`px-3 py-1 ${statusDisplay.bg} backdrop-blur-sm rounded-full flex items-center gap-1.5 border ${statusDisplay.border}`}>
                                            <StatusIcon className={`w-3.5 h-3.5 ${statusDisplay.color} ${task.status === 'in_progress' ? 'animate-spin' : ''}`} />
                                            <span className={`text-xs font-semibold ${statusDisplay.color}`}>
                                                {statusDisplay.text}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Info */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                                        {task.description}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xs text-secondary mb-4">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date().toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className="capitalize">{mediaType}</span>
                                    </div>

                                    {/* Engagement Stats (if published) */}
                                    {task.status === 'completed' && post && post.engagement && (
                                        <div className="pt-4 border-t border-border">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Eye className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-xs text-secondary">Views</div>
                                                        <div className="text-sm font-semibold text-primary">
                                                            {post.engagement.views.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-xs text-secondary">Likes</div>
                                                        <div className="text-sm font-semibold text-primary">
                                                            {post.engagement.likes.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MessageCircle className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-xs text-secondary">Comments</div>
                                                        <div className="text-sm font-semibold text-primary">
                                                            {post.engagement.comments}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Share2 className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-xs text-secondary">Shares</div>
                                                        <div className="text-sm font-semibold text-primary">
                                                            {post.engagement.shares}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Progress Bar (if in progress) */}
                                    {task.status === 'in_progress' && (
                                        <div className="pt-4 border-t border-border">
                                            <div className="flex items-center justify-between text-xs text-secondary mb-2">
                                                <span>Processing...</span>
                                                <span>50%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"
                                                    style={{ width: '50%' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ContentLibrary;
