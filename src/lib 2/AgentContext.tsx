import { createContext, type ReactNode } from 'react';

const AgentContext = createContext<any>(null);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
    return (
        <AgentContext.Provider value={{}}>
            {children}
        </AgentContext.Provider>
    );
};
