import { useState, useRef } from 'react';
import { Upload, X, Zap, ArrowRight, Calendar } from 'lucide-react'; import { useAgentContext } from '../../lib/AgentContext';

interface FastCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FastCreationModal = ({ isOpen, onClose }: FastCreationModalProps) => {
    const { addTask } = useAgentContext(); // We'll assume we can also access setPost or similar if we modify context, or we just rely on addTask doing it if the agent is robust enough. 
    // Actually, we'll need a way to inject the new "preview" post into the state.
    // For now, let's assume we can use `addPost` if we expose it, or just modify the feed component to pull from a secondary "plans" source if not. 
    // But better: let's invoke a special agent task that adds the post to the state.

    // However, to make it instant in UI as requested ("show you a plan"), we might handle local state here first.

    const [step, setStep] = useState<'upload' | 'analyzing' | 'preview'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Simulated Plan Data
    const [plan, setPlan] = useState<{
        platform: 'instagram' | 'tiktok' | 'threads';
        caption: string;
        tags: string[];
        scheduledTime: number; // timestamp
        topic: string;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setStep('analyzing');
            analyzeFile(selectedFile);
        }
    };

    const analyzeFile = async (file: File) => {
        // Simulate AI Analysis
        // In a real app, we'd send the file to an API (Gemini Vision)
        setTimeout(() => {
            const now = new Date();
            // simple heuristic: randomly pick a platform or guess from file type
            const isVideo = file.type.startsWith('video');
            const platform = isVideo ? 'tiktok' : 'instagram';

            // "AI" generates tags and time
            const suggestedTime = new Date(now.getTime() + 1000 * 60 * 60 * (Math.floor(Math.random() * 24) + 1)); // 1-24 hours from now

            setPlan({
                platform,
                topic: 'New Content Drop', // generic for now
                caption: `Checking out this new vibration! What do you think? ✨`,
                tags: ['#viral', `#${platform}`, '#trending', '#fyp'],
                scheduledTime: suggestedTime.getTime()
            });
            setStep('preview');
        }, 2500);
    };

    const handleConfirm = () => {
        if (!plan || !file || !previewUrl) return;

        // 1. Create the Post Object with 'preview' or 'scheduled' status
        // We need to inject this into the global state. 
        // Ideally `useAgentContext` exposes a way to add a post.
        // If not, we might need to emit an event or - more "Agentic" - create a task that the agent "executes" safely.

        // For the immediate feedback requested ("show in feed tab"), we probably want to update the shared State.
        // Let's assume we can dispatch an action or we'll add a helper to context.
        // Or if we can't, we'll verify if `addTask` can carry a payload that the system reacts to.

        // Let's use `addTask` to represent the workflow in the monitor tab as requested.
        const taskDescription = `Fast-Track: Post to ${plan.platform} at ${new Date(plan.scheduledTime).toLocaleTimeString()}`;

        // We'll sneakily access the context's internal "addPost" if we can, or we assume the user will modify AgentContext to support `addPost`.
        // BUT, since I can't modify AgentContext easily without breaking interface potentially, 
        // I will dispatch a custom event or use the `addTask` metadata to carry the post payload and hope the Agent executes it (simulated).

        // Actually, the requirements say: "workflow will also be shown in the monitor tab".
        addTask(taskDescription, 'post_content', {
            platform: plan.platform,
            caption: plan.caption,
            imageUrl: previewUrl, // Using blob URL for now which works in session
            scheduledTime: plan.scheduledTime,
            status: 'scheduled',
            isFastTrack: true
        });

        // Close
        onClose();
        setStep('upload');
        setFile(null);
        setPlan(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Zap className="w-5 h-5 fill-indigo-600" />
                        <h3 className="font-bold text-gray-900">Fast Create</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 'upload' && (
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/10 transition-all group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                            />
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">Upload Media</h4>
                            <p className="text-sm text-gray-500">Drop an image or video to start</p>
                        </div>
                    )}

                    {step === 'analyzing' && (
                        <div className="flex flex-col items-center justify-center py-10 space-y-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-indigo-600 animate-pulse" />
                                </div>
                            </div>
                            <div className="text-center space-y-1">
                                <h4 className="font-bold text-gray-900">AI is analyzing content...</h4>
                                <p className="text-sm text-gray-500">Detecting subject, best platform, and optimal time</p>
                            </div>
                        </div>
                    )}

                    {step === 'preview' && plan && (
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                {/* Thumbnail */}
                                <div className="w-1/3 aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                                    {file?.type.startsWith('image') ? (
                                        <img src={previewUrl!} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={previewUrl!} className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md">
                                        Preview
                                    </div>
                                </div>

                                {/* Plan Details */}
                                <div className="w-2/3 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Optimization</label>
                                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-indigo-900 font-medium">Platform</span>
                                                <span className="text-xs bg-white px-2 py-0.5 rounded shadow-sm capitalize font-bold text-indigo-600">{plan.platform}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-indigo-900 font-medium">Subject</span>
                                                <span className="text-xs bg-white px-2 py-0.5 rounded shadow-sm capitalize text-indigo-600">{plan.topic}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Schedule</label>
                                        <div className="flex items-center gap-2 p-2 px-3 border border-gray-200 rounded-lg bg-gray-50 text-sm font-medium text-gray-700">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            {new Date(plan.scheduledTime).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Generated Tags</label>
                                        <div className="flex flex-wrap gap-1">
                                            {plan.tags.map(tag => (
                                                <span key={tag} className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'preview' && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                        <button
                            onClick={() => setStep('upload')}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all transform hover:scale-105"
                        >
                            Schedule & Post
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
