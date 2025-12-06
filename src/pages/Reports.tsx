import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Eye, MousePointerClick, Share2 } from 'lucide-react';

const Reports = () => {
    const data = [
        { name: 'Mon', engagement: 4000, views: 2400 },
        { name: 'Tue', engagement: 3000, views: 1398 },
        { name: 'Wed', engagement: 2000, views: 9800 },
        { name: 'Thu', engagement: 2780, views: 3908 },
        { name: 'Fri', engagement: 1890, views: 4800 },
        { name: 'Sat', engagement: 2390, views: 3800 },
        { name: 'Sun', engagement: 3490, views: 4300 },
    ];

    const platformData = [
        { name: 'Instagram', value: 45 },
        { name: 'TikTok', value: 30 },
        { name: 'YouTube', value: 15 },
        { name: 'LinkedIn', value: 10 },
    ];

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Reports & Analytics</h1>
                <p className="text-secondary">Track performance across all your channels.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Total Views"
                    value="1.2M"
                    change="+12.5%"
                    icon={Eye}
                    trend="up"
                />
                <MetricCard
                    title="Engagement Rate"
                    value="4.8%"
                    change="+2.1%"
                    icon={MousePointerClick}
                    trend="up"
                />
                <MetricCard
                    title="Total Followers"
                    value="89.4K"
                    change="-0.4%"
                    icon={Users}
                    trend="down"
                />
                <MetricCard
                    title="Shares"
                    value="12.3K"
                    change="+8.2%"
                    icon={Share2}
                    trend="up"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-surface p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-primary mb-6">Engagement Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChartWrapper data={data} />
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Platform Distribution */}
                <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-primary mb-6">Platform Share</h3>
                    <div className="space-y-6">
                        {platformData.map((item) => (
                            <div key={item.name}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-primary font-medium">{item.name}</span>
                                    <span className="text-secondary">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent rounded-full transition-all duration-1000"
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {change}
            </div>
        </div>
        <h3 className="text-secondary text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-primary mt-1">{value}</p>
    </div>
);

// Separate component to keep recharts logic clean
const AreaChartWrapper = ({ data }: { data: any[] }) => (
    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
        <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#374151', fontSize: '12px' }}
        />
        <Line type="monotone" dataKey="views" stroke="#D97706" strokeWidth={3} dot={{ fill: '#D97706', strokeWidth: 2 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="engagement" stroke="#8A8A8A" strokeWidth={3} dot={{ fill: '#8A8A8A', strokeWidth: 2 }} />
    </LineChart>
);

export default Reports;
