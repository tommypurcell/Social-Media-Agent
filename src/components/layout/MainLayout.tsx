import React, { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import AgentChat from '../agent/AgentChat';
import { FastCreationModal } from '../feed/FastCreationModal';
import { NewWorkflowModal } from '../NewWorkflowModal';
import { useAgentContext } from '../../lib/AgentContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { startWorkflow } = useAgentContext();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isFastContentOpen, setIsFastContentOpen] = useState(false);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-primary font-sans">
            {/* Sidebar - Left, Narrow */}
            <aside className="w-20 lg:w-64 flex-shrink-0 border-r border-border bg-surface shadow-sm z-10 transition-all duration-300">
                <Sidebar onFastContentCreate={() => setIsFastContentOpen(true)} />
            </aside>

            {/* Workspace - Center, Wide/Flex-Grow */}
            <main className="flex-grow flex flex-col h-full overflow-hidden relative">
                {children}
            </main>

            {/* Agent Chat Interface - Right, Persistent (Third Column) */}
            <aside className="w-80 flex-shrink-0 border-l border-border bg-surface z-10 hidden md:flex flex-col">
                <AgentChat />
            </aside>

            <NewWorkflowModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onStart={(config) => {
                    startWorkflow(config);
                    setIsCreateOpen(false);
                }}
            />

            <FastCreationModal
                isOpen={isFastContentOpen}
                onClose={() => setIsFastContentOpen(false)}
            />
        </div>
    );
};

export default MainLayout;
