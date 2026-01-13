import { motion } from 'framer-motion';
import { Activity, Users, FileText, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const stats = [
    { label: 'Active Agents', value: '12', trend: '+2.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Content Generated', value: '1,234', trend: '+15%', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Engagement Rate', value: '8.5%', trend: '+4.1%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'System Health', value: '98%', trend: 'Stable', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const recentActivity = [
    { id: 1, agent: 'ResearchBot', action: 'Analyzed 50 new tech trends', time: '2 mins ago', status: 'success' },
    { id: 2, agent: 'ContentWriter', action: 'Drafted 3 LinkedIn posts', time: '15 mins ago', status: 'success' },
    { id: 3, agent: 'TrendWatcher', action: 'Alert: Viral topic detected', time: '1 hour ago', status: 'warning' },
    { id: 4, agent: 'Publisher', action: 'Scheduled 5 tweets', time: '2 hours ago', status: 'success' },
];

const AgentMonitor = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agent Monitor</h1>
                    <p className="text-gray-500">Real-time overview of your autonomous agent swarm.</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Deploy New Agent
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.trend}
                                </span>
                                <span className="text-xs text-gray-400">vs last week</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Activity Feed and Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className={`mt-1 w-2 h-2 rounded-full ${item.status === 'warning' ? 'bg-amber-500' : 'bg-green-500'}`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        <span className="font-bold">{item.agent}</span>: {item.action}
                                    </p>
                                    <p className="text-xs text-gray-500">{item.time}</p>
                                </div>
                                {item.status === 'success' ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-amber-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status / Mini Map Placeholder */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">System Status</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">API Gateway</span>
                            </div>
                            <span className="text-xs font-bold text-green-600">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">Database</span>
                            </div>
                            <span className="text-xs font-bold text-green-600">Operational</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">AI Workers</span>
                            </div>
                            <span className="text-xs font-bold text-green-600">98% Uptime</span>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Resource Usage</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">CPU Usage</span>
                                        <span className="font-bold text-gray-700">45%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Memory</span>
                                        <span className="font-bold text-gray-700">62%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '62%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentMonitor;
