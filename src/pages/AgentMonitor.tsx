import { Activity, Clock, Play, Square, Calendar } from 'lucide-react';
import { useAgentContext } from '../lib/AgentContext';


const AgentMonitor = () => {
    const { state, toggleAgent } = useAgentContext();
    // processedRef...

    // ... (existing useEffect for location.state remains somewhat relevant but could be cleaned if NewWorkflowModal was the only source, but keeping it for safety as other flows might use it)

    // Map real tasks
    const activeTasks = state.tasks.map(task => ({
        id: task.id,
        title: task.description.split(':')[1] || task.description,
        status: task.status === 'in_progress' ? 'processing' : task.status === 'pending' ? 'queued' : task.status,
        stage: task.type.replace('_', ' ').toUpperCase(),
        progress: task.status === 'completed' ? 100 : task.status === 'in_progress' ? 50 : 0,
        platform: task.description.toLowerCase().includes('instagram') ? 'Instagram' :
            task.description.toLowerCase().includes('tiktok') ? 'TikTok' : 'Social',
        thumbnail: null,
        timestamp: task.completedAt || task.createdAt
    }));

    // ... (getGreeting)

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8">
            {/* ... (Header section remains) ... */}

            <div className="mb-8">
                {/* ... (Header content) ... */}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Status Overview Card - Full Width */}
                <div className="col-span-full bg-surface rounded-xl shadow-sm border border-border p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${state.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Activity className={`w-8 h-8 ${state.isActive ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-primary">
                                System Status: {state.isActive ? 'Active - Autonomous' : 'Standby'}
                            </h3>
                            <p className="text-sm text-secondary">
                                {activeTasks.filter(t => t.status === 'processing').length} jobs running, {activeTasks.filter(t => t.status === 'queued').length} queued.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* No New Workflow Button */}
                        <button
                            onClick={toggleAgent}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm ${state.isActive
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:shadow-red-100'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200'
                                }`}
                        >
                            {state.isActive ? (
                                <>
                                    <Square className="w-4 h-4 fill-current" />
                                    Stop Agent
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 fill-current" />
                                    Start Agent Loop
                                </>
                            )}
                        </button>

                        <div className="flex gap-4 border-l border-border pl-6">
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-primary">
                                    {activeTasks.filter(t => t.status === 'completed').length}
                                </span>
                                <span className="text-xs text-secondary uppercase tracking-wider">Completed</span>
                            </div>
                            <div className="text-right border-l border-border pl-4">
                                <span className="block text-2xl font-bold text-accent">
                                    {activeTasks.filter(t => t.status === 'queued' || t.status === 'processing').length}
                                </span>
                                <span className="text-xs text-secondary uppercase tracking-wider">Pending</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline View - Full Width */}
                <div className="col-span-full">
                    <h2 className="text-xl font-bold text-primary mb-4">Activity Log & Schedule</h2>
                    <div className="space-y-8">
                        {/* Group tasks by date */}
                        {Object.entries(activeTasks.reduce((groups, task) => {
                            const date = new Date(task.timestamp || 0).toLocaleDateString(undefined, {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            });
                            if (!groups[date]) groups[date] = [];
                            groups[date].push(task);
                            return groups;
                        }, {} as Record<string, typeof activeTasks>)).map(([date, tasks]) => (
                            <div key={date} className="relative">
                                {/* Date Header (Sticky) */}
                                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 mb-4 border-b border-border">
                                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {date}
                                    </h3>
                                </div>

                                {/* Timeline Items - Sorted by Recent First (Descending timestamp) */}
                                <div className="relative ml-3 space-y-6 pl-8 border-l-2 border-border/50">
                                    {tasks.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).map((task) => (
                                        <div key={task.id} className="relative group">
                                            {/* Timeline Node */}
                                            <div className={`absolute -left-[39px] mt-1.5 w-5 h-5 rounded-full border-4 border-background transition-colors ${task.status === 'processing' ? 'bg-accent animate-pulse' :
                                                task.status === 'completed' ? 'bg-green-500' :
                                                    task.status === 'queued' ? 'bg-yellow-400' :
                                                        task.status === 'failed' ? 'bg-red-500' :
                                                            'bg-gray-300'
                                                }`} />

                                            {/* Content Card */}
                                            <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-md transition-shadow group-hover:border-accent/30">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${task.status === 'processing' ? 'bg-accent/10 text-accent' :
                                                                task.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                                    task.status === 'queued' ? 'bg-yellow-50 text-yellow-700' :
                                                                        'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {task.status.toUpperCase()}
                                                            </span>
                                                            <span className="text-xs text-secondary">
                                                                {new Date(task.timestamp || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-base font-semibold text-primary truncate">
                                                            {task.title}
                                                        </h4>
                                                        <p className="text-sm text-secondary mt-1">
                                                            {task.platform} • {task.stage}
                                                        </p>

                                                        {/* Progress Bar for Active Tasks */}
                                                        {task.status === 'processing' && (
                                                            <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                                <div className="h-full bg-accent rounded-full animate-progress" style={{ width: '60%' }} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Thumbnail (if exists) */}
                                                    {task.thumbnail && (
                                                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                                            <img src={task.thumbnail} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {activeTasks.length === 0 && (
                            <div className="text-center py-12 text-secondary">
                                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="mb-4">No activity yet. Start a new workflow to get started.</p>
                                <button
                                    onClick={() => toggleAgent()}
                                    className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-sm"
                                >
                                    Start Agent
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentMonitor;
