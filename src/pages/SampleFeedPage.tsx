import { useMemo, useState } from 'react';
import { Feed } from '../components/Feed';
import { useAgentContext } from '../lib/AgentContext';
import type { Post, ContentBranch } from '../lib/types';
import { Instagram, Music, MessageSquare, GitBranch, X, Video } from 'lucide-react';

const preMadeVideos: Post[] = [
    {
        id: 'premade-1',
        content: 'Behind the scenes of our latest product drop 🚀',
        mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/examples/flower.webm',
        mediaType: 'video',
        platform: 'instagram',
        likes: 1240,
        comments: 48,
        engagement: { views: 12800, likes: 1240, comments: 48, shares: 120 },
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
    },
    {
        id: 'premade-2',
        content: 'Micro-lesson: 3 hooks to boost your reach today.',
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        mediaType: 'video',
        platform: 'tiktok',
        likes: 2200,
        comments: 140,
        engagement: { views: 48000, likes: 2200, comments: 140, shares: 640 },
        timestamp: Date.now() - 1000 * 60 * 60 * 6,
    },
    {
        id: 'premade-3',
        content: 'Hot take: Why consistency beats virality for community growth.',
        mediaUrl: 'https://www.w3schools.com/html/movie.mp4',
        mediaType: 'video',
        platform: 'threads',
        likes: 860,
        comments: 75,
        engagement: { views: 9100, likes: 860, comments: 75, shares: 55 },
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
    },
];

const SampleFeedPage = () => {
    const { state } = useAgentContext();
    const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | 'threads'>('instagram');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [branches, setBranches] = useState<ContentBranch[]>([]);

    // Combine live posts with pre-made videos
    const allPosts = useMemo(() => {
        const livePosts = state.posts.map(p => ({
            ...p,
            mediaUrl: p.mediaUrl || p.image,
            mediaType: p.mediaType || 'image',
        }));
        return [...preMadeVideos, ...livePosts].sort((a, b) => b.timestamp - a.timestamp);
    }, [state.posts]);

    // Filter posts by platform
    const filteredPosts = allPosts.filter(post => post.platform === selectedPlatform);

    const platforms = [
        { id: 'instagram' as const, name: 'Instagram', icon: Instagram },
        { id: 'tiktok' as const, name: 'TikTok', icon: Music },
        { id: 'threads' as const, name: 'Threads', icon: MessageSquare },
    ];

    const buildBranches = (post: Post) => {
        const baseCaption = post.content;
        const root: ContentBranch = {
            id: `${post.id}-root`,
            name: 'Original',
            caption: baseCaption,
            hashtags: ['#original', '#content'],
            mediaUrl: post.mediaUrl || post.image,
            platform: post.platform,
            postType: post.mediaType === 'video' ? 'reel' : 'photo',
            isSelected: true,
            createdAt: post.timestamp
        };

        const platforms = ['instagram', 'tiktok', 'threads'] as const;
        const variants: ContentBranch[] = platforms
            .filter(p => p !== post.platform)
            .map((platform, idx) => ({
                id: `${post.id}-${platform}`,
                parentId: root.id,
                name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Variant`,
                caption: `${baseCaption} • adapted for ${platform}`,
                hashtags: [`#${platform}`, '#remix', '#viral'],
                mediaUrl: post.mediaUrl || post.image,
                platform,
                postType: post.mediaType === 'video' ? 'reel' : 'photo',
                isSelected: idx === 0,
                createdAt: post.timestamp + idx * 1000,
            }));

        const styleVariants: ContentBranch[] = [
            {
                id: `${post.id}-story`,
                parentId: root.id,
                name: 'Story Cut',
                caption: `${baseCaption} — 15s story snippet.`,
                hashtags: ['#story', '#shortform'],
                mediaUrl: post.mediaUrl || post.image,
                platform: post.platform,
                postType: 'reel',
                isSelected: false,
                createdAt: post.timestamp + 3000,
            },
            {
                id: `${post.id}-caption-tweak`,
                parentId: root.id,
                name: 'Caption Tweak',
                caption: `${baseCaption} (CTA added: tap link in bio)`,
                hashtags: ['#cta', '#linkinbio'],
                mediaUrl: post.mediaUrl || post.image,
                platform: post.platform,
                postType: post.mediaType === 'video' ? 'reel' : 'photo',
                isSelected: false,
                createdAt: post.timestamp + 4000,
            },
        ];

        return [root, ...variants, ...styleVariants];
    };

    const handleSelectPost = (post: Post) => {
        setSelectedPost(post);
        setBranches(buildBranches(post));
    };

    const renderBranch = (branch: ContentBranch, depth = 0) => {
        const children = branches.filter(b => b.parentId === branch.id);
        return (
            <div key={branch.id} className={`${depth > 0 ? 'ml-6 mt-3' : 'mb-3'}`}>
                <div className={`p-3 rounded-lg border ${branch.isSelected ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}`}>
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
                            <p className="text-secondary">All content in one place. Click any card to view its branches.</p>
                        </div>
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
                                        {platform.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Feed Display */}
                    <div className="flex-1 overflow-hidden rounded-xl border border-border shadow-sm bg-surface">
                        <Feed posts={filteredPosts} onSelect={handleSelectPost} />
                    </div>

                    {/* Stats */}
                    {filteredPosts.length > 0 && (
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-secondary">
                            <span>{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{filteredPosts.reduce((sum, p) => sum + (p.likes || 0), 0)} total likes</span>
                            <span>•</span>
                            <span>{filteredPosts.reduce((sum, p) => sum + (typeof p.comments === 'number' ? p.comments : p.comments.length), 0)} total comments</span>
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
                        <div className="space-y-4 overflow-y-auto">
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                <p className="text-xs text-gray-500 capitalize mb-1">{selectedPost.platform}</p>
                                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{selectedPost.content}</p>
                            </div>
                            <div>
                                {branches.filter(b => !b.parentId).map(b => renderBranch(b))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
                            Select a content card to view its branches.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SampleFeedPage;
