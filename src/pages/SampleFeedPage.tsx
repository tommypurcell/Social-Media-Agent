import { useMemo, useState } from 'react';
import { Feed } from '../components/Feed';
import { useAgentContext } from '../lib/AgentContext';
import type { Post, ContentBranch } from '../lib/types';
import { Instagram, Music, MessageSquare, GitBranch, X, Video, Inbox, MessageCircle } from 'lucide-react';

type FeedbackItem = {
    id: string;
    type: 'reply' | 'dm';
    author: string;
    message: string;
    platform: 'instagram' | 'tiktok' | 'threads';
    timestamp: number;
};

const sampleContents: Post[] = [
    {
        id: 'sample-1',
        content: 'Behind the scenes of our latest product drop 🚀',
        mediaUrl: '/assets/videos/art.mp4',
        mediaType: 'video',
        platform: 'instagram',
        likes: 1240,
        comments: 48,
        engagement: { views: 12800, likes: 1240, comments: 48, shares: 120 },
        timestamp: Date.now() - 1000 * 60 * 60 * 3,
        status: 'uploaded',
        simulatedComments: [
            { id: 'c1', username: 'visual_storyteller', text: 'The lighting here is perfect 🔥', timestamp: new Date(Date.now() - 1800000).toISOString(), likes: 22 },
            { id: 'c2', username: 'brand_builder', text: 'Can we get a full BTS reel?', timestamp: new Date(Date.now() - 2200000).toISOString(), likes: 15 },
            { id: 'c3', username: 'daily_supporter', text: 'This is why I follow you.', timestamp: new Date(Date.now() - 2600000).toISOString(), likes: 9 },
        ],
    },
    {
        id: 'sample-2',
        content: 'Micro-lesson: 3 hooks to boost your reach today.',
        mediaUrl: '/assets/videos/dance.mp4',
        mediaType: 'video',
        platform: 'tiktok',
        likes: 2200,
        comments: 140,
        engagement: { views: 48000, likes: 2200, comments: 140, shares: 640 },
        timestamp: Date.now() - 1000 * 60 * 60 * 6,
        status: 'uploaded',
        simulatedComments: [
            { id: 'c6', username: 'fyp_fan', text: 'Trying this on my next post.', timestamp: new Date(Date.now() - 1600000).toISOString(), likes: 42 },
            { id: 'c7', username: 'copyhack', text: 'Hook #2 is gold.', timestamp: new Date(Date.now() - 1900000).toISOString(), likes: 21 },
        ],
    },
    {
        id: 'sample-3',
        content: 'Hot take: Why consistency beats virality for community growth.',
        mediaUrl: '/assets/videos/google_test.mp4',
        mediaType: 'video',
        platform: 'threads',
        likes: 860,
        comments: 75,
        engagement: { views: 9100, likes: 860, comments: 75, shares: 55 },
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
        status: 'uploaded',
        simulatedComments: [
            { id: 'c11', username: 'conversation_starter', text: 'Agree—slow growth wins.', timestamp: new Date(Date.now() - 1500000).toISOString(), likes: 14 },
            { id: 'c12', username: 'real_talk', text: 'Needed this reminder.', timestamp: new Date(Date.now() - 1800000).toISOString(), likes: 8 },
        ],
    },
    {
        id: 'sample-4',
        content: 'Template pack giveaway: 5 carousels for product launches.',
        mediaUrl: '/assets/videos/kids.mp4',
        mediaType: 'video',
        platform: 'instagram',
        likes: 1420,
        comments: 62,
        engagement: { views: 15000, likes: 1420, comments: 62, shares: 180 },
        timestamp: Date.now() - 1000 * 60 * 60 * 15,
        status: 'uploaded',
        simulatedComments: [
            { id: 'c16', username: 'carousel_creator', text: 'Downloading now!', timestamp: new Date(Date.now() - 1200000).toISOString(), likes: 17 },
        ],
    },
    {
        id: 'sample-5',
        content: '30-day content calendar walkthrough (live replay).',
        mediaUrl: '/assets/videos/science.mp4',
        mediaType: 'video',
        platform: 'tiktok',
        likes: 3100,
        comments: 210,
        engagement: { views: 62000, likes: 3100, comments: 210, shares: 820 },
        timestamp: Date.now() - 1000 * 60 * 60 * 20,
        status: 'uploaded',
        simulatedComments: [
            { id: 'c21', username: 'planningpro', text: 'Can you share the template?', timestamp: new Date(Date.now() - 1100000).toISOString(), likes: 23 },
        ],
    },
    {
        id: 'sample-6',
        content: 'Community Q&A: answering your strategy questions.',
        mediaUrl: '/assets/videos/travel.mp4',
        mediaType: 'video',
        platform: 'threads',
        likes: 640,
        comments: 52,
        engagement: { views: 7200, likes: 640, comments: 52, shares: 30 },
        timestamp: Date.now() - 1000 * 60 * 60 * 26,
        status: 'uploaded',
        simulatedComments: [
            { id: 'c26', username: 'conversation_starter', text: 'Thanks for the candor!', timestamp: new Date(Date.now() - 1000000).toISOString(), likes: 8 },
        ],
    },
    {
        id: 'sample-7',
        content: 'Trend remix: applying “day-in-the-life” to B2B.',
        mediaUrl: '/assets/videos/test_mixkit.mp4',
        mediaType: 'video',
        platform: 'instagram',
        likes: 930,
        comments: 58,
        engagement: { views: 10500, likes: 930, comments: 58, shares: 66 },
        timestamp: Date.now() - 1000 * 60 * 60 * 30,
        status: 'uploaded',
        simulatedComments: [],
    },
];

