import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Wand2, Calendar, Loader2, Sparkles } from 'lucide-react';
import type { WorkflowConfig } from '../lib/types';

interface PlannedPost {
    id: number;
    platform: string;
    topic: string;
    caption: string;
    captionStarter: string;
    hashtags: string[];
    useHashtags: boolean;
    customHashtags: string;
    imagePrompt: string;
    postType: 'photo' | 'reel';
    scheduledTime: string;
    status: 'planning' | 'planned' | 'error';
    uploadedImage?: string; // URL for uploaded file
}

const WorkflowPlanner = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const config = location.state?.config as WorkflowConfig;

    const [plannedPosts, setPlannedPosts] = useState<PlannedPost[]>([]);
    const [currentlyPlanning, setCurrentlyPlanning] = useState<number | null>(null);
    const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);

    useEffect(() => {
        if (!config) {
            navigate('/');
            return;
        }
        initializePosts();

        // Cleanup object URLs on unmount
        return () => {
            uploadedImageURLs.forEach(url => URL.revokeObjectURL(url));
        };
    }, [config]);

    const initializePosts = () => {
        const posts: PlannedPost[] = [];
        const imageURLs: string[] = [];

        // Create object URLs from uploaded files
        if (config.uploadedFiles && config.uploadedFiles.length > 0) {
            config.uploadedFiles.forEach(file => {
                const url = URL.createObjectURL(file);
                imageURLs.push(url);
            });
            setUploadedImageURLs(imageURLs);
        }

        for (let i = 1; i <= config.postCount; i++) {
            let topic = `Post ${i}`;
            if (config.inputMethod === 'idea' && config.userIdea) {
                topic = `${config.userIdea} (Part ${i})`;
            } else if (config.inputMethod === 'upload') {
                topic = `Highlighted Content ${i}`;
            }

            posts.push({
                id: i,
                platform: config.platforms[i % config.platforms.length],
                topic,
                caption: '',
                captionStarter: '',
                hashtags: [],
                useHashtags: true,
                customHashtags: '',
                imagePrompt: '',
                postType: config.contentType === 'video' ? 'reel' : 'photo',
                scheduledTime: '',
                status: 'planning',
                uploadedImage: imageURLs[i - 1] || imageURLs[(i - 1) % imageURLs.length],
            });
        }

        setPlannedPosts(posts);
        planNextPost(posts, 0);
    };

    const planNextPost = async (posts: PlannedPost[], index: number) => {
        if (index >= posts.length) {
            setCurrentlyPlanning(null);
            return;
        }

        const post = posts[index];
        setCurrentlyPlanning(post.id);

        // Smart Mode Delay Simulation (refining content)
        const delayTime = config.smartMode ? 3500 : 2000;
        await new Promise(resolve => setTimeout(resolve, delayTime));

        const planned = await generatePostContent(post);

        setPlannedPosts(prev =>
            prev.map(p => p.id === post.id ? { ...p, ...planned, status: 'planned' } : p)
        );

        setTimeout(() => planNextPost(posts, index + 1), 500);
    };

    const generatePostContent = async (post: PlannedPost): Promise<Partial<PlannedPost>> => {
        const platformStyles = {
            instagram: { captionStyle: 'Visual storytelling with emojis', hashtagCount: 10 },
            tiktok: { captionStyle: 'Short, punchy, trending', hashtagCount: 5 },
            threads: { captionStyle: 'Conversational and authentic', hashtagCount: 3 },
            linkedin: { captionStyle: 'Professional, insightful, and value-driven', hashtagCount: 3 },
            twitter: { captionStyle: 'Concise, engaging, news-worthy', hashtagCount: 2 },
            facebook: { captionStyle: 'Friendly, community-focused, storytelling', hashtagCount: 5 },
        };

        const style = platformStyles[post.platform as keyof typeof platformStyles] || platformStyles.instagram;
        const hour = 9 + (post.id - 1) * 2;
        const time = `${hour.toString().padStart(2, '0')}:00`;

        // Tone Logic
        const toneAdjective = config.tone === 'default' ? 'engaging' : config.tone;

        // Content Type Logic for Prompt
        let promptContext = "";
        if (config.contentType === 'video') {
            promptContext = "Create a viral reel concept/script.";
        } else if (config.contentType === 'text') {
            promptContext = "Focus purely on compelling copy.";
        } else {
            promptContext = "Create a stunning visual post.";
        }

        return {
            caption: `${post.topic} - Writing in a ${toneAdjective} tone. ${style.captionStyle}. ${promptContext} Ready to ship! 🚀`,
            hashtags: Array.from({ length: style.hashtagCount }, (_, i) =>
                `#${config.tone}${i > 0 ? i + 1 : ''}`
            ),
            imagePrompt: config.contentType === 'text' ? '' : `High-quality ${post.platform} ${config.contentType} featuring ${post.topic}, ${toneAdjective} atmosphere, professional lighting`,
            scheduledTime: time,
        };
    };

    const handleEditPost = (id: number, field: keyof PlannedPost, value: any) => {
        setPlannedPosts(prev =>
            prev.map(p => p.id === id ? { ...p, [field]: value } : p)
        );
    };

    const handleApprove = () => {
        navigate('/', {
            state: {
                plannedPosts,
                message: 'Workflow planned successfully! Posts queued for execution.'
            }
        });
    };

    const allPlanned = plannedPosts.every(p => p.status === 'planned');
    const planningProgress = plannedPosts.filter(p => p.status === 'planned').length;

    if (!config) return null;

    return (
        <div className="flex-1 overflow-y-auto bg-background">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm border-b border-border">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-secondary hover:text-accent mb-4 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="flex items-end justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-primary mb-1">Workflow Planner</h1>
                            <p className="text-sm text-secondary">
                                {config.postCount} post{config.postCount > 1 ? 's' : ''} • {config.platforms.join(', ')}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-2xl font-bold text-accent">{planningProgress}/{config.postCount}</div>
                                <div className="text-xs text-secondary uppercase tracking-wide">Planned</div>
                            </div>
                        </div>
                    </div>

                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out"
                            style={{ width: `${(planningProgress / config.postCount) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Posts */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="space-y-4">
                    {plannedPosts.map((post) => (
                        <div
                            key={post.id}
                            className={`bg-surface rounded-xl border transition-all ${post.status === 'planning' && currentlyPlanning === post.id
                                ? 'border-orange-400 shadow-sm shadow-orange-100'
                                : post.status === 'planned'
                                    ? 'border-border hover:border-gray-300'
                                    : 'border-border'
                                }`}
                        >
                            {/* Post Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${post.status === 'planning' && currentlyPlanning === post.id
                                        ? 'bg-orange-100'
                                        : post.status === 'planned'
                                            ? 'bg-green-100'
                                            : 'bg-gray-100'
                                        }`}>
                                        {post.status === 'planning' && currentlyPlanning === post.id ? (
                                            <Loader2 className="w-4 h-4 text-orange-600 animate-spin" />
                                        ) : post.status === 'planned' ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Sparkles className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-primary text-sm">Post {post.id}</h3>
                                            <span className="text-xs text-secondary">•</span>
                                            <span className="text-xs text-secondary capitalize">{post.platform}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-secondary">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{post.scheduledTime || '...'}</span>
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="px-5 py-4">
                                {post.status === 'planning' && currentlyPlanning === post.id ? (
                                    <div className="py-12 text-center">
                                        <Wand2 className="w-10 h-10 text-orange-500 mx-auto mb-3 animate-pulse" />
                                        <p className="text-sm text-secondary">Crafting content...</p>
                                    </div>
                                ) : post.status === 'planned' ? (
                                    <div className="space-y-4">
                                        {/* Topic & Post Type */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-secondary mb-1.5 block">Topic</label>
                                                <input
                                                    type="text"
                                                    value={post.topic}
                                                    onChange={(e) => handleEditPost(post.id, 'topic', e.target.value)}
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="text-xs font-medium text-secondary mb-1.5 block">Post Type</label>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEditPost(post.id, 'postType', 'photo')}
                                                        className={`flex-1 px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all ${post.postType === 'photo'
                                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                            : 'border-border bg-background text-secondary hover:border-gray-300'
                                                            }`}
                                                    >
                                                        Photo Post
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditPost(post.id, 'postType', 'reel')}
                                                        className={`flex-1 px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all ${post.postType === 'reel'
                                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                            : 'border-border bg-background text-secondary hover:border-gray-300'
                                                            }`}
                                                    >
                                                        Reel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Caption Starter */}
                                        <div>
                                            <label className="text-xs font-medium text-secondary mb-1.5 block">Caption Starter (Optional)</label>
                                            <input
                                                type="text"
                                                value={post.captionStarter}
                                                onChange={(e) => handleEditPost(post.id, 'captionStarter', e.target.value)}
                                                placeholder="Start your caption... AI will complete it"
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                            />
                                        </div>

                                        {/* AI Generated Caption */}
                                        <div>
                                            <label className="text-xs font-medium text-secondary mb-1.5 block">AI Generated Caption</label>
                                            <textarea
                                                value={post.caption}
                                                onChange={(e) => handleEditPost(post.id, 'caption', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                                            />
                                        </div>

                                        {/* Hashtags Toggle & Input */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-medium text-secondary">Hashtags</label>
                                                <button
                                                    onClick={() => handleEditPost(post.id, 'useHashtags', !post.useHashtags)}
                                                    className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${post.useHashtags
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-gray-100 text-gray-500'
                                                        }`}
                                                >
                                                    {post.useHashtags ? 'Enabled' : 'Disabled'}
                                                </button>
                                            </div>
                                            {post.useHashtags && (
                                                <>
                                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                                        {post.hashtags.map((tag, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-xs font-medium"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={post.customHashtags}
                                                        onChange={(e) => handleEditPost(post.id, 'customHashtags', e.target.value)}
                                                        placeholder="Add specific hashtags (comma separated)"
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                    />
                                                </>
                                            )}
                                        </div>

                                        {/* Uploaded Image or Image Prompt */}
                                        {post.uploadedImage ? (
                                            <div>
                                                <label className="text-xs font-medium text-secondary mb-1.5 block">Uploaded Media</label>
                                                <div className="relative rounded-lg overflow-hidden border border-border">
                                                    <img
                                                        src={post.uploadedImage}
                                                        alt={`Post ${post.id}`}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                        <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-md">
                                                            Uploaded
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="text-xs font-medium text-secondary mb-1.5 block">Image Generation Prompt</label>
                                                <textarea
                                                    value={post.imagePrompt}
                                                    onChange={(e) => handleEditPost(post.id, 'imagePrompt', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                                                    placeholder="Describe the image to generate..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                {allPlanned && (
                    <div className="mt-8 pb-8 flex justify-end gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="px-5 py-2.5 rounded-lg border border-border text-secondary hover:bg-gray-50 font-medium transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApprove}
                            className="px-5 py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium shadow-sm transition-all flex items-center gap-2 text-sm"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve & Execute
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkflowPlanner;
