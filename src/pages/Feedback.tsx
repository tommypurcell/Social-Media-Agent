import { useMemo, useState } from 'react';
import { useAgentContext } from '../lib/AgentContext';
import { MessageSquare, Inbox, Filter, Activity, Heart, MessageCircle } from 'lucide-react';

type FeedbackItem = {
    id: string;
    type: 'reply' | 'dm';
    author: string;
    message: string;
    platform: 'instagram' | 'tiktok' | 'threads' | 'dm';
    timestamp: number;
    contentId?: string;
    contentSnippet?: string;
};

const platforms = ['all', 'instagram', 'tiktok', 'threads', 'dm'] as const;
const types = ['all', 'reply', 'dm'] as const;

const Feedback = () => {
    const { state } = useAgentContext();
    const [platformFilter, setPlatformFilter] = useState<typeof platforms[number]>('all');
    const [typeFilter, setTypeFilter] = useState<typeof types[number]>('all');

    const feedbackItems: FeedbackItem[] = useMemo(() => {
        const replies: FeedbackItem[] = state.posts.flatMap(post =>
            (post.simulatedComments || []).map(comment => ({
                id: comment.id,
                type: 'reply' as const,
                author: comment.username,
                message: comment.text,
                platform: post.platform,
                timestamp: new Date(comment.timestamp).getTime(),
                contentId: post.id,
                contentSnippet: post.content.slice(0, 80),
            }))
        );

        const dms: FeedbackItem[] = state.messages
            .filter(msg => !msg.isFromAgent)
            .map(msg => ({
                id: msg.id,
                type: 'dm' as const,
                author: msg.sender,
                message: msg.content,
                platform: 'dm',
                timestamp: msg.timestamp,
                contentId: undefined,
                contentSnippet: undefined,
            }));

        return [...replies, ...dms].sort((a, b) => b.timestamp - a.timestamp);
    }, [state.posts, state.messages]);

    const filtered = feedbackItems.filter(item => {
        const platformOk = platformFilter === 'all' || item.platform === platformFilter;
        const typeOk = typeFilter === 'all' || item.type === typeFilter;
        return platformOk && typeOk;
    });

    const summary = useMemo(() => {
        const totalReplies = feedbackItems.filter(f => f.type === 'reply').length;
        const totalDMs = feedbackItems.filter(f => f.type === 'dm').length;
        const byPlatform = platforms.reduce<Record<string, number>>((acc, p) => {
            acc[p] = feedbackItems.filter(f => f.platform === p).length;
            return acc;
        }, {});
        return { totalReplies, totalDMs, byPlatform };
    }, [feedbackItems]);

    return (
        <div className="flex-1 bg-background p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs uppercase text-gray-500 tracking-wide">Realtime</p>
                    <h1 className="text-3xl font-bold text-primary">Feedback</h1>
                    <p className="text-secondary">Live replies and DMs across all content.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                    <Filter className="w-4 h-4" />
                    <span>Filters active</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
                    Platform
                </div>
                <div className="flex gap-2 flex-wrap">
                    {platforms.map(p => (
                        <button
                            key={p}
                            onClick={() => setPlatformFilter(p)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${platformFilter === p
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {p === 'all' ? 'All' : p}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide ml-4">
                    Type
                </div>
                <div className="flex gap-2 flex-wrap">
                    {types.map(t => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${typeFilter === t
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {t === 'all' ? 'All' : t === 'dm' ? 'DM' : 'Reply'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Replies</p>
                        <p className="text-xl font-semibold text-primary">{summary.totalReplies}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <Inbox className="w-5 h-5 text-amber-600" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">DMs</p>
                        <p className="text-xl font-semibold text-primary">{summary.totalDMs}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-600" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Active Channels</p>
                        <p className="text-xl font-semibold text-primary">
                            {Object.entries(summary.byPlatform).filter(([k, v]) => k !== 'all' && v > 0).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stream */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        <p className="text-sm font-semibold text-gray-900">Live feedback</p>
                    </div>
                    <p className="text-xs text-gray-500">{filtered.length} items</p>
                </div>
                {filtered.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500">
                        No feedback yet. Start posting to see activity here.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                        {filtered.map(item => (
                            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${item.type === 'reply' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {item.type === 'reply' ? 'Reply' : 'DM'}
                                        </span>
                                        <span className="text-xs text-gray-500 capitalize">{item.platform}</span>
                                        <span className="text-xs font-semibold text-gray-800">{item.author}</span>
                                    </div>
                                    <span className="text-[11px] text-gray-400">
                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-800 mb-1">{item.message}</p>
                                {item.contentSnippet && (
                                    <p className="text-xs text-gray-500">On: “{item.contentSnippet}”</p>
                                )}
                                <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
                                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> auto-triage ready</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> quick reply</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;
