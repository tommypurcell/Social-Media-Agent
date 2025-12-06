import { useState } from 'react';
import { X, Zap, Upload, Wand2, Type, Video, Image as ImageIcon, Smile, Briefcase, GraduationCap, Flame, Sparkles, Clock, FileText, Send } from 'lucide-react';
import type { WorkflowConfig } from '../lib/types';

interface NewWorkflowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (config: WorkflowConfig) => void;
}

export function NewWorkflowModal({ isOpen, onClose, onStart }: NewWorkflowModalProps) {
    // 1. Content Type
    const [contentType, setContentType] = useState<'video' | 'image' | 'text'>('image');

    // 2. Input Method
    const [inputMethod, setInputMethod] = useState<'upload' | 'idea' | 'auto'>('auto');
    const [userIdea, setUserIdea] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    // 3. Platforms
    const [selectedPlatforms, setSelectedPlatforms] = useState<('instagram' | 'tiktok' | 'threads' | 'linkedin' | 'twitter' | 'facebook')[]>(['instagram']);

    // 4. Tone
    const [tone, setTone] = useState<'default' | 'energetic' | 'professional' | 'educational' | 'inspirational' | 'meme'>('default');

    // 5. Output Settings
    const [postCount, setPostCount] = useState(3);
    const [schedule, setSchedule] = useState<'now' | 'scheduled' | 'draft'>('scheduled');

    // 6. Smart Mode
    const [smartMode, setSmartMode] = useState(true);

    if (!isOpen) return null;

    const handleStart = () => {
        const config: WorkflowConfig = {
            type: 'custom',
            platforms: selectedPlatforms,
            contentType,
            inputMethod,
            tone,
            postCount,
            schedule,
            smartMode,
            userIdea: inputMethod === 'idea' ? userIdea : undefined,
            uploadedFiles: inputMethod === 'upload' ? uploadedFiles : undefined,
            enableDMs: false, // Defaulting to false for this simplified flow
            enableSelfCorrection: smartMode
        };
        onStart(config);
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

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Create Content</h2>
                            <p className="text-sm text-orange-100">Configure your autonomous generation workflow</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-8 overflow-y-auto flex-1 space-y-8">

                    {/* 1. Content Type */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">1. Content Type</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'image', label: 'Image', icon: ImageIcon },
                                { id: 'video', label: 'Video', icon: Video },
                                { id: 'text', label: 'Text Only', icon: Type }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setContentType(type.id as any)}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${contentType === type.id
                                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                                            : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                        }`}
                                >
                                    <type.icon className="w-8 h-8" />
                                    <span className="font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 2. Strategy / Input */}
                    <section>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">2. Strategy</h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {[
                                { id: 'auto', label: 'Auto-Generate', icon: Wand2, desc: 'Let AI decide based on trends' },
                                { id: 'idea', label: 'From Idea', icon: Sparkles, desc: 'Provide a topic or prompt' },
                                { id: 'upload', label: 'Upload Media', icon: Upload, desc: 'Use your own assets' }
                            ].map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => setInputMethod(method.id as any)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${inputMethod === method.id
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-100 hover:border-gray-200 ps-4'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${inputMethod === method.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <method.icon className="w-4 h-4" />
                                    </div>
                                    <div className={`font-medium ${inputMethod === method.id ? 'text-orange-900' : 'text-gray-900'}`}>{method.label}</div>
                                    <div className="text-xs text-gray-500 mt-1">{method.desc}</div>
                                </button>
                            ))}
                        </div>

                        {inputMethod === 'idea' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <textarea
                                    value={userIdea}
                                    onChange={(e) => setUserIdea(e.target.value)}
                                    placeholder="e.g. A post about the benefits of morning meditation..."
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none min-h-[100px]"
                                />
                            </div>
                        )}

                        {inputMethod === 'upload' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2.5 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-orange-50 file:text-orange-700
                                        hover:file:bg-orange-100
                                    "
                                />
                                {uploadedFiles.length > 0 && (
                                    <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> {uploadedFiles.length} files selected
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    <div className="grid grid-cols-2 gap-8">
                        {/* 3. Platforms */}
                        <section>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">3. Platforms</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {(['instagram', 'tiktok', 'threads', 'linkedin', 'twitter', 'facebook'] as const).map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => togglePlatform(platform)}
                                        className={`px-4 py-3 rounded-xl border-2 font-medium capitalize transition-all text-sm flex items-center justify-between ${selectedPlatforms.includes(platform)
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                                            }`}
                                    >
                                        {platform}
                                        {selectedPlatforms.includes(platform) && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 4. Tone */}
                        <section>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">4. Tone</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'default', label: 'Brand Default', icon: Briefcase },
                                    { id: 'energetic', label: 'Energetic', icon: Flame },
                                    { id: 'professional', label: 'Professional', icon: Briefcase },
                                    { id: 'educational', label: 'Educational', icon: GraduationCap },
                                    { id: 'inspirational', label: 'Inspirational', icon: Sparkles },
                                    { id: 'meme', label: 'Meme / Fun', icon: Smile }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTone(t.id as any)}
                                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${tone === t.id
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <t.icon className="w-4 h-4" />
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 5. Output Settings */}
                    <section className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Output Settings</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <span>Generate</span>
                                    <select
                                        value={postCount}
                                        onChange={(e) => setPostCount(Number(e.target.value))}
                                        className="bg-white border border-gray-200 rounded px-2 py-1 font-medium text-gray-900 focus:outline-none focus:border-orange-500"
                                    >
                                        {[1, 2, 3, 5, 10].map(n => (
                                            <option key={n} value={n}>{n} posts</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-px h-4 bg-gray-300" />
                                <div className="flex items-center gap-2">
                                    <span>Status:</span>
                                    <div className="flex bg-white rounded-lg border border-gray-200 p-0.5">
                                        {[
                                            { id: 'now', icon: Send },
                                            { id: 'scheduled', icon: Clock },
                                            { id: 'draft', icon: FileText }
                                        ].map(s => (
                                            <button
                                                key={s.id}
                                                onClick={() => setSchedule(s.id as any)}
                                                className={`p-1.5 rounded-md transition-colors ${schedule === s.id ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'
                                                    }`}
                                                title={s.id}
                                            >
                                                <s.icon className="w-4 h-4" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Smart Mode Toggle */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="font-semibold text-sm text-gray-900">Smart Mode</div>
                                <div className="text-xs text-gray-500">Auto-fix quality</div>
                            </div>
                            <button
                                onClick={() => setSmartMode(!smartMode)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${smartMode ? 'bg-orange-500' : 'bg-gray-200'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${smartMode ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleStart}
                        className="px-8 py-2.5 rounded-xl font-medium bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all hover:shadow-orange-300 flex items-center gap-2"
                        disabled={selectedPlatforms.length === 0}
                    >
                        <Zap className="w-4 h-4" />
                        Generate Content
                    </button>
                </div>
            </div>
        </div>
    );
}
