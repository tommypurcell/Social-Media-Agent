import React, { useState } from 'react';
import type { WorkflowConfig, Platform, ContentSource } from '../types';
import {
    Sparkles,
    Upload,
    Zap,
    Building2,
    Settings,
    ChevronRight
} from 'lucide-react';

interface Props {
    onStart: (config: WorkflowConfig) => void;
}

const WorkflowConfigModal: React.FC<Props> = ({ onStart }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'strategy'>('profile');

    // Business Profile State
    const [businessName, setBusinessName] = useState('');
    const [businessDescription, setBusinessDescription] = useState('');

    // Strategy State
    const [postCount, setPostCount] = useState<number>(3);
    const [platforms, setPlatforms] = useState<Platform[]>(['Instagram']);
    const [contentSource, setContentSource] = useState<ContentSource>('AI Generated');

    const togglePlatform = (p: Platform) => {
        setPlatforms(prev =>
            prev.includes(p)
                ? prev.filter(item => item !== p)
                : [...prev, p]
        );
    };

    const handleStart = () => {
        if (!businessName.trim()) {
            setActiveTab('profile');
            // Simple alert or shake effect could go here, for now just redirecting
            return;
        }

        onStart({
            workflowType: 'Plan Posts',
            postCount,
            platforms: platforms.length > 0 ? platforms : ['Instagram'], // Fallback
            contentSource,
            businessName,
            businessDescription
        });
    };

    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="bg-surface w-full max-w-2xl rounded-xl shadow-lg border border-border overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-surface p-6 flex justify-between items-start border-b border-border">
                    <div className="flex gap-4">
                        <div className="p-2 bg-accent/10 rounded-lg h-10 w-10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-primary">New Workflow</h2>
                            <p className="text-secondary text-sm">Setup your content generation agent</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border bg-background">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'profile'
                                ? 'text-accent border-b-2 border-accent bg-accent/5'
                                : 'text-secondary hover:text-primary hover:bg-surface'
                            }`}
                    >
                        <Building2 className="w-4 h-4" /> 1. Business Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('strategy')}
                        className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${activeTab === 'strategy'
                                ? 'text-accent border-b-2 border-accent bg-accent/5'
                                : 'text-secondary hover:text-primary hover:bg-surface'
                            }`}
                    >
                        <Settings className="w-4 h-4" /> 2. Content Strategy
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-8 flex-1 bg-background">

                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Business Name</label>
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="e.g., Luxe Bakery, TechStart Solutions"
                                    className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all placeholder-secondary/50"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">Business Description</label>
                                <textarea
                                    value={businessDescription}
                                    onChange={(e) => setBusinessDescription(e.target.value)}
                                    placeholder="Describe what your business does, your target audience, and your brand voice..."
                                    rows={5}
                                    className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all resize-none placeholder-secondary/50"
                                />
                                <p className="text-xs text-secondary mt-2">The AI will use this to tailor captions and hashtags to your brand.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'strategy' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Post Count */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary mb-2">Post Quantity</h3>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={postCount}
                                    onChange={(e) => setPostCount(parseInt(e.target.value) || 1)}
                                    className="w-full bg-surface border border-border rounded-lg p-3 text-primary focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                                />
                            </div>

                            {/* Platforms */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary mb-2">Target Platforms</h3>
                                <div className="flex gap-3 flex-wrap">
                                    {(['Instagram', 'Tiktok', 'Threads', 'YouTube Shorts'] as Platform[]).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => togglePlatform(p)}
                                            className={`flex-1 min-w-[120px] py-3 px-4 rounded-lg border font-medium transition-all ${platforms.includes(p)
                                                    ? 'border-accent text-accent bg-accent/10 ring-1 ring-accent'
                                                    : 'border-border text-secondary bg-surface hover:border-accent/50 hover:text-primary'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Source */}
                            <div>
                                <h3 className="text-sm font-semibold text-primary mb-2">Content Source</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setContentSource('AI Generated')}
                                        className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all ${contentSource === 'AI Generated'
                                                ? 'border-accent ring-1 ring-accent bg-accent/10'
                                                : 'bg-surface border-border hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-white">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-primary">AI Generated</div>
                                            <div className="text-xs text-secondary">Create with AI</div>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setContentSource('Upload')}
                                        className={`cursor-pointer p-4 rounded-xl border flex items-center gap-4 transition-all ${contentSource === 'Upload'
                                                ? 'border-accent ring-1 ring-accent bg-accent/10'
                                                : 'bg-surface border-border hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-primary">Upload</div>
                                            <div className="text-xs text-secondary">Use your files</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border flex justify-end items-center bg-surface gap-3">
                    {activeTab === 'profile' ? (
                        <button
                            onClick={() => {
                                if (businessName.trim()) setActiveTab('strategy');
                                else alert("Please enter a business name");
                            }}
                            className="bg-primary hover:bg-primary/90 text-surface px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleStart}
                            className="bg-accent hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-sm active:transform active:scale-95"
                        >
                            <Zap className="w-4 h-4 fill-current" />
                            Start Workflow
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkflowConfigModal;
