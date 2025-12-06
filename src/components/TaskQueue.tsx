import type { Task } from '../lib/types';
import { ListTodo, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

interface TaskQueueProps {
    tasks: Task[];
}

export function TaskQueue({ tasks }: TaskQueueProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <ListTodo className="w-5 h-5 text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Task Queue</h2>
                <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                    {tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length} Active
                </span>
            </div>

            <div className="overflow-y-auto p-4 space-y-3 flex-1">
                {tasks.length === 0 && (
                    <div className="text-center text-gray-400 py-8 text-sm">
                        No tasks in queue. Waiting for agent...
                    </div>
                )}
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`p-3 rounded-lg border text-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${task.status === 'in_progress'
                            ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100'
                            : task.status === 'completed'
                                ? 'bg-gray-50 border-gray-100 opacity-60'
                                : 'bg-white border-gray-200'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <StatusIcon status={task.status} />
                            <div className="flex-1">
                                <p className={`font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                    {task.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded capitalize">
                                        {task.type.replace('_', ' ')}
                                    </span>
                                    {task.status === 'in_progress' && (
                                        <span className="text-xs text-blue-600 font-medium animate-pulse">
                                            Processing...
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusIcon({ status }: { status: Task['status'] }) {
    switch (status) {
        case 'in_progress':
            return <ArrowRight className="w-5 h-5 text-blue-500 animate-pulse" />;
        case 'completed':
            return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        case 'failed':
            return <XCircle className="w-5 h-5 text-red-500" />;
        case 'pending':
        default:
            return <Clock className="w-5 h-5 text-gray-400" />;
    }
}
