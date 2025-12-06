import { useState } from 'react';
import { X, Zap, CalendarClock, Upload, Wand2, MessageCircle } from 'lucide-react';
import type { WorkflowConfig, PostConfig } from '../lib/types';

interface NewWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (config: WorkflowConfig) => void;
}


const WORKFLOW_PRESETS = [
    {
        id: 'plan_posts',
        name: 'Plan Posts for Today',
        description: 'Create a posting schedule with custom content and platforms',
        icon: CalendarClock,
        color: 'orange',
        customizable: true,
        config: {
            type: 'plan_posts' as const,
            platforms: ['instagram' as const],
            postCount: 3,
            enableDMs: false,
            enableSelfCorrection: false,
            contentSource: 'ai_generated' as const,
        }
    },
];

export function NewWorkflowModal({ isOpen, onClose, onStart }: NewWorkflowModalProps) {
    const [selectedPreset, setSelectedPreset] = useState<string>('plan_posts');
    const [postCount, setPostCount] = useState<number>(3);
    const [selectedPlatforms, setSelectedPlatforms] = useState<('instagram' | 'tiktok' | 'threads' | 'linkedin' | 'twitter' | 'facebook')[]>(['instagram']);
    const [contentSource, setContentSource] = useState<'upload' | 'ai_generated'>('ai_generated');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [individualPosts, setIndividualPosts] = useState<PostConfig[]>([]);
    const [makePosts, setMakePosts] = useState<boolean>(true);
    const [handleDMs, setHandleDMs] = useState<boolean>(false);

    // Initialize individual posts when count changes and > 3
    const handlePostCountChange = (count: number) => {
        setPostCount(count);
        if (count > 3) {
            const posts: PostConfig[] = Array.from({ length: count }, (_, i) => ({
                id: i + 1,
                topic: individualPosts[i]?.topic || '',
                platform: individualPosts[i]?.platform || selectedPlatforms[0] || 'instagram',
                description: individualPosts[i]?.description || '',
            }));
            setIndividualPosts(posts);
        } else {
            setIndividualPosts([]);
        }
    };

    const updateIndividualPost = (id: number, field: keyof PostConfig, value: string) => {
        setIndividualPosts(prev =>
            prev.map(post =>
                post.id === id ? { ...post, [field]: value } : post
            )
        );
    };

    if (!isOpen) return null;

    const handleStart = () => {
        const preset = WORKFLOW_PRESETS.find(p => p.id === selectedPreset);
        if (preset) {
            const config: WorkflowConfig = {
                ...preset.config,
                postCount: preset.customizable ? (makePosts ? postCount : 0) : preset.config.postCount,
                platforms: preset.customizable ? selectedPlatforms : preset.config.platforms,
                contentSource: preset.customizable ? contentSource : preset.config.contentSource,
                uploadedFiles: contentSource === 'upload' ? uploadedFiles : undefined,
                individualPosts: postCount > 3 ? individualPosts : undefined,
                enableDMs: preset.customizable ? handleDMs : preset.config.enableDMs,
            };
            onStart(config);
        }
        onClose();
    };

    const togglePlatform = (platform: 'instagram' | 'tiktok' | 'threads' | 'linkedin' | 'twitter' | 'facebook') => {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles(Array.from(e.target.files));
        }
    };

    const currentPreset = WORKFLOW_PRESETS.find(p => p.id === selectedPreset);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">New Workflow</h2>
                            <p className="text-sm text-orange-100">Configure and start a new agent simulation</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* Workflow Presets */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Workflow Type</h3>
                        <div className="grid gap-3">
                            {WORKFLOW_PRESETS.map((preset) => {
                                const Icon = preset.icon;
                                const isSelected = selectedPreset === preset.id;
                                return (
                                    <button
                                        key={preset.id}
                                        onClick={() => setSelectedPreset(preset.id)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                            ? `border-${preset.color}-500 bg-${preset.color}-50`
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isSelected ? `bg-${preset.color}-500` : 'bg-gray-100'
                                                }`}>
                                                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">{preset.name}</h4>
                                                <p className="text-sm text-gray-600">{preset.description}</p>
                                            </div>
                                            {isSelected && (
                                                <div className={`w-5 h-5 rounded-full bg-${preset.color}-500 flex items-center justify-center`}>
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Configuration Options */}
                    {currentPreset && currentPreset.customizable && (
                        <div className="space-y-6">
                            {/* Agent Tasks Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    What should the agent do today?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setMakePosts(!makePosts)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${makePosts
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${makePosts ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                                }`}>
                                                {makePosts && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CalendarClock className="w-5 h-5 text-gray-700" />
                                                    <h4 className="font-semibold text-gray-900 text-sm">Make Posts</h4>
                                                </div>
                                                <p className="text-xs text-gray-600">Create and publish content</p>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setHandleDMs(!handleDMs)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${handleDMs
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${handleDMs ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                                }`}>
                                                {handleDMs && (
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <MessageCircle className="w-5 h-5 text-gray-700" />
                                                    <h4 className="font-semibold text-gray-900 text-sm">Handle DMs</h4>
                                                </div>
                                                <p className="text-xs text-gray-600">Respond to messages</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Number of Posts */}
                            {makePosts && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        How many posts?
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={postCount}
                                        onChange={(e) => handlePostCountChange(parseInt(e.target.value) || 1)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                    />
                                    {postCount > 3 && (
                                        <p className="text-xs text-orange-600 mt-1">
                                            You'll configure each post individually below
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Platform Selection */}
                            {makePosts && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Select platforms
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['instagram', 'tiktok', 'threads', 'linkedin', 'twitter', 'facebook'] as const).map((platform) => (
                                            <button
                                                key={platform}
                                                onClick={() => togglePlatform(platform)}
                                                className={`px-4 py-2 rounded-lg border-2 font-medium capitalize transition-all ${selectedPlatforms.includes(platform)
                                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {platform}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Content Source */}
                            {makePosts && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Content source
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setContentSource('ai_generated')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${contentSource === 'ai_generated'
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${contentSource === 'ai_generated' ? 'bg-orange-500' : 'bg-gray-100'
                                                    }`}>
                                                    <Wand2 className={`w-5 h-5 ${contentSource === 'ai_generated' ? 'text-white' : 'text-gray-600'}`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm">AI Generated</h4>
                                                    <p className="text-xs text-gray-600">Create with AI</p>
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setContentSource('upload')}
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${contentSource === 'upload'
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${contentSource === 'upload' ? 'bg-orange-500' : 'bg-gray-100'
                                                    }`}>
                                                    <Upload className={`w-5 h-5 ${contentSource === 'upload' ? 'text-white' : 'text-gray-600'}`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 text-sm">Upload</h4>
                                                    <p className="text-xs text-gray-600">Use your files</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* File Upload */}
                            {makePosts && contentSource === 'upload' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Upload content
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-600">
                                                {uploadedFiles.length > 0
                                                    ? `${uploadedFiles.length} file(s) selected`
                                                    : 'Click to upload images or videos'}
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Individual Post Configuration (only if > 3 posts) */}
                            {makePosts && postCount > 3 && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-4">
                                        Configure Each Post
                                    </h3>
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                        {individualPosts.map((post) => (
                                            <div key={post.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-gray-900">Post {post.id}</h4>
                                                    <select
                                                        value={post.platform}
                                                        onChange={(e) => updateIndividualPost(post.id, 'platform', e.target.value)}
                                                        className="px-3 py-1 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
                                                    >
                                                        {selectedPlatforms.map((platform) => (
                                                            <option key={platform} value={platform}>
                                                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Topic/Theme
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={post.topic}
                                                            onChange={(e) => updateIndividualPost(post.id, 'topic', e.target.value)}
                                                            placeholder="e.g., Product launch, Behind the scenes..."
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Description (optional)
                                                        </label>
                                                        <textarea
                                                            value={post.description}
                                                            onChange={(e) => updateIndividualPost(post.id, 'description', e.target.value)}
                                                            placeholder="Add details about what this post should include..."
                                                            rows={2}
                                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Non-customizable workflow summary */}
                    {currentPreset && !currentPreset.customizable && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Workflow Configuration</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Platforms:</span>
                                    <span className="font-medium text-gray-900">
                                        {currentPreset.config.platforms.join(', ')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Posts to generate:</span>
                                    <span className="font-medium text-gray-900">{currentPreset.config.postCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">DM handling:</span>
                                    <span className={`font-medium ${currentPreset.config.enableDMs ? 'text-green-600' : 'text-gray-400'}`}>
                                        {currentPreset.config.enableDMs ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Self-correction:</span>
                                    <span className={`font-medium ${currentPreset.config.enableSelfCorrection ? 'text-green-600' : 'text-gray-400'}`}>
                                        {currentPreset.config.enableSelfCorrection ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleStart}
                        className="px-6 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium shadow-lg shadow-orange-200 transition-all hover:shadow-orange-300 flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4" />
                        Start Workflow
                    </button>
                </div>
            </div>
        </div>
    );
}
