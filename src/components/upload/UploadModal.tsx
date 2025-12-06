import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { X, UploadCloud, Film, Type, Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [step, setStep] = useState(1); // 1: Upload, 2: Details
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setStep(2);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStep(2);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-primary">New Workflow</h2>
                        <p className="text-sm text-secondary">Upload raw footage to start the agent.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {step === 1 ? (
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-all cursor-pointer group",
                                dragActive ? "border-accent bg-accent/5 scale-[1.01]" : "border-border hover:border-primary hover:bg-gray-50"
                            )}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input ref={fileInputRef} type="file" className="hidden" accept="video/*" onChange={handleChange} />
                            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-8 h-8 text-accent" />
                            </div>
                            <p className="text-lg font-medium text-primary">Drag & drop raw video here</p>
                            <p className="text-secondary text-sm mt-1">or click to browse files (MP4, MOV)</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* File Preview Card */}
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-border">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Film className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-primary truncate">{file?.name}</p>
                                    <p className="text-xs text-secondary">Ready for analysis</p>
                                </div>
                                <button onClick={() => { setFile(null); setStep(1); }} className="text-sm text-red-500 hover:underline">
                                    Remove
                                </button>
                            </div>

                            {/* Prompt Input */}
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2 flex items-center gap-2">
                                    <Type className="w-4 h-4 text-accent" />
                                    Strategic Direction (Optional)
                                </label>
                                <textarea
                                    className="w-full h-32 p-4 rounded-xl border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none bg-background resize-none text-sm"
                                    placeholder="e.g., Make this energetic for TikTok. Focus on the product demo part. Use trending audio."
                                />
                                <div className="mt-2 flex items-center gap-2 text-xs text-secondary">
                                    <Wand2 className="w-3 h-3 text-purple-500" />
                                    <span>Marathon Agent will auto-analyze context if left blank.</span>
                                </div>
                            </div>

                            {/* Brand Group Selector */}
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Target Brand Group</label>
                                <select className="w-full p-3 rounded-xl border border-border bg-background outline-none focus:border-accent text-sm">
                                    <option>Brand A (EcoWear)</option>
                                    <option>Brand B (TechDaily)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-gray-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-border font-medium text-secondary hover:bg-white transition-colors">
                        Cancel
                    </button>
                    <button
                        disabled={step === 1}
                        className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        onClick={() => {
                            toast.success('Marathon Agent started!', {
                                description: 'Analyzing footage and generating variants...',
                            });
                            onClose();
                        }}
                    >
                        <Wand2 className="w-4 h-4" />
                        Start Marathon Agent
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
