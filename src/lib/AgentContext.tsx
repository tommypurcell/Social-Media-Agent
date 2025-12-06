import { createContext, useContext, type ReactNode } from 'react';
import { useAgent } from './agent';
import type { AgentState, WorkflowConfig, Task } from './types';

interface AgentContextType {
    state: AgentState;
    toggleAgent: () => void;
    addTask: (description: string, type: Task['type'], metadata?: Record<string, unknown>) => void;
    generateSummary: () => void;
    startWorkflow: (config: WorkflowConfig) => void;
}

const AgentContext = createContext<AgentContextType | null>(null);

export function AgentProvider({ children }: { children: ReactNode }) {
    const agent = useAgent();
    return (
        <AgentContext.Provider value={agent}>
            {children}
        </AgentContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAgentContext() {
    const context = useContext(AgentContext);
    if (!context) throw new Error('useAgentContext must be used within AgentProvider');
    return context;
}
