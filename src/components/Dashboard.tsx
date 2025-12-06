import { useState } from 'react';
import type { AgentState, WorkflowConfig } from '../lib/types';
import { TaskQueue } from './TaskQueue';
import { Feed } from './Feed';
import { Inbox } from './Inbox';
import { StatePanel } from './StatePanel';
import { NewWorkflowModal } from './NewWorkflowModal';
import { Play, Pause, Plus } from 'lucide-react';

interface DashboardProps {
    state: AgentState;
    onToggle: () => void;
    onGenerateSummary: () => void;
    onStartWorkflow?: (config: WorkflowConfig) => void;
}

export function Dashboard({ state, onToggle, onGenerateSummary, onStartWorkflow }: DashboardProps) {
    const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

    const handleStartWorkflow = (config: WorkflowConfig) => {
        if (onStartWorkflow) {
            onStartWorkflow(config);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Marathon Agent</h1>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <span className={`w-2 h-2 rounded-full ${state.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                            <span className="text-gray-500">{state.isActive ? 'ONLINE - AUTONOMOUS MODE' : 'OFFLINE - STANDBY'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsWorkflowModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Workflow
                    </button>

                    <button
                        onClick={onToggle}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${state.isActive
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5'
                            }`}
                    >
                        {state.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {state.isActive ? 'Pause Simulation' : 'Start Simulation'}
                    </button>

                    <button
                        onClick={onGenerateSummary}
                        className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 font-medium transition-all"
                    >
                        End Day
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <main className="flex-1 p-6 overflow-hidden">
                <div className="grid grid-cols-12 gap-6 h-full">
                    {/* Left Column: Tasks & State (3 cols) */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full">
                        <div className="flex-1 min-h-0">
                            <TaskQueue tasks={state.tasks} />
                        </div>
                        <div className="h-1/3 min-h-[200px]">
                            <StatePanel logs={state.logs} />
                        </div>
                    </div>

                    {/* Middle Column: Feed (6 cols) */}
                    <div className="col-span-12 lg:col-span-6 h-full min-h-0">
                        <Feed posts={state.posts} />
                    </div>

                    {/* Right Column: Inbox (3 cols) */}
                    <div className="col-span-12 lg:col-span-3 h-full min-h-0">
                        <Inbox messages={state.messages} />
                    </div>
                </div>
            </main>

            {/* New Workflow Modal */}
            <NewWorkflowModal
                isOpen={isWorkflowModalOpen}
                onClose={() => setIsWorkflowModalOpen(false)}
                onStart={handleStartWorkflow}
            />
        </div>
    );
}