const SampleFeedPage = () => {
    const { state } = useAgentContext();
    const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | 'threads'>('instagram');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [branches, setBranches] = useState<ContentBranch[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ replies: FeedbackItem[]; dms: FeedbackItem[] } | null>(null);

    // Combine live posts with pre-made videos
    const allPosts = useMemo(() => {
        const livePosts = state.posts.map(p => ({
            ...p,
            mediaUrl: p.mediaUrl || p.image,
            mediaType: p.mediaType || 'image',
        }));
        return [...sampleContents, ...livePosts].sort((a, b) => b.timestamp - a.timestamp);
    }, [state.posts]);

    // Filter posts by platform
    const filteredPosts = allPosts.filter(post => post.platform === selectedPlatform);

    const platforms = [
        { id: 'instagram' as const, name: 'Instagram', icon: Instagram },
        { id: 'tiktok' as const, name: 'TikTok', icon: Music },
        { id: 'threads' as const, name: 'Threads', icon: MessageSquare },
    ];

    const sampleDmMap: Record<string, FeedbackItem[]> = sampleContents.reduce((acc, post, idx) => {
        const now = Date.now();
        const baseCaption = post.content.slice(0, 50);
        acc[post.id] = Array.from({ length: 5 }).map((_, i) => ({
            id: `${post.id}-dm-${i}`,
            type: 'dm' as const,
            author: i === 0 ? 'brand_partner' : i === 1 ? 'community_member' : `inquirer_${idx}_${i}`,
            message: i === 0
                ? `Loved "${baseCaption}" — can we partner on something similar?`
                : i === 1
                    ? `This hit home. Any resources to go deeper on "${baseCaption}"?`
                    : `Question about your ${post.platform} post: can we adapt this?`,
            platform: post.platform,
            timestamp: now - (i + 1) * 600000,
        }));
        return acc;
    }, {} as Record<string, FeedbackItem[]>);

    const buildBranchFeedback = (branch: ContentBranch, post: Post) => {
        const base = branch.caption.slice(0, 50) || post.content.slice(0, 50);
        const baseComments = post.simulatedComments || [];

        const replies: FeedbackItem[] = baseComments.slice(0, 5).map((c, idx) => ({
            id: `${branch.id}-reply-${idx}-${c.id}`,
            type: 'reply' as const,
            author: c.username,
            message: c.text,
            platform: branch.platform as 'instagram' | 'tiktok' | 'threads',
            timestamp: new Date(c.timestamp).getTime(),
        }));

        // Pad to 5 replies if fewer exist
        while (replies.length < 5) {
            const fillerIdx = replies.length;
            replies.push({
                id: `${branch.id}-reply-filler-${fillerIdx}`,
                type: 'reply',
                author: `supporter_${fillerIdx}`,
                message: `Thoughts on "${base}"? Loving this cut.`,
                platform: branch.platform as 'instagram' | 'tiktok' | 'threads',
                timestamp: Date.now() - fillerIdx * 450000,
            });
        }

        const dmsSeed = (sampleDmMap[post.id] || []).slice(0, 5).map((dm, idx) => ({
            ...dm,
            id: `${branch.id}-dm-${idx}`,
            message: `${dm.message} (referencing ${branch.name})`,
        }));

        while (dmsSeed.length < 5) {
            const i = dmsSeed.length;
            dmsSeed.push({
                id: `${branch.id}-dm-filler-${i}`,
                type: 'dm',
                author: `partner_${i}`,
                message: `Saw "${base}" on ${branch.platform}. Can we collab?`,
                platform: branch.platform as 'instagram' | 'tiktok' | 'threads',
                timestamp: Date.now() - (i + 1) * 500000,
            });
        }

        return { replies: replies.slice(0, 5), dms: dmsSeed.slice(0, 5) };
    };

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
        const builtBranches = buildBranches(post);
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
                                            {platform.name}
                                        </button>
                                    );
                                })}
                            </div>
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

                            {/* Feedback */}
                            {feedback && selectedBranchId && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs uppercase text-gray-500 tracking-wide">Feedback for</p>
                                        <span className="px-2 py-1 text-[11px] rounded-full bg-gray-100 text-gray-700">
                                            {branches.find(b => b.id === selectedBranchId)?.name || 'Branch'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageCircle className="w-4 h-4 text-blue-600" />
                                            <p className="text-sm font-semibold text-gray-900">Replies ({feedback.replies.length})</p>
                                        </div>
                                        <div className="space-y-2">
                                            {feedback.replies.map(item => (
                                                <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold text-gray-700">{item.author}</span>
                                                        <span className="text-[11px] text-gray-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-800">{item.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Inbox className="w-4 h-4 text-amber-600" />
                                            <p className="text-sm font-semibold text-gray-900">DMs ({feedback.dms.length})</p>
                                        </div>
                                        <div className="space-y-2">
                                            {feedback.dms.map(item => (
                                                <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-semibold text-gray-700">{item.author}</span>
                                                        <span className="text-[11px] text-gray-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-800">{item.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
                            Select a content card to view its branches and feedback.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SampleFeedPage;
