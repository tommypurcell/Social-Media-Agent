
import { useMemo } from 'react';
import { Activity, BarChart3, MessageCircle, Inbox, Heart, Sparkles, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useAgentContext } from '../lib/AgentContext';

const Reports = () => {
    const { state } = useAgentContext();
    const inboundDMs = state.messages.filter(msg => !msg.isFromAgent);

    const {
        totals,
        platformBreakdown,
        topContent,
        recentFeedback
    } = useMemo(() => {
        const getCommentCount = (post: any) => {
            if (Array.isArray(post.comments)) return post.comments.length;
            if (post.simulatedComments) return post.simulatedComments.length;
            return typeof post.comments === 'number' ? post.comments : 0;
        };

        const getLikes = (post: any) => post.engagement?.likes ?? post.likes ?? 0;
        const getViews = (post: any) => post.engagement?.views ?? 0;

        const totals = state.posts.reduce(
            (acc, post) => {
                acc.comments += getCommentCount(post);
                acc.likes += getLikes(post);
                acc.views += getViews(post);
                return acc;
            },
            { comments: 0, likes: 0, views: 0 }
        );

        const platformBreakdown = ['instagram', 'tiktok', 'threads'].map((platform) => {
            const posts = state.posts.filter(p => p.platform === platform);
            return {
                platform,
                posts: posts.length,
                comments: posts.reduce((sum, p) => sum + getCommentCount(p), 0),
                likes: posts.reduce((sum, p) => sum + getLikes(p), 0),
                views: posts.reduce((sum, p) => sum + getViews(p), 0),
                dms: inboundDMs.filter(dm => posts.some(p => Math.abs(dm.timestamp - (p.timestamp ?? 0)) < 1000 * 60 * 60 * 6)).length
            };
        });

        const topContent = [...state.posts]
            .map(post => {
                const commentCount = getCommentCount(post);
                const dmCount = inboundDMs.filter(dm => Math.abs(dm.timestamp - (post.timestamp ?? 0)) < 1000 * 60 * 60 * 6).length;
                return {
                    id: post.id,
                    caption: post.content,
                    platform: post.platform,
                    comments: commentCount,
                    dms: dmCount,
                    likes: getLikes(post),
                    views: getViews(post),
                    score: commentCount + dmCount
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const recentFeedback = [
            ...state.posts.flatMap(post =>
                (post.simulatedComments || []).map(comment => ({
                    id: comment.id,
                    type: 'comment' as const,
                    author: comment.username,
                    message: comment.text,
                    platform: post.platform,
                    timestamp: new Date(comment.timestamp).getTime()
                }))
            ),
            ...inboundDMs.map(dm => ({
                id: dm.id,
                type: 'dm' as const,
                author: dm.sender,
                message: dm.content,
                platform: 'dm',
                timestamp: dm.timestamp
            }))
        ]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);

        return { totals, platformBreakdown, topContent, recentFeedback };
    }, [state.posts, state.messages, inboundDMs]);

    return (
        <div className="flex-1 bg-background p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-xs uppercase text-gray-500 tracking-wide">Summarized report</p>
                    <h1 className="text-3xl font-bold text-primary">Reports & Feedback</h1>
                    <p className="text-secondary">Replies, DMs, and engagement summarized for your recent content.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full">
                    <BarChart3 className="w-4 h-4" />
                    Live preview
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Replies</p>
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-primary mt-2">{totals.comments}</div>
                    <p className="text-xs text-gray-500">Across all posts</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Inbound DMs</p>
                        <Inbox className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-primary mt-2">{inboundDMs.length}</div>
                    <p className="text-xs text-gray-500">Tied to campaigns</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Likes</p>
                        <Heart className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-bold text-primary mt-2">{totals.likes.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Recorded to date</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Views</p>
                        <Activity className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-primary mt-2">{totals.views.toLocaleString()}</div>
                    <p className="text-xs text-gray-500">Aggregated reach</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Platform Breakdown */}
                <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs uppercase text-gray-500 tracking-wide">Platforms</p>
                            <h2 className="text-xl font-semibold text-primary">Feedback by channel</h2>
                        </div>
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {platformBreakdown.map((platform) => (
                            <div key={platform.platform} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold capitalize">{platform.platform}</span>
                                    <span className="text-xs text-gray-500">{platform.posts} posts</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-blue-500" />
                                        {platform.comments} replies
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Inbox className="w-4 h-4 text-amber-500" />
                                        {platform.dms} DMs
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-rose-500" />
                                        {platform.likes.toLocaleString()} likes
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-green-500" />
                                        {platform.views.toLocaleString()} views
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Content */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs uppercase text-gray-500 tracking-wide">Leaders</p>
                            <h2 className="text-xl font-semibold text-primary">Top by feedback</h2>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {topContent.length === 0 && (
                            <p className="text-sm text-gray-500">No content yet. Publish to see summaries.</p>
                        )}
                        {topContent.map(item => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold capitalize">{item.platform}</span>
                                    <span className="text-xs text-gray-500">{(item.comments + item.dms)} touchpoints</span>
                                </div>
                                <p className="text-sm text-gray-800 line-clamp-2 mb-2">{item.caption}</p>
                                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{item.comments} replies</span>
                                    <span className="flex items-center gap-1"><Inbox className="w-3 h-3" />{item.dms} DMs</span>
                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{item.likes}</span>
                                    <span className="flex items-center gap-1"><Activity className="w-3 h-3" />{item.views}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Latest feedback stream */}
            <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs uppercase text-gray-500 tracking-wide">Latest</p>
                        <h2 className="text-xl font-semibold text-primary">Feedback stream</h2>
                    </div>
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                </div>
                {recentFeedback.length === 0 && (
                    <p className="text-sm text-gray-500">Once content is live, replies and DMs will appear here.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {recentFeedback.map(item => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:border-indigo-200 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${item.type === 'comment' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {item.type === 'comment' ? 'Reply' : 'DM'}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-800 mb-1 line-clamp-3">{item.message}</p>
                            <div className="flex items-center justify-between text-[11px] text-gray-500">
                                <span>{item.author}</span>
                                <span className="capitalize">{item.platform}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
