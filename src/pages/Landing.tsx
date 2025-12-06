
import { useState } from 'react';
import { ArrowRight, BarChart3, Calendar, Layers, Sparkles, Zap, MessageCircle, CheckCircle } from 'lucide-react';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';
import { useOnboarding, type OnboardingData } from '../hooks/useOnboarding';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const { completeOnboarding } = useOnboarding();
    const navigate = useNavigate();

    const handleOnboardingComplete = (data: OnboardingData) => {
        completeOnboarding(data);
        setShowOnboarding(false);
        navigate('/dashboard'); // Use explicit route for dashboard
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                            Connectivity
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
                            How it Works
                        </a>
                        <button
                            onClick={() => setShowOnboarding(true)}
                            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent -z-10" />
                <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10 animate-pulse" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide mb-6">
                            <Sparkles className="w-3 h-3" />
                            <span>AI-Powered Social Media Management</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
                            The future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                                effortless growth.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
                            Connectivity is your autonomous AI marketing agent. Plan, create, and optimize your social media presence across platforms with zero friction.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setShowOnboarding(true)}
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-indigo-600 text-white font-semibold text-lg hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                            <button className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-lg hover:bg-slate-50 transition-all">
                                View Demo
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Metrics */}
            <section className="py-12 border-y border-slate-100 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Active Users', value: '10k+' },
                        { label: 'Posts Generated', value: '1M+' },
                        { label: 'Time Saved', value: '500hrs' },
                        { label: 'Platform Support', value: '4+' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                            <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Features Grid */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to scale</h2>
                        <p className="text-lg text-slate-600">
                            Stop wrestling with complex tools. Connectivity integrates every step of your workflow into one seamless AI-driven experience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Layers className="w-8 h-8 text-indigo-600" />}
                            title="Multi-Channel Workflow"
                            description="Manage Instagram, Threads, TikTok, and more from a single, unified dashboard."
                        />
                        <FeatureCard
                            icon={<Sparkles className="w-8 h-8 text-violet-600" />}
                            title="AI Content Generation"
                            description="Generate high-quality captions, hashtags, and visual ideas instantly with our advanced AI models."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-8 h-8 text-purple-600" />}
                            title="Real-time Analytics"
                            description="Track performance metrics and audience engagement to optimize your strategy automatically."
                        />
                        <FeatureCard
                            icon={<Calendar className="w-8 h-8 text-pink-600" />}
                            title="Smart Scheduling"
                            description="Let AI determine the best times to post for maximum reach and engagement."
                        />
                        <FeatureCard
                            icon={<MessageCircle className="w-8 h-8 text-orange-600" />}
                            title="Unified Inbox"
                            description="Reply to comments and messages across all platforms in one centralized place."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-teal-600" />}
                            title="Automated Actions"
                            description="Set up workflows to automatically follow up, repost, or curate content."
                        />
                    </div>
                </div>
            </section>

            {/* Preview Section */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                                Design, Plan, and Publish <br />
                                <span className="text-indigo-400">in seconds.</span>
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    'Drag-and-drop visual planner',
                                    'AI-assisted copy editing',
                                    'One-click multi-platform publishing',
                                    'Team collaboration features'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-slate-300">
                                        <CheckCircle className="w-6 h-6 text-indigo-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setShowOnboarding(true)}
                                className="mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-lg transition-colors"
                            >
                                Start Creating Now
                            </button>
                        </div>
                        <div className="flex-1 w-full max-w-xl lg:max-w-none">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl p-4 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors"></div>
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-800 rounded-xl mx-auto flex items-center justify-center border border-slate-700 shadow-inner">
                                        <Zap className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <h3 className="text-xl font-medium text-slate-200">Interactive Workspace Preview</h3>
                                    <p className="text-slate-400 text-sm">Experience the power of our agent interface</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-bold">C</div>
                        <span className="font-semibold text-slate-900">Connectivity</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        © 2024 Connectivity Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Twitter</a>
                        <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">LinkedIn</a>
                        <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Instagram</a>
                    </div>
                </div>
            </footer>

            {/* Onboarding Modal Overlay */}
            {showOnboarding && (
                <OnboardingModal
                    onComplete={handleOnboardingComplete}
                    onClose={() => setShowOnboarding(false)}
                />
            )}
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
        <div className="mb-6 inline-block p-3 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);

export default Landing;
