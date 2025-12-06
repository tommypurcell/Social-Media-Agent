import type { Post } from '../lib/types';
import { Instagram, Heart, MessageCircle, Music, Eye, Share2, Bookmark, Play } from 'lucide-react';
import { useState } from 'react';

interface FeedProps {
    posts: Post[];
    onSelect?: (post: Post) => void;
}

export function Feed({ posts, onSelect }: FeedProps) {
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

    const toggleComments = (postId: string) => {
        setExpandedComments(prev => {
            const next = new Set(prev);
            if (next.has(postId)) {
                next.delete(postId);
            } else {
                next.add(postId);
            }
            return next;
        });
    };

    // Determine platform from first post or default to instagram
    const platform = posts.length > 0 ? posts[0].platform : 'instagram';

    // Platform configurations
    const platformConfig = {
        instagram: {
            icon: Instagram,
            color: 'text-pink-600',
            name: 'Instagram'
        },
        tiktok: {
            icon: Music,
            color: 'text-cyan-500',
            name: 'TikTok'
        },
        threads: {
            icon: MessageCircle,
            color: 'text-purple-600',
            name: 'Threads'
        }
    };

    const config = platformConfig[platform as keyof typeof platformConfig] || platformConfig.instagram;
    const PlatformIcon = config.icon;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <PlatformIcon className={`w-5 h-5 ${config.color}`} />
                <h2 className="font-semibold text-gray-800">Live Feed</h2>
            </div>

            <div className="overflow-y-auto flex-1 p-0">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-2">
                        <PlatformIcon className="w-8 h-8 opacity-20" />
                        <p className="text-sm">Feed is empty</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {posts.map((post) => {
                            const engagement = post.engagement || {
                                views: post.likes ? post.likes * 10 : 0,
                                likes: post.likes || 0,
                                comments: post.comments || 0,
                                shares: Math.floor((post.likes || 0) * 0.1),
                                saves: Math.floor((post.likes || 0) * 0.2)
                            };
                            const simulatedComments = post.simulatedComments || [];
                            const isCommentsExpanded = expandedComments.has(post.id);
                            const postPlatform = post.platform || 'instagram';

                            return (
                                <div
                                    key={post.id}
                                    className="pb-4 animate-in fade-in duration-500 cursor-pointer"
                                    onClick={() => onSelect?.(post)}
                                >
                                    {/* Post Header */}
                                    <div className="px-4 py-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold text-xs">M</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">marathon_agent</p>
                                                <p className="text-xs text-gray-500 capitalize">{postPlatform}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(post.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>

                                    {/* Post Media */}
                                    {(post.mediaType === 'video' && (post.mediaUrl || post.image)) ? (
                                        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 group">
                                            <video
                                                src={post.mediaUrl || post.image}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                                            <Play className="absolute w-12 h-12 text-white opacity-80 inset-0 m-auto drop-shadow" />
                                        </div>
                                    ) : post.image && (
                                        <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                            <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    {/* Engagement Actions */}
                                    <div className="px-4 pt-3">
                                        <div className="flex gap-4 mb-3">
                                            <button className="flex items-center gap-1 text-gray-700 hover:text-red-500 transition-colors">
                                                <Heart className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => toggleComments(post.id)}
                                                className="flex items-center gap-1 text-gray-700 hover:text-blue-500 transition-colors"
                                            >
                                                <MessageCircle className="w-6 h-6" />
                                            </button>
                                            <button className="flex items-center gap-1 text-gray-700 hover:text-green-500 transition-colors">
                                                <Share2 className="w-6 h-6" />
                                            </button>
                                            <button className="flex items-center gap-1 text-gray-700 hover:text-yellow-500 transition-colors ml-auto">
                                                <Bookmark className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {/* Engagement Stats */}
                                        <div className="flex items-center gap-4 mb-2 text-xs text-gray-600">
                                            {engagement.views > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>{engagement.views.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3.5 h-3.5" />
                                                <span className="font-semibold">{engagement.likes.toLocaleString()} likes</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                <span>{typeof engagement.comments === 'number' ? engagement.comments : engagement.comments.length} comments</span>
                                            </div>
                                            {engagement.shares > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Share2 className="w-3.5 h-3.5" />
                                                    <span>{engagement.shares} shares</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Caption */}
                                        <p className="text-sm text-gray-800 mb-2">
                                            <span className="font-semibold mr-1">marathon_agent</span>
                                            {post.content}
                                        </p>

                                        {/* Comments Section */}
                                        {simulatedComments.length > 0 && (
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => toggleComments(post.id)}
                                                    className="text-xs text-gray-500 hover:text-gray-700 mb-2"
                                                >
                                                    {isCommentsExpanded
                                                        ? 'Hide comments'
                                                        : `View all ${simulatedComments.length} comments`
                                                    }
                                                </button>

                                                {isCommentsExpanded && (
                                                    <div className="space-y-2 mt-2 pl-2 border-l-2 border-gray-200 max-h-48 overflow-y-auto">
                                                        {simulatedComments.map((comment) => (
                                                            <div key={comment.id} className="text-sm">
                                                                <p>
                                                                    <span className="font-semibold text-gray-800 mr-1">
                                                                        {comment.username}
                                                                    </span>
                                                                    <span className="text-gray-700">{comment.text}</span>
                                                                </p>
                                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                                    <span>
                                                                        {Math.floor((Date.now() - new Date(comment.timestamp).getTime()) / 60000)}m
                                                                    </span>
                                                                    {comment.likes > 0 && (
                                                                        <span>{comment.likes} likes</span>
                                                                    )}
                                                                    <button className="hover:text-gray-700">Reply</button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
