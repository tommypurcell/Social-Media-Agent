import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import FeedbackLoop from '../feedback/FeedbackLoop';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-primary font-sans">
            {/* Sidebar - Left, Narrow */}
            <aside className="w-20 lg:w-64 flex-shrink-0 border-r border-border bg-surface shadow-sm z-10 transition-all duration-300">
                <Sidebar />
            </aside>

            {/* Workspace - Center, Wide/Flex-Grow */}
            <main className="flex-grow flex flex-col h-full overflow-hidden relative">
                {children}
            </main>

            {/* Feedback Loop - Right, Medium */}
            <aside className="w-80 flex-shrink-0 border-l border-border bg-surface z-10 hidden xl:flex flex-col">
                <FeedbackLoop />
            </aside>
        </div>
    );
};

export default MainLayout;
