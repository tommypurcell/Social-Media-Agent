import { useState } from 'react';
import { Feed } from '../components/Feed';
import { useAgent } from '../lib/agent';
import { Instagram, Music, MessageSquare, Linkedin, Twitter, Facebook } from 'lucide-react';

const SampleFeedPage = () => {
    const { state } = useAgent();
    const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'tiktok' | 'threads' | 'linkedin' | 'twitter' | 'facebook'>('instagram');

    // Filter posts by platform
    const filteredPosts = state.posts.filter(post => post.platform === selectedPlatform);

    const platforms = [
        { id: 'instagram' as const, name: 'Instagram', icon: Instagram, color: 'pink' },
        { id: 'tiktok' as const, name: 'TikTok', icon: Music, color: 'cyan' },
        { id: 'threads' as const, name: 'Threads', icon: MessageSquare, color: 'purple' },
        { id: 'linkedin' as const, name: 'LinkedIn', icon: Linkedin, color: 'blue' },
        { id: 'twitter' as const, name: 'Twitter', icon: Twitter, color: 'sky' },
        { id: 'facebook' as const, name: 'Facebook', icon: Facebook, color: 'blue' },
    ];

    return (
        <div className="h-full p-6 bg-background">
            <div className="max-w-3xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-primary mb-2">Daily Sample Feed</h1>
                    <p className="text-secondary mb-4">Preview the posts generated and scheduled by the agent for today.</p>

                    {/* Platform Toggles */}
                    <div className="flex gap-2 bg-surface rounded-lg p-1 shadow-sm border border-border w-fit">
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
                    <Feed posts={filteredPosts} />
                </div>

                {/* Stats */}
                {filteredPosts.length > 0 && (
                    <div className="mt-4 flex items-center justify-center gap-6 text-sm text-secondary">
                        <span>{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{filteredPosts.reduce((sum, p) => sum + p.likes, 0)} total likes</span>
                        <span>•</span>
                        <span>{filteredPosts.reduce((sum, p) => sum + p.comments.length, 0)} total comments</span>
                    </div>
                )}

                {filteredPosts.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-secondary">
                        <div className="text-center">
                            <p className="text-lg font-medium mb-1">No posts yet</p>
                            <p className="text-sm">Start a workflow to generate content for {selectedPlatform}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SampleFeedPage;
