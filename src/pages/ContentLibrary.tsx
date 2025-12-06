import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAgentContext } from '../lib/AgentContext';
import { Film, Calendar, CheckCircle2, Clock, AlertCircle, Play, Eye, Heart, MessageCircle, Share2, Sparkles, GitBranch, X, ChevronRight, Inbox, Reply } from 'lucide-react';
import type { PlannedPost, ContentBranch } from '../lib/types';

const ContentLibrary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state, addTask, toggleAgent } = useAgentContext();
    const processedRef = useRef(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
    const [contentBranches, setContentBranches] = useState<Record<string, ContentBranch[]>>({});

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

    type FeedbackItem = {
        id: string;
        type: 'comment' | 'dm';
        author: string;
        message: string;
        timestamp: number;
        sentiment: 'positive' | 'neutral';
    };

    // Build combined feedback (comments + DMs) scoped to a piece of content
    const getFeedbackForContent = (taskId: string): FeedbackItem[] => {
        const post = getPostForTask(taskId);
        const postTime = post?.timestamp ?? Date.now();

        const commentItems: FeedbackItem[] = post?.simulatedComments?.map((comment) => ({
            id: comment.id,
            type: 'comment',
            author: comment.username,
            message: comment.text,
            timestamp: new Date(comment.timestamp).getTime(),
            sentiment: comment.likes > 10 ? 'positive' : 'neutral'
        })) || [];

        // If we only have a numeric comment count, generate a light placeholder entry
        if (!commentItems.length && typeof post?.comments === 'number' && post.comments > 0) {
            commentItems.push({
                id: `${taskId}-comment-placeholder`,
                type: 'comment',
                author: 'community',
                message: `${post.comments} comments recorded for this post.`,
                timestamp: postTime,
                sentiment: 'neutral'
            });
        }

        const dmItems: FeedbackItem[] = state.messages
            .filter(msg => !msg.isFromAgent && Math.abs(msg.timestamp - postTime) < 1000 * 60 * 60 * 6) // within 6h of post
            .map(msg => ({
                id: msg.id,
                type: 'dm',
                author: msg.sender,
                message: msg.content,
                timestamp: msg.timestamp,
                sentiment: 'neutral'
            }))
            .slice(0, 10); // cap for readability

        // If no time-aligned DMs, surface the latest 2 as a general signal
        if (!dmItems.length) {
            const fallback = state.messages.filter(m => !m.isFromAgent).slice(0, 2);
            fallback.forEach(msg => {
                dmItems.push({
                    id: `${msg.id}-fallback`,
                    type: 'dm',
                    author: msg.sender,
                    message: msg.content,
                    timestamp: msg.timestamp,
                    sentiment: 'neutral'
                });
            });
        }

        return [...commentItems, ...dmItems].sort((a, b) => b.timestamp - a.timestamp);
    };

    const selectedPost = selectedContentId ? getPostForTask(selectedContentId) : null;
    const selectedFeedback = useMemo(() => selectedContentId ? getFeedbackForContent(selectedContentId) : [], [selectedContentId, state.messages, state.posts]);

    // Generate branches for a content (variations for different platforms/styles)
    const generateBranchesForContent = (task: any, metadata: any): ContentBranch[] => {
        const baseContent = {
            mediaUrl: metadata?.uploadedMedia || metadata?.imageUrl,
            caption: task.description,
            postType: (metadata?.mediaType === 'video' ? 'reel' : 'photo') as 'photo' | 'reel',
        };

        // Create original branch
        const originalBranch: ContentBranch = {
            id: `${task.id}-original`,
            name: 'Original',
            caption: baseContent.caption,
            hashtags: ['#original', '#content'],
            mediaUrl: baseContent.mediaUrl,
            platform: metadata?.platform || 'instagram',
            postType: baseContent.postType,
            isSelected: true,
            createdAt: Date.now(),
        };

        // Create platform variants
        const platforms = ['instagram', 'tiktok', 'threads'];
        const variantBranches: ContentBranch[] = platforms
            .filter(p => p !== originalBranch.platform)
            .map((platform, idx) => ({
                id: `${task.id}-${platform}`,
                parentId: originalBranch.id,
                name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Variant`,
                caption: `${baseContent.caption} - Optimized for ${platform}`,
                hashtags: [`#${platform}`, '#viral', '#trending'],
                mediaUrl: baseContent.mediaUrl,
                platform,
                postType: baseContent.postType,
                isSelected: false,
                createdAt: Date.now() + idx * 1000,
            }));

        // Create editing style variants
        const styleVariants: ContentBranch[] = [
            {
                id: `${task.id}-casual`,
                parentId: originalBranch.id,
                name: 'Casual Style',
                caption: `${baseContent.caption} ✨ keeping it real`,
                hashtags: ['#casual', '#authentic', '#vibes'],
                mediaUrl: baseContent.mediaUrl,
                platform: originalBranch.platform,
                postType: baseContent.postType,
                isSelected: false,
                createdAt: Date.now() + 3000,
            },
            {
                id: `${task.id}-professional`,
                parentId: originalBranch.id,
                name: 'Professional Style',
                caption: `${baseContent.caption.split(':')[0]}: Professional insights and updates`,
                hashtags: ['#professional', '#business', '#growth'],
                mediaUrl: baseContent.mediaUrl,
                platform: originalBranch.platform,
                postType: baseContent.postType,
                isSelected: false,
                createdAt: Date.now() + 4000,
            },
        ];

        return [originalBranch, ...variantBranches, ...styleVariants];
    };

    // Handle content card click
    const handleContentClick = (taskId: string) => {
        if (selectedContentId === taskId) {
            setSelectedContentId(null);
        } else {
            setSelectedContentId(taskId);

            // Generate branches if not already generated
            if (!contentBranches[taskId]) {
                const task = state.tasks.find(t => t.id === taskId);
                if (task) {
                    const metadata = task.metadata as any;
                    const branches = generateBranchesForContent(task, metadata);
                    setContentBranches(prev => ({ ...prev, [taskId]: branches }));
                }
            }
        }
    };

    // Toggle branch selection
    const toggleBranchSelection = (taskId: string, branchId: string) => {
        setContentBranches(prev => ({
            ...prev,
            [taskId]: prev[taskId]?.map(branch =>
                branch.id === branchId
                    ? { ...branch, isSelected: !branch.isSelected }
                    : branch
            ) || []
        }));
    };

    // Render branch tree
    const renderBranch = (branch: ContentBranch, taskId: string, depth: number = 0) => {
        const children = contentBranches[taskId]?.filter(b => b.parentId === branch.id) || [];

        return (
            <div key={branch.id} className={`${depth > 0 ? 'ml-8 mt-3' : 'mb-3'}`}>
                <div className="flex items-start gap-3">
                    {/* Connector Line */}
                    {depth > 0 && (
                        <div className="absolute left-4 top-0 w-4 h-4 border-l-2 border-b-2 border-gray-300 rounded-bl-lg" />
                    )}

                    {/* Selection Checkbox */}
                    <button
                        onClick={() => toggleBranchSelection(taskId, branch.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            branch.isSelected
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-green-400'
                        }`}
                    >
                        {branch.isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>

                    {/* Branch Card */}
                    <div className={`flex-1 bg-white rounded-lg border-2 transition-all ${
                        branch.isSelected
                            ? 'border-green-400 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}>
                        <div className="p-3">
                            <div className="flex items-start gap-3">
                                {/* Thumbnail */}
                                {branch.mediaUrl && (
                                    <div className="relative">
                                        <img
                                            src={branch.mediaUrl}
                                            alt={branch.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        {branch.postType === 'reel' && (
                                            <Play className="absolute inset-0 m-auto w-6 h-6 text-white opacity-80" fill="currentColor" />
                                        )}
                                    </div>
                                )}

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-sm text-gray-900">{branch.name}</h4>
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full capitalize">
                                            {branch.platform}
                                        </span>
                                        {depth === 0 && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                Root
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-700 mb-2 line-clamp-2">{branch.caption}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {branch.hashtags.slice(0, 3).map(tag => (
                                            <span key={tag} className="text-xs text-blue-600">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Children */}
                {children.length > 0 && (
                    <div className="relative mt-2">
                        {children.map(child => renderBranch(child, taskId, depth + 1))}
                    </div>
                )}
            </div>
        );
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
            ) : selectedContentId ? (
                // Expanded Branch View
                <div className="max-w-6xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <GitBranch className="w-6 h-6 text-purple-600" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Content Variations</h2>
                                <p className="text-sm text-gray-600">Select which variations to publish</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedContentId(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                        >
                            <X className="w-4 h-4" />
                            Close
                        </button>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 space-y-6">
                            {/* Branch Stats */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <GitBranch className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {contentBranches[selectedContentId]?.length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Total Variants</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-green-600">
                                                {contentBranches[selectedContentId]?.filter(b => b.isSelected).length || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Selected</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-blue-600">
                                                {new Set(contentBranches[selectedContentId]?.map(b => b.platform)).size || 0}
                                            </div>
                                            <div className="text-xs text-gray-600">Platforms</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Branch Tree */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="mb-4 pb-4 border-b border-gray-200">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <GitBranch className="w-4 h-4" />
                                        Variation Tree
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Each variation is optimized for different platforms and goals
                                    </p>
                                </div>
                                {contentBranches[selectedContentId]
                                    ?.filter(b => !b.parentId)
                                    .map(rootBranch => renderBranch(rootBranch, selectedContentId))}
                            </div>

                            {/* Publish Button */}
                            <div className="flex justify-end">
                                <button
                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 shadow-lg transition-all flex items-center gap-2"
                                    disabled={!contentBranches[selectedContentId]?.some(b => b.isSelected)}
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Publish {contentBranches[selectedContentId]?.filter(b => b.isSelected).length || 0} Selected
                                </button>
                            </div>
                        </div>

                        {/* Feedback Column */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-xs uppercase text-gray-500 tracking-wide">Feedback Stream</p>
                                    <h3 className="text-xl font-semibold text-gray-900">Replies & DMs</h3>
                                </div>
                                <div className="flex items-center gap-2 text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                                    <Inbox className="w-4 h-4" />
                                    {selectedFeedback.length}
                                </div>
                            </div>

                            {selectedPost && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                        <span className="px-2 py-0.5 bg-black text-white rounded-full capitalize">{selectedPost.platform}</span>
                                        <span>{new Date(selectedPost.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">{selectedPost.content}</p>
                                </div>
                            )}

                            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                                {selectedFeedback.length === 0 && (
                                    <div className="text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg p-4 text-center">
                                        No feedback yet — we’ll show replies and DMs here.
                                    </div>
                                )}
                                {selectedFeedback.map(item => (
                                    <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:border-indigo-200 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${item.type === 'comment' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {item.type === 'comment' ? 'Reply' : 'DM'}
                                                </span>
                                                <span className="text-xs text-gray-500">{item.author}</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400">
                                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800">{item.message}</p>
                                        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                                            <span className={item.sentiment === 'positive' ? 'text-green-600' : 'text-gray-500'}>
                                                {item.sentiment === 'positive' ? 'Engaged' : 'Neutral'}
                                            </span>
                                            <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold">
                                                <Reply className="w-3.5 h-3.5" />
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
                        const branchCount = contentBranches[task.id]?.length || 0;

                        return (
                            <div
                                key={task.id}
                                onClick={() => handleContentClick(task.id)}
                                className={`bg-surface rounded-xl border ${statusDisplay.border} overflow-hidden hover:shadow-lg transition-all group cursor-pointer relative`}
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

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                                                <GitBranch className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm font-semibold text-gray-900">View Variations</span>
                                                <ChevronRight className="w-4 h-4 text-gray-600" />
                                            </div>
                                        </div>
                                    </div>

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
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-primary line-clamp-2 flex-1">
                                            {task.description}
                                        </h3>
                                        {branchCount > 0 && (
                                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                                <GitBranch className="w-3 h-3" />
                                                {branchCount}
                                            </span>
                                        )}
                                    </div>

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
