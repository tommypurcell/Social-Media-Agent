import { useState } from 'react';
import { GitBranch, Sparkles, Image as ImageIcon, Video, MessageSquare, Hash } from 'lucide-react';

interface BranchNode {
    id: string;
    parentId?: string;
    name: string;
    caption: string;
    mediaUrl?: string;
    platform: 'instagram' | 'tiktok' | 'threads' | 'twitter' | 'linkedin';
    type: 'image' | 'video' | 'text';
    isSelected: boolean;
    depth: number;
    children: BranchNode[];
}

const ContentBranches = () => {
    // Mock data: 10 diverse content items with branches
    const [branches, setBranches] = useState<BranchNode[]>([
        {
            id: '1',
            name: 'Product Launch Teaser',
            caption: 'Something big is coming... 🚀 #NewEra',
            mediaUrl: 'https://images.pexels.com/photos/2528118/pexels-photo-2528118.jpeg?auto=compress&cs=tinysrgb&w=600',
            platform: 'instagram',
            type: 'image',
            isSelected: true,
            depth: 0,
            children: [
                {
                    id: '1a',
                    parentId: '1',
                    name: 'BTS Video Variant',
                    caption: 'Behind the scenes of our secret project 🤫 #BTS',
                    mediaUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600', // Placeholder for video thumb
                    platform: 'tiktok',
                    type: 'video',
                    isSelected: false,
                    depth: 1,
                    children: []
                },
                {
                    id: '1b',
                    parentId: '1',
                    name: 'Cryptic Thread',
                    caption: 'You are not ready for this Tuesday. 💭',
                    platform: 'threads',
                    type: 'text',
                    isSelected: false,
                    depth: 1,
                    children: []
                }
            ]
        },
        {
            id: '2',
            name: 'Monday Motivation',
            caption: 'Discipline chooses what you want most over what you want now. 💪',
            mediaUrl: 'https://images.pexels.com/photos/3755761/pexels-photo-3755761.jpeg?auto=compress&cs=tinysrgb&w=600',
            platform: 'instagram',
            type: 'image',
            isSelected: true,
            depth: 0,
            children: [
                {
                    id: '2a',
                    parentId: '2',
                    name: 'Short Quote Thread',
                    caption: 'Discipline > Motivation.',
                    platform: 'threads',
                    type: 'text',
                    isSelected: true,
                    depth: 1,
                    children: []
                }
            ]
        },
        {
            id: '3',
            name: 'Tech Tip Tuesday',
            caption: '3 shortcuts that will save you hours this week ⚡️',
            mediaUrl: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600',
            platform: 'tiktok',
            type: 'video',
            isSelected: false,
            depth: 0,
            children: [
                {
                    id: '3a',
                    parentId: '3',
                    name: 'Carousel Version',
                    caption: 'Swipe to save time ➡️',
                    mediaUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
                    platform: 'instagram',
                    type: 'image',
                    isSelected: true,
                    depth: 1,
                    children: []
                }
            ]
        },
        {
            id: '4',
            name: 'Customer Spotlight',
            caption: 'Loving how @Sarah uses our dashboard for her agency! ❤️',
            mediaUrl: 'https://images.pexels.com/photos/3184655/pexels-photo-3184655.jpeg?auto=compress&cs=tinysrgb&w=600',
            platform: 'instagram',
            type: 'image',
            isSelected: true,
            depth: 0,
            children: []
        },
        {
            id: '5',
            name: 'Office Tour',
            caption: 'Welcome to our HQ! Where the magic happens ✨',
            mediaUrl: 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=600',
            platform: 'tiktok',
            type: 'video',
            isSelected: true,
            depth: 0,
            children: [
                {
                    id: '5a',
                    parentId: '5',
                    name: 'Photo Dump',
                    caption: 'Office aesthetics 🌿🖥️',
                    mediaUrl: 'https://images.pexels.com/photos/7070/space-desk-workspace-coworking.jpg?auto=compress&cs=tinysrgb&w=600',
                    platform: 'instagram',
                    type: 'image',
                    isSelected: false,
                    depth: 1,
                    children: []
                }
            ]
        },
        {
            id: '6',
            name: 'Flash Sale Alert',
            caption: '24 HOURS ONLY. 50% OFF. GO! 🚨',
            platform: 'twitter',
            type: 'text',
            isSelected: false,
            depth: 0,
            children: [
                {
                    id: '6a',
                    parentId: '6',
                    name: 'Urgency Reel',
                    caption: 'Do not miss this! ⏰',
                    mediaUrl: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=600',
                    platform: 'instagram',
                    type: 'video',
                    isSelected: true,
                    depth: 1,
                    children: []
                }
            ]
        },
        {
            id: '7',
            name: 'Industry News',
            caption: 'AI usage in marketing has doubled in 2024. Here is what that means for you.',
            platform: 'linkedin',
            type: 'text',
            isSelected: true,
            depth: 0,
            children: [
                {
                    id: '7a',
                    parentId: '7',
                    name: 'Visual Chart',
                    caption: 'The stats speak for themselves 📈',
                    mediaUrl: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600',
                    platform: 'instagram',
                    type: 'image',
                    isSelected: false,
                    depth: 1,
                    children: []
                }
            ]
        },
        {
            id: '8',
            name: 'Employee Spotlight',
            caption: 'Meet Alex, our lead designer! 🎨',
            mediaUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
            platform: 'instagram',
            type: 'image',
            isSelected: true,
            depth: 0,
            children: []
        },
        {
            id: '9',
            name: 'Weekend Vibes',
            caption: 'Logging off. See you Monday! ✌️',
            mediaUrl: 'https://images.pexels.com/photos/1054974/pexels-photo-1054974.jpeg?auto=compress&cs=tinysrgb&w=600',
            platform: 'instagram',
            type: 'image',
            isSelected: true,
            depth: 0,
            children: [
                {
                    id: '9a',
                    parentId: '9',
                    name: 'Casual Check-in',
                    caption: 'Any fun weekend plans? 👇',
                    platform: 'threads',
                    type: 'text',
                    isSelected: false,
                    depth: 1,
                    children: []
                }
            ]
        },
        {
            id: '10',
            name: 'Educational Deep Dive',
            caption: 'How to build your personal brand in 5 steps. A thread. 🧵',
            platform: 'threads',
            type: 'text',
            isSelected: true,
            depth: 0,
            children: [
                {
                    id: '10a',
                    parentId: '10',
                    name: 'Talking Head Video',
                    caption: 'Personal branding 101 🧠',
                    mediaUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
                    platform: 'tiktok',
                    type: 'video',
                    isSelected: true,
                    depth: 1,
                    children: []
                }
            ]
        }
    ]);

    const toggleSelection = (branchId: string) => {
        const updateBranches = (nodes: BranchNode[]): BranchNode[] => {
            return nodes.map(node => {
                if (node.id === branchId) {
                    return { ...node, isSelected: !node.isSelected };
                }
                return { ...node, children: updateBranches(node.children) };
            });
        };
        setBranches(updateBranches(branches));
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'instagram': return <div className="p-1 rounded bg-pink-100 text-pink-600"><ImageIcon size={14} /></div>;
            case 'tiktok': return <div className="p-1 rounded bg-black/10 text-black"><Video size={14} /></div>;
            case 'threads': return <div className="p-1 rounded bg-gray-100 text-gray-600"><Hash size={14} /></div>;
            case 'twitter': return <div className="p-1 rounded bg-blue-100 text-blue-500"><MessageSquare size={14} /></div>;
            case 'linkedin': return <div className="p-1 rounded bg-blue-100 text-blue-700"><ImageIcon size={14} /></div>;
            default: return <div className="p-1 rounded bg-gray-100 text-gray-500"><Sparkles size={14} /></div>;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video size={16} className="text-slate-500" />;
            case 'image': return <ImageIcon size={16} className="text-slate-500" />;
            default: return <MessageSquare size={16} className="text-slate-500" />;
        }
    };

    const renderBranch = (branch: BranchNode) => {
        const hasChildren = branch.children.length > 0;

        return (
            <div key={branch.id} className="relative group">
                {/* Branch Node */}
                <div className={`flex items-start gap-4 mb-6 ${branch.depth > 0 ? 'ml-12' : ''}`}>
                    {/* Connector Lines */}
                    {branch.depth > 0 && (
                        <div className="absolute left-[38px] -top-8 w-6 h-[calc(100%+32px)] -z-10 border-l-2 border-gray-200" />
                    )}
                    {branch.depth > 0 && (
                        <div className="absolute left-[38px] top-6 w-8 h-6 border-b-2 border-l-2 border-gray-200 rounded-bl-xl -z-10" />
                    )}

                    {/* Checkbox (Visual Selector only) */}
                    <button
                        onClick={() => toggleSelection(branch.id)}
                        className={`mt-4 w-5 h-5 rounded border transition-colors flex items-center justify-center
                            ${branch.isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                        {branch.isSelected && <Sparkles size={12} className="text-white" />}
                    </button>


                    {/* Branch Card */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="flex">
                            {/* Media Thumbnail (if exists) */}
                            {branch.mediaUrl ? (
                                <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
                                    <img src={branch.mediaUrl} alt={branch.name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-gradient-to-br from-indigo-50 to-slate-50 flex items-center justify-center flex-shrink-0 border-r border-gray-100">
                                    <MessageSquare className="w-8 h-8 text-indigo-200" />
                                </div>
                            )}

                            <div className="p-4 flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    {getPlatformIcon(branch.platform)}
                                    <span className="text-sm font-semibold text-gray-900 truncate">{branch.name}</span>
                                    {branch.depth === 0 && (
                                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded">Root</span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{branch.caption}</p>

                                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        {getTypeIcon(branch.type)}
                                        <span className="capitalize">{branch.type}</span>
                                    </div>
                                    {hasChildren && (
                                        <div className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                            <GitBranch size={12} />
                                            {branch.children.length} variants
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Children */}
                {hasChildren && (
                    <div className="relative">
                        {branch.children.map((child) => renderBranch(child))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
            <div className="max-w-4xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <GitBranch className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Content Pipeline</h1>
                        <p className="text-gray-500">Review and select generated content variants</p>
                    </div>
                </div>

                {/* Main List */}
                <div className="space-y-2">
                    {branches.map(branch => renderBranch(branch))}
                </div>
            </div>
        </div>
    );
};

export default ContentBranches;
