import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, BarChart2, CheckCircle2 } from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';

const Landing = () => {
    const navigate = useNavigate();
    const { completeOnboarding } = useOnboarding();

    const handleLaunch = () => {
        // In a real app, this would set the onboarding flag and redirect
        // For now, we assume the user might want to see the dashboard
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden font-sans text-gray-900">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                            F
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Feedie
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
                        <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
                        <a href="#about" className="text-sm font-medium text-gray-600 hover:text-gray-900">About</a>
                        <button
                            onClick={handleLaunch}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            Launch App
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Gradients (Enhanced with CSS Animation) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-purple-200/30 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob filter"></div>
                        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-yellow-200/30 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob animation-delay-2000 filter"></div>
                        <div className="absolute bottom-[-20%] left-[20%] w-[70%] h-[70%] bg-pink-200/30 rounded-full blur-3xl opacity-60 mix-blend-multiply animate-blob animation-delay-4000 filter"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Now with AI Video Generation</span>
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
                            Your Autonomous <br />
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Social Media Superpower
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 text-balance">
                            Feedie plans, creates, and publishes viral content while you sleep.
                            Experience the future of social media management with our swarm of intelligent agents.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleLaunch}
                                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Hero Image / Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-20 relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-900/5 aspect-[16/9] max-w-5xl mx-auto">
                            {/* Abstract representation of the dashboard for the landing page */}
                            <div className="absolute inset-0 bg-white">
                                <div className="h-full w-full flex items-center justify-center bg-gray-50">
                                    <p className="text-gray-400 font-medium">Dashboard Preview Placeholder</p>
                                    {/* In a real scenario, this would be an <img> or <video> of the app */}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to grow</h2>
                        <p className="text-gray-600 text-lg">
                            Stop trading time for engagement. Let Feedie handle the heavy lifting with enterprise-grade AI tools.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Zap}
                            title="Instant Content"
                            description="Generate high-quality posts, threads, and captions in seconds tailored to your unique voice."
                            delay={0}
                        />
                        <FeatureCard
                            icon={BarChart2}
                            title="Deep Analytics"
                            description="Track what's working with real-time insights into engagement, reach, and audience growth."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={CheckCircle2}
                            title="Auto-Scheduling"
                            description="Our smart scheduler picks the perfect time to post for maximum visibility across all platforms."
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
);

export default Landing;
