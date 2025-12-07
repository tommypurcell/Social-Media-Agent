import { useMemo, useState } from 'react';
import { Feed } from '../components/Feed';
import { useAgentContext } from '../lib/AgentContext';
import { generateBranchesForContent } from '../lib/utils';
import type { Post, ContentBranch } from '../lib/types';
import { Instagram, Music, MessageSquare, GitBranch, X, Video, Inbox, MessageCircle, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FeedbackItem = {
    id: string;
    type: 'reply' | 'dm';
    author: string;
    message: string;
    platform: 'instagram' | 'tiktok' | 'threads';
    timestamp: number;
};

const SampleFeedPage = () => {
    const { state } = useAgentContext();
    const navigate = useNavigate();
    const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | 'threads'>('instagram');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [branches, setBranches] = useState<ContentBranch[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ replies: FeedbackItem[]; dms: FeedbackItem[] } | null>(null);

    // Only show real posts from the agent
    const allPosts = useMemo(() => {
        return state.posts.map(p => ({
            ...p,
            mediaUrl: p.mediaUrl || p.image,
            mediaType: p.mediaType || 'image',
        })).sort((a, b) => b.timestamp - a.timestamp);
    }, [state.posts]);

    // Filter posts by platform
    const filteredPosts = allPosts.filter(post => post.platform === selectedPlatform);

    const platforms = [
        { id: 'instagram' as const, name: 'Instagram', icon: Instagram },
        { id: 'tiktok' as const, name: 'TikTok', icon: Music },
        { id: 'threads' as const, name: 'Threads', icon: MessageSquare },
    ];

    // Helper to generate simulated feedback for a specific branch
    const buildBranchFeedback = (branch: ContentBranch, post: Post) => {
        const baseComments = post.simulatedComments || [];

        const replies: FeedbackItem[] = baseComments.slice(0, 5).map((c, idx) => ({
            id: `${branch.id}-reply-${idx}-${c.id}`,
            type: 'reply' as const,
            author: c.username,
            message: c.text,
            platform: branch.platform as 'instagram' | 'tiktok' | 'threads',
            timestamp: new Date(c.timestamp).getTime(),
        }));

        // If no real comments, maybe show emptry or generated ones? 
        // For now, let's keep it purely data-driven. If no comments, show none.
        // But if we want to simulate "engagement" for the demo feeling on NEW posts:
        if (replies.length === 0 && post.status === 'uploaded') {
            replies.push({
                id: `${branch.id}-reply-sim`,
                type: 'reply',
                author: 'early_fan',
                message: `Loving this variant on ${branch.platform}!`,
                platform: branch.platform as 'instagram' | 'tiktok' | 'threads',
                timestamp: Date.now(),
            });
        }

        // Simulate DMs if enabled in state
        const dms: FeedbackItem[] = [];
        // We could pull from state.messages if we wanted real DMs, similar to Reports.tsx
        // For now, let's leave DMs empty unless real data exists to avoid "fake" feeling.
        state.messages.forEach((msg) => {
            if (!msg.isFromAgent && Math.abs(msg.timestamp - post.timestamp) < 3600000 * 24) {
                dms.push({
                    id: msg.id,
                    type: 'dm',
                    author: msg.sender,
                    message: msg.content,
                    platform: post.platform, // Assumed
                    timestamp: msg.timestamp
                });
            }
        });

        return { replies, dms };
    };

    const handleSelectPost = (post: Post) => {
        setSelectedPost(post);

        // Use the shared utility to generate branches
        const builtBranches = generateBranchesForContent(
            { id: post.id, description: post.content },
            {
                uploadedMedia: post.mediaUrl,
                imageUrl: post.image,
                mediaType: post.mediaType,
                platform: post.platform
            }
        );

        setBranches(builtBranches);
        const root = builtBranches.find(b => !b.parentId);
        setSelectedBranchId(root?.id || null);
        setFeedback(root ? buildBranchFeedback(root, post) : null);
    };

    const handleSelectBranch = (branch: ContentBranch, post: Post) => {
        setSelectedBranchId(branch.id);
        setFeedback(buildBranchFeedback(branch, post));
    };

    const renderBranch = (branch: ContentBranch, depth = 0) => {
        const children = branches.filter(b => b.parentId === branch.id);
        const isSelected = branch.id === selectedBranchId;
        return (
            <div key={branch.id} className={`${depth > 0 ? 'ml-6 mt-3' : 'mb-3'}`}>
                <div
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-200'}`}
                    onClick={() => selectedPost && handleSelectBranch(branch, selectedPost)}
                >
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            {branch.postType === 'reel' ? (
                                <Video className="w-5 h-5 text-gray-600" />
                            ) : (
                                <GitBranch className="w-5 h-5 text-gray-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm text-gray-900">{branch.name}</h4>
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded-full capitalize">
                                    {branch.platform}
                                </span>
                                {depth === 0 && (
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[11px] font-semibold rounded-full">
                                        Root
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-700 line-clamp-2">{branch.caption}</p>
                        </div>
                    </div>
                </div>
                {children.length > 0 && (
                    <div className="relative mt-2">
                        {children.map(child => renderBranch(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full p-6 bg-background">
            <div className="max-w-6xl mx-auto h-full grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-primary mb-1">Feed</h1>
                            <p className="text-secondary">All content in one place.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex gap-2 bg-surface rounded-lg p-1 shadow-sm border border-border">
                                {platforms.map((platform) => {
                                    const Icon = platform.icon;
                                    const isSelected = selectedPlatform === platform.id;
                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => setSelectedPlatform(platform.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${isSelected
                                                ? 'bg-orange-100 text-orange-700 shadow-sm'
                                                : 'text-secondary hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{platform.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Feed Display */}
                    <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-border shadow-sm bg-surface relative">
                        {filteredPosts.length > 0 ? (
                            <Feed posts={filteredPosts} onSelect={handleSelectPost} />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-surface">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <LayoutGrid className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-primary mb-2">No content for {selectedPlatform}</h3>
                                <p className="text-secondary mb-6 max-w-sm">
                                    Start a workflow to generate and schedule {selectedPlatform} posts.
                                </p>
                                <button
                                    onClick={() => navigate('/workflow-planner')}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
                                >
                                    Create Post
                                </button>
                            </div>
                        )}
                    </div>


                    {/* Stats */}
                    {filteredPosts.length > 0 && (
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-secondary">
                            <span>{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{filteredPosts.reduce((sum, p) => sum + (p.likes || 0), 0)} total likes</span>
                            <span>•</span>
                            <span>{filteredPosts.reduce((sum, p) => sum + (typeof p.comments === 'number' ? p.comments : p.comments ? p.comments.length : 0), 0)} total comments</span>
                        </div>
                    )}
                </div>

                {/* Branch Panel */}
                <div className="h-full bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <p className="text-xs uppercase text-gray-500 tracking-wide">Branches</p>
                            <h3 className="text-lg font-semibold text-primary">Content tree</h3>
                        </div>
                        <button
                            onClick={() => { setSelectedPost(null); setBranches([]); }}
                            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                            aria-label="Clear selection"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    {selectedPost ? (
                        <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                <p className="text-xs text-gray-500 capitalize mb-1">{selectedPost.platform}</p>
                                <p className="text-sm font-semibold text-gray-900 line-clamp-3">{selectedPost.content}</p>
                            </div>
                            <div>
                                {branches.filter(b => !b.parentId).map(b => renderBranch(b))}
                            </div>

                            {/* Feedback */}
                            {feedback && selectedBranchId && (
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs uppercase text-gray-500 tracking-wide">Feedback for</p>
                                        <span className="px-2 py-1 text-[11px] rounded-full bg-gray-100 text-gray-700 truncate max-w-[120px]">
                                            {branches.find(b => b.id === selectedBranchId)?.name || 'Branch'}
                                        </span>
                                    </div>

                                    {(feedback.replies.length > 0 || feedback.dms.length > 0) ? (
                                        <>
                                            {feedback.replies.length > 0 && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <MessageCircle className="w-4 h-4 text-blue-600" />
                                                        <p className="text-sm font-semibold text-gray-900">Replies ({feedback.replies.length})</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {feedback.replies.map(item => (
                                                            <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition-colors">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-semibold text-gray-700">{item.author}</span>
                                                                    <span className="text-[11px] text-gray-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-800">{item.message}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {feedback.dms.length > 0 && (
                                                <div className="mt-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Inbox className="w-4 h-4 text-amber-600" />
                                                        <p className="text-sm font-semibold text-gray-900">DMs ({feedback.dms.length})</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {feedback.dms.map(item => (
                                                            <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:border-amber-200 transition-colors">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className="text-xs font-semibold text-gray-700">{item.author}</span>
                                                                    <span className="text-[11px] text-gray-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-800">{item.message}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400 text-sm italic">
                                            No feedback yet for this variation.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-sm text-gray-500 gap-4 opacity-50">
                            <LayoutGrid className="w-12 h-12 stroke-1" />
                            <p>Select a content card to view its branches</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SampleFeedPage;
