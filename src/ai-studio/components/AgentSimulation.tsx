import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { PostDraft } from '../types';

interface AgentSimulationProps {
    posts: PostDraft[];
    onReset: () => void;
}

export default function AgentSimulation({ posts, onReset }: AgentSimulationProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => Math.min(prev + 1, 100));
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="mb-6 relative">
                    <svg className="w-32 h-32 mx-auto transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-100"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 56}
                            strokeDashoffset={2 * Math.PI * 56 * (1 - progress / 100)}
                            className="text-green-500 transition-all duration-300 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {progress === 100 ? (
                            <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
                        ) : (
                            <span className="text-2xl font-bold text-gray-700">{progress}%</span>
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {progress === 100 ? 'Workflow Initiated!' : 'Analyzing & Scheduling...'}
                </h2>
                <p className="text-gray-500 mb-8">
                    {progress === 100
                        ? `Successfully queued ${posts.length} posts for auto-generation and scheduling.`
                        : 'The AI Agent is optimizing your content strategy.'}
                </p>

                <div className="flex flex-col gap-3">
                    <NavLink
                        to="/dashboard"
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        Go to Monitor <ArrowRight className="w-4 h-4" />
                    </NavLink>
                    <button
                        onClick={onReset}
                        className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Create New Workflow
                    </button>
                </div>
            </div>
        </div>
    );
}
