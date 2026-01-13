
import {
    LayoutDashboard,
    Library,
    Rss,
    Briefcase,
    Calendar,
    Bot,
    BarChart3,
    MessageSquare,
    Settings,
    Workflow
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Content Library',
        path: '/contents',
        icon: Library,
    },
    {
        name: 'Live Feed',
        path: '/feed',
        icon: Rss,
    },
    {
        name: 'Workspaces',
        path: '/workspace/default', // pointing to a default or handling dynamic ID later
        icon: Briefcase,
    },
    {
        name: 'Planner',
        path: '/planner',
        icon: Calendar,
    },
    {
        name: 'Workflows',
        path: '/workflow-planner',
        icon: Workflow,
    },
    {
        name: 'AI Studio',
        path: '/ai-studio',
        icon: Bot,
    },
    {
        name: 'Reports',
        path: '/reports',
        icon: BarChart3,
    },
    {
        name: 'Feedback',
        path: '/feedback',
        icon: MessageSquare,
    },
    {
        name: 'Settings',
        path: '/settings',
        icon: Settings,
    },
];
