
import { Activity, Clock, FileVideo, CheckCircle2, AlertCircle, Play } from 'lucide-react';

const AgentMonitor = () => {
    const tasks = [
        {
            id: 1,
            title: 'Summer Campaign - Teaser',
            status: 'processing', // processing, completed, error, queued
            stage: 'Rendering TikTok Version',
            progress: 65,
            platform: 'TikTok',
            thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
        {
            id: 2,
            title: 'Product Launch v2',
            status: 'completed',
            stage: 'Scheduled for Tomorrow 10am',
            progress: 100,
            platform: 'Instagram',
            thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
        {
            id: 3,
            title: 'Behind the Scenes',
            status: 'queued',
            stage: 'Waiting for Agent',
            progress: 0,
            platform: 'Youtube Shorts',
            thumbnail: null,
        },
        {
            id: 4,
            title: 'CEO Interview',
            status: 'processing',
            stage: 'Analyzing Prompt & Sentiment',
            progress: 20,
            platform: 'LinkedIn',
            thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Agent Monitor</h1>
                <p className="text-secondary">Real-time supervision of Marathon Agent activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Status Overview Card */}
                <div className="col-span-full xl:col-span-3 bg-surface rounded-xl shadow-sm border border-border p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-full">
                            <Activity className="w-8 h-8 text-accent animate-pulse-slow" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary">System Status: Active</h3>
                            <p className="text-sm text-secondary">Processing 2 jobs concurrently. Next idle slot in 4m.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <span className="block text-2xl font-bold text-primary">12</span>
                            <span className="text-xs text-secondary uppercase tracking-wider">Completed Today</span>
                        </div>
                        <div className="text-right border-l border-border pl-4">
                            <span className="block text-2xl font-bold text-accent">2</span>
                            <span className="text-xs text-secondary uppercase tracking-wider">Pending</span>
                        </div>
                    </div>
                </div>

                {tasks.map((task) => (
                    <div key={task.id} className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                        <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {task.thumbnail ? (
                                <>
                                    <img src={task.thumbnail} alt={task.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                                    {task.status === 'completed' && <Play className="absolute w-12 h-12 text-white opacity-80" fill="currentColor" />}
                                </>
                            ) : (
                                <FileVideo className="w-12 h-12 text-gray-300" />
                            )}

                            <div className="absolute top-3 right-3 py-1 px-3 rounded-full bg-surface/90 backdrop-blur-sm text-xs font-bold text-primary shadow-sm">
                                {task.platform}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg text-primary truncate max-w-[80%]">{task.title}</h3>
                                {task.status === 'processing' && <Clock className="w-5 h-5 text-accent animate-spin-slow" />}
                                {task.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                {task.status === 'queued' && <Clock className="w-5 h-5 text-gray-400" />}
                                {task.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-secondary">{task.stage}</span>
                                    <span className="font-medium text-primary">{task.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${task.status === 'completed' ? 'bg-green-500' :
                                            task.status === 'processing' ? 'bg-accent' :
                                                'bg-gray-300'
                                            }`}
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Upload New Card */}
                <div className="bg-surface rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center p-8 hover:border-accent hover:bg-accent/5 transition-all cursor-pointer min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                        <FileVideo className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg text-primary mb-1">New Workflow</h3>
                    <p className="text-secondary text-center max-w-xs text-sm">Upload raw video & prompts. The Agent will handle the rest.</p>
                </div>

            </div>
        </div>
    );
};

export default AgentMonitor;
