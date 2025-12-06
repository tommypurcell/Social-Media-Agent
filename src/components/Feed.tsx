import type { Post } from '../lib/types';
import { Instagram, Heart, MessageCircle, Send, Music, Linkedin, Twitter, Facebook } from 'lucide-react';

interface FeedProps {
    posts: Post[];
}

export function Feed({ posts }: FeedProps) {
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
        },
        linkedin: {
            icon: Linkedin,
            color: 'text-blue-700',
            name: 'LinkedIn'
        },
        twitter: {
            icon: Twitter,
            color: 'text-blue-400',
            name: 'Twitter'
        },
        facebook: {
            icon: Facebook,
            color: 'text-blue-600',
            name: 'Facebook'
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
                        {posts.map((post) => (
                            <div key={post.id} className="pb-4 animate-in fade-in duration-500">
                                {post.image && (
                                    <div className="aspect-video w-full overflow-hidden bg-gray-100">
                                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="px-4 pt-3">
                                    <div className="flex gap-3 mb-2">
                                        <Heart className="w-6 h-6 text-gray-800 hover:text-red-500 cursor-pointer" />
                                        <MessageCircle className="w-6 h-6 text-gray-800" />
                                        <Send className="w-6 h-6 text-gray-800" />
                                    </div>
                                    <p className="text-sm text-gray-800">
                                        <span className="font-semibold mr-2">agent_007</span>
                                        {post.content}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase">
                                        {new Date(post.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
