import type { Log } from '../lib/types';
import { Terminal, Activity } from 'lucide-react';

interface StatePanelProps {
    logs: Log[];
}

export function StatePanel({ logs }: StatePanelProps) {
    return (
        <div className="bg-gray-900 text-gray-300 rounded-xl shadow-lg border border-gray-800 overflow-hidden h-full flex flex-col font-mono text-xs">
            <div className="p-3 border-b border-gray-800 flex items-center gap-2 bg-gray-950">
                <Terminal className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-gray-400">System Logs</span>
                <Activity className="w-3 h-3 text-green-500 animate-pulse ml-auto" />
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {logs.map((log) => (
                    <div key={log.id} className="flex gap-2">
                        <span className="text-gray-600 shrink-0">
                            [{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}]
                        </span>
                        <span className={`${log.level === 'error' ? 'text-red-400 font-bold' :
                            log.level === 'success' ? 'text-green-400' :
                                log.level === 'warning' ? 'text-yellow-400' :
                                    'text-gray-300'
                            }`}>
                            {log.level === 'error' && '✖ '}
                            {log.level === 'success' && '✔ '}
                            {log.message}
                        </span>
                    </div>
                ))}
                {logs.length === 0 && <span className="text-gray-700">Waiting for agent activity...</span>}
            </div>
        </div>
    );
}
