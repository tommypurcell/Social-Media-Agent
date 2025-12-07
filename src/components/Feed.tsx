import type { Post } from '../lib/types';
import { Instagram, Heart, MessageCircle, Music, Eye, Share2, Bookmark, Play, Video, Clock, CheckCircle, UploadCloud } from 'lucide-react';
import { useState, useRef } from 'react';

interface FeedProps {
    posts: Post[];
    onSelect?: (post: Post) => void;
}

const FeedPost = ({ post, onSelect, toggleComments, isCommentsExpanded }: {
    post: Post;
    onSelect?: (post: Post) => void;
    toggleComments: (id: string) => void;
    isCommentsExpanded: boolean;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const statusConfig = {
        uploaded: { icon: CheckCircle, text: 'Uploaded', color: 'text-green-500 bg-green-50 border-green-200' },
        scheduled: { icon: Clock, text: 'Scheduled', color: 'text-amber-500 bg-amber-50 border-amber-200' },
        preview: { icon: UploadCloud, text: 'Preview', color: 'text-blue-500 bg-blue-50 border-blue-200' },
    };

    const status = post.status || 'uploaded';
    const StatusIcon = statusConfig[status].icon;

    const engagement = post.engagement || {
        views: post.likes ? post.likes * 10 : 0,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: Math.floor((post.likes || 0) * 0.1),
        saves: Math.floor((post.likes || 0) * 0.2)
    };

    const simulatedComments = post.simulatedComments || [];

    return (
        <div
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
            onClick={() => onSelect?.(post)}
        >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-inner">
                        {post.mediaType === 'video' ? <Video className="w-4 h-4 text-white" /> : <Instagram className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">marathon_agent</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">{post.platform}</span>
                            <span className="text-[10px] text-gray-300">•</span>
                            <span className="text-[10px] text-gray-400">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusConfig[status].color} text-xs font-medium`}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="uppercase tracking-wide text-[10px]">{statusConfig[status].text}</span>
                </div>
            </div>

            {/* Media */}
            <div
                className="relative aspect-video bg-gray-900 overflow-hidden cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {(post.mediaType === 'video' && (post.mediaUrl || post.image)) ? (
                    <>
                        <video
                            ref={videoRef}
                            src={post.mediaUrl || post.image}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            playsInline
                        />
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </div>
                        </div>
                    </>
                ) : (
                    <img src={post.image || 'https://placehold.co/600x400'} alt="Post content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
            </div>

            {/* Content & Actions */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <button className="text-gray-600 hover:text-pink-500 transition-colors transform hover:scale-110 active:scale-95">
                            <Heart className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleComments(post.id); }}
                            className="text-gray-600 hover:text-indigo-500 transition-colors transform hover:scale-110 active:scale-95"
                        >
                            <MessageCircle className="w-6 h-6" />
                        </button>
                        <button className="text-gray-600 hover:text-green-500 transition-colors transform hover:scale-110 active:scale-95">
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                        <Bookmark className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-3 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {engagement.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {engagement.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> {typeof engagement.comments === 'number' ? engagement.comments : engagement.comments.length}
                    </span>

                </div>

                <div className="space-y-1 mb-3">
                    <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed">
                        <span className="font-bold mr-2">marathon_agent</span>
                        {post.content}
                    </p>
                </div>

                {/* Comments Preview */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isCommentsExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                >
                    <div className="bg-gray-50 rounded-xl p-3 space-y-3">
                        {simulatedComments.length > 0 ? simulatedComments.map(comment => (
                            <div key={comment.id} className="flex gap-2 text-xs">
                                <span className="font-bold text-gray-900 shrink-0">{comment.username}</span>
                                <span className="text-gray-600 leading-relaxed">{comment.text}</span>
                            </div>
                        )) : (
                            <p className="text-xs text-gray-400 italic text-center py-2">No comments yet</p>
                        )}
                    </div>
                </div>

                {simulatedComments.length > 0 && !isCommentsExpanded && (
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleComments(post.id); }}
                        className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                    >
                        View all {simulatedComments.length} comments
                    </button>
                )}
            </div>
        </div>
    );
};

export function Feed({ posts, onSelect }: FeedProps) {
    const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

    const toggleComments = (postId: string) => {
        setExpandedComments(prev => {
            const next = new Set(prev);
            if (next.has(postId)) next.delete(postId);
            else next.add(postId);
            return next;
        });
    };

    // Determine platform from first post or default to instagram
    const platform = posts.length > 0 ? posts[0].platform : 'instagram';

    const platformConfig = {
        instagram: { icon: Instagram, color: 'text-pink-600', label: 'Instagram Feed' },
        tiktok: { icon: Music, color: 'text-cyan-500', label: 'TikTok Feed' },
        threads: { icon: MessageCircle, color: 'text-purple-600', label: 'Threads Feed' }
    };

    const config = platformConfig[platform as keyof typeof platformConfig] || platformConfig.instagram;
    const PlatformIcon = config.icon;

    return (
        <div className="h-full flex flex-col bg-gray-50/50">
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PlatformIcon className={`w-5 h-5 ${config.color}`} />
                    <h2 className="font-bold text-gray-800 text-lg">{config.label}</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                            <PlatformIcon className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm font-medium">No posts in this feed yet</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <FeedPost
                            key={post.id}
                            post={post}
                            onSelect={onSelect}
                            toggleComments={toggleComments}
                            isCommentsExpanded={expandedComments.has(post.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
