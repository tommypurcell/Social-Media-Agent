import { MessageSquare, Heart, TrendingUp, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

const FeedbackLoop = () => {
    const activities = [
        {
            user: 'Sarah Lee',
            action: 'commented on',
            target: 'Instagram Story (9:16)',
            content: 'The transition at 0:15 is a bit abrupt. Can we smooth it out?',
            time: '2m ago',
            type: 'comment',
        },
        {
            user: 'Brand Team',
            action: 'approved',
            target: 'TikTok Ver',
            content: null,
            time: '15m ago',
            type: 'approval',
        },
        {
            user: 'Analytics Bot',
            action: 'insight',
            target: 'X Post',
            content: 'Engagement rate is projected to be +15% with current hashtags.',
            time: '1h ago',
            type: 'insight',
        },
        {
            user: 'Mike Chen',
            action: 'liked',
            target: 'LinkedIn Cut',
            content: null,
            time: '3h ago',
            type: 'like',
        },
    ];

    return (
        <div className="flex flex-col h-full bg-surface">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-primary">Feedback Loop</h2>
                <p className="text-sm text-secondary">Live updates & interactions</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activities.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start group">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            item.type === 'comment' ? "bg-blue-100 text-blue-600" :
                                item.type === 'approval' ? "bg-green-100 text-green-600" :
                                    item.type === 'insight' ? "bg-purple-100 text-purple-600" :
                                        "bg-pink-100 text-pink-600"
                        )}>
                            {item.type === 'comment' && <MessageSquare className="w-4 h-4" />}
                            {item.type === 'approval' && <div className="w-2 h-2 rounded-full bg-current" />}
                            {item.type === 'insight' && <TrendingUp className="w-4 h-4" />}
                            {item.type === 'like' && <Heart className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-primary">{item.user}</p>
                                <span className="text-xs text-secondary">{item.time}</span>
                            </div>
                            <p className="text-sm text-secondary leading-tight mt-0.5">
                                {item.action} <span className="text-accent hover:underline cursor-pointer">{item.target}</span>
                            </p>
                            {item.content && (
                                <div className="mt-2 text-sm text-primary bg-background p-2 rounded-md border border-border">
                                    "{item.content}"
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-border bg-gray-50/50">
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-border rounded-lg text-sm font-medium text-primary hover:bg-gray-50 transition-colors shadow-sm">
                        <MessageSquare className="w-4 h-4 text-secondary" />
                        Reply
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-border rounded-lg text-sm font-medium text-primary hover:bg-gray-50 transition-colors shadow-sm">
                        <MoreHorizontal className="w-4 h-4 text-secondary" />
                        More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackLoop;
