import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const Planner = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedView, setSelectedView] = useState<'month' | 'week'>('month');

    // Mock scheduled posts
    const posts = [
        { id: 1, title: 'Summer Campaign Teaser', platform: 'Instagram', date: '2025-12-10', time: '10:00 AM', type: 'reel', status: 'scheduled' },
        { id: 2, title: 'Product Launch v2', platform: 'TikTok', date: '2025-12-12', time: '02:00 PM', type: 'video', status: 'draft' },
        { id: 3, title: 'CEO Interview Clip', platform: 'LinkedIn', date: '2025-12-15', time: '09:00 AM', type: 'post', status: 'scheduled' },
        { id: 4, title: 'Holiday Sale Promo', platform: 'Instagram', date: '2025-12-20', time: '05:00 PM', type: 'story', status: 'scheduled' },
        { id: 5, title: 'Customer Testimonial', platform: 'X', date: '2025-12-08', time: '11:00 AM', type: 'post', status: 'posted' },
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentMonth);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear();
    };

    const getPostsForDay = (day: number) => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return posts.filter(p => p.date === dateStr);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Content Planner</h1>
                    <p className="text-secondary">Schedule and manage your upcoming content.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-surface rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setSelectedView('month')}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                selectedView === 'month' ? "bg-primary text-white" : "text-secondary hover:text-primary"
                            )}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setSelectedView('week')}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                selectedView === 'week' ? "bg-primary text-white" : "text-secondary hover:text-primary"
                            )}
                        >
                            Week
                        </button>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Post
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="bg-surface rounded-t-xl border-x border-t border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-primary">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex items-center gap-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-secondary">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-secondary">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-secondary hover:text-primary text-sm font-medium">
                    <Filter className="w-4 h-4" />
                    Filter by Platform
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-surface rounded-b-xl border border-border shadow-sm flex-1 min-h-[600px] flex flex-col">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-border">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-secondary uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {/* Empty cells for previous month */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="border-b border-r border-border bg-gray-50/30" />
                    ))}

                    {/* Actual Days */}
                    {Array.from({ length: days }).map((_, i) => {
                        const day = i + 1;
                        const dayPosts = getPostsForDay(day);
                        const isCurrentDay = isToday(day);

                        return (
                            <div key={day} className={cn(
                                "border-b border-r border-border p-2 min-h-[100px] relative transition-colors hover:bg-gray-50 group",
                                isCurrentDay && "bg-accent/5"
                            )}>
                                <span className={cn(
                                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1",
                                    isCurrentDay ? "bg-accent text-white" : "text-secondary"
                                )}>
                                    {day}
                                </span>

                                <div className="space-y-1">
                                    {dayPosts.map(post => (
                                        <div
                                            key={post.id}
                                            className={cn(
                                                "text-xs p-1.5 rounded border truncate cursor-pointer shadow-sm hover:shadow transition-all",
                                                post.platform === 'Instagram' ? "bg-pink-50 border-pink-100 text-pink-700" :
                                                    post.platform === 'TikTok' ? "bg-gray-100 border-gray-200 text-black" :
                                                        post.platform === 'LinkedIn' ? "bg-blue-50 border-blue-100 text-blue-700" :
                                                            "bg-sky-50 border-sky-100 text-sky-700"
                                            )}
                                        >
                                            <div className="flex items-center gap-1 mb-0.5">
                                                <Clock className="w-3 h-3 opacity-70" />
                                                <span className="font-semibold">{post.time}</span>
                                            </div>
                                            {post.title}
                                        </div>
                                    ))}
                                </div>

                                {/* Add button on hover */}
                                <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full text-secondary transition-all">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}

                    {/* Remaining empty cells to complete the grid if needed (optional, depends on grid css) */}
                    {Array.from({ length: 42 - (days + firstDay) }).map((_, i) => (
                        <div key={`empty-end-${i}`} className="border-b border-r border-border bg-gray-50/30" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Planner;
