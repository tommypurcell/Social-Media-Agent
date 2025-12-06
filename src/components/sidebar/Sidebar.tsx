
import { LayoutDashboard, Library, Calendar, BarChart3, Settings, UserCircle, Smartphone } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming I will create a utils file for clsx/tailwind-merge
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Monitor', path: '/' },
        { icon: Smartphone, label: 'Sample Feed', path: '/feed' },
        { icon: Library, label: 'Contents', path: '/contents' },
        { icon: Calendar, label: 'Planner', path: '/planner' },
        { icon: BarChart3, label: 'Reports', path: '/reports' },
    ];

    return (
        <div className="flex flex-col h-full bg-surface p-4">
            <div className="mb-8 flex items-center justify-center lg:justify-start lg:px-2">
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-xl shadow-md">
                    C
                </div>
                <span className="ml-3 font-semibold text-lg hidden lg:block text-primary">Connectivity</span>
            </div>

            <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-accent/10 text-accent font-medium shadow-sm"
                                    : "text-secondary hover:bg-gray-50 hover:text-primary"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="ml-3 hidden lg:block">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-border space-y-2">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        cn(
                            "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            isActive
                                ? "bg-accent/10 text-accent font-medium"
                                : "text-secondary hover:bg-gray-50 hover:text-primary"
                        )
                    }
                >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3 hidden lg:block">Settings</span>
                </NavLink>
                <div className="flex items-center px-3 py-2.5 text-secondary hover:text-primary cursor-pointer">
                    <UserCircle className="w-8 h-8 flex-shrink-0 text-gray-400" />
                    <div className="ml-3 hidden lg:block">
                        <p className="text-sm font-medium text-primary">Marathon Agent</p>
                        <p className="text-xs text-secondary">Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
