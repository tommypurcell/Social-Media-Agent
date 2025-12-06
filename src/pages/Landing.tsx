
import { useState } from 'react';
import { ArrowRight, BarChart3, Calendar, Layers, Sparkles, Zap, MessageCircle, CheckCircle, Star, TrendingUp, Users, Smartphone } from 'lucide-react';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';
import { VideoMarquee } from '../components/landing/VideoMarquee';
import { GradientShader } from '../components/landing/GradientShader';
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
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
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
                {/* Background Shader */}
                <GradientShader />

                {/* Fallback/Accent Backgrounds */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-300/30 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-300/30 rounded-full blur-[80px] -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative">
                    {/* Video Marquee Container - Positioned as a dynamic background layer */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[900px] hidden xl:block overflow-hidden pointer-events-none fade-mask z-0 opacity-90">
                        <div className="rotate-y-12 transform-3d scale-110">
                            <VideoMarquee />
                        </div>
                    </div>

                    <div className="max-w-2xl relative z-10 bg-white/40 backdrop-blur-md rounded-3xl p-8 -ml-6 shadow-xl border border-white/50">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wide mb-4 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            <span>AI-Powered Social Media Management</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6 drop-shadow-sm">
                            The future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                                effortless growth.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-800 mb-8 leading-relaxed font-medium">
                            Connectivity is your autonomous AI marketing agent. Plan, create, and optimize your social media presence across platforms with zero friction.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setShowOnboarding(true)}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 shadow-md"
                            >
                                Get Started Free
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </button>
                            <button className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-base hover:bg-slate-50 transition-all shadow-sm">
                                View Demo
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-600">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${10 + i})`, backgroundSize: 'cover' }} />
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                </div>
                                <span>Loved by 10,000+ creators</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Metrics */}
            <section className="py-12 border-y border-slate-100 bg-white/60 backdrop-blur-sm relative z-10">
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

            {/* Use Cases Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for every creator</h2>
                        <p className="text-lg text-slate-600">Whether you're a solo creator or a scaling agency, Connectivity adapts to your workflow.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <UseCaseCard
                            icon={<Smartphone className="w-6 h-6 text-indigo-600" />}
                            title="Influencers"
                            description="Maintain a consistent presence across all platforms without spending hours on scheduling and editing."
                            tags={['Viral Growth', 'Consistent Posting']}
                        />
                        <UseCaseCard
                            icon={<TrendingUp className="w-6 h-6 text-violet-600" />}
                            title="Small Businesses"
                            description="Turn your social media channels into revenue generators with AI-optimized product posts and engagement."
                            tags={['ROI Focused', 'Brand Awareness']}
                        />
                        <UseCaseCard
                            icon={<Users className="w-6 h-6 text-pink-600" />}
                            title="Agencies"
                            description="Manage multiple client accounts from a single dashboard with automated reporting and approval workflows."
                            tags={['Multi-client', 'Automated Reports']}
                        />
                    </div>
                </div>
            </section>

            {/* Main Features Grid */}
            <section id="features" className="py-24 bg-white relative">
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

            {/* Testimonials Section */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                {/* Background Detail */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Loved by creators worldwide</h2>
                        <p className="text-slate-400 text-lg">Don't just take our word for it. Here's what our community has to say.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <TestimonialCard
                            quote="Connectivity has completely transformed how I manage my brand. I save at least 15 hours a week."
                            author="Sarah Jenkins"
                            role="Lifestyle Creator"
                            image="https://i.pravatar.cc/100?img=5"
                        />
                        <TestimonialCard
                            quote="The AI content generation is scarily good. It captures my tone perfectly every single time."
                            author="Marcus Chen"
                            role="Digital Artist"
                            image="https://i.pravatar.cc/100?img=11"
                        />
                        <TestimonialCard
                            quote="Finally, a tool that actually handles multi-platform scheduling without glitching. A game changer."
                            author="Elena Rodriguez"
                            role="Marketing Agency Owner"
                            image="https://i.pravatar.cc/100?img=9"
                        />
                    </div>
                </div>
            </section>

            {/* Preview Section */}
            <section className="py-24 bg-white overflow-hidden relative border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-slate-900">
                                Design, Plan, and Publish <br />
                                <span className="text-indigo-600">in seconds.</span>
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    'Drag-and-drop visual planner',
                                    'AI-assisted copy editing',
                                    'One-click multi-platform publishing',
                                    'Team collaboration features'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-lg text-slate-700">
                                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => setShowOnboarding(true)}
                                className="mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold text-lg transition-colors shadow-lg shadow-indigo-200"
                            >
                                Start Creating Now
                            </button>
                        </div>
                        <div className="flex-1 w-full max-w-xl lg:max-w-none">
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 shadow-2xl p-4 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-indigo-50/50 group-hover:bg-indigo-100/50 transition-colors"></div>
                                <div className="text-center space-y-4 relative z-10">
                                    <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center border border-slate-100 shadow-lg">
                                        <Zap className="w-10 h-10 text-indigo-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Interactive Workspace Preview</h3>
                                    <p className="text-slate-500 text-sm">Experience the power of our agent interface</p>
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

const UseCaseCard = ({ icon, title, description, tags }: { icon: React.ReactNode, title: string, description: string, tags: string[] }) => (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-slate-50">{icon}</div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                    {tag}
                </span>
            ))}
        </div>
    </div>
);

const TestimonialCard = ({ quote, author, role, image }: { quote: string, author: string, role: string, image: string }) => (
    <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 relative">
        <div className="text-indigo-500 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
            </svg>
        </div>
        <p className="text-slate-300 text-lg mb-6 leading-relaxed italic">"{quote}"</p>
        <div className="flex items-center gap-3">
            <img src={image} alt={author} className="w-10 h-10 rounded-full bg-slate-700" />
            <div>
                <div className="font-semibold text-white">{author}</div>
                <div className="text-sm text-slate-500">{role}</div>
            </div>
        </div>
    </div>
);

export default Landing;
