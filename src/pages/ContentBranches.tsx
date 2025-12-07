import { useState, useMemo } from 'react';
import { GitBranch, Sparkles, Image as ImageIcon, Video, MessageSquare, Hash } from 'lucide-react';
import { useAgentContext } from '../lib/AgentContext';
import { generateBranchesForContent } from '../lib/utils';
import type { ContentBranch } from '../lib/types';

interface BranchNode extends Omit<ContentBranch, 'platform'> {
    platform: 'instagram' | 'tiktok' | 'threads' | 'twitter' | 'linkedin'; // extended platform types
    type: 'image' | 'video' | 'text';
    children: BranchNode[];
    depth: number;
}

const ContentBranches = () => {
    const { state } = useAgentContext();

    // Transform AgentContext tasks into BranchNodes
    const branches = useMemo(() => {
        const contentTasks = state.tasks.filter(t =>
            ['post_content', 'plan_content', 'generate_media'].includes(t.type)
        );

        if (contentTasks.length === 0) return [];

        const allTrees: BranchNode[] = [];

        contentTasks.forEach(task => {
            const flatBranches = generateBranchesForContent(task, task.metadata);

            // Map to BranchNode structure
            const nodeMap = new Map<string, BranchNode>();

            // First pass: create nodes
            flatBranches.forEach(b => {
                nodeMap.set(b.id, {
                    ...b,
                    platform: b.platform as any,
                    type: b.postType === 'reel' ? 'video' : 'image', // simplified mapping
                    children: [],
                    depth: 0 // temporary
                });
            });

            // Second pass: build hierarchy
            flatBranches.forEach(b => {
                const node = nodeMap.get(b.id)!;
                if (b.parentId && nodeMap.has(b.parentId)) {
                    const parent = nodeMap.get(b.parentId)!;
                    parent.children.push(node);
                } else if (!b.parentId) {
                    allTrees.push(node);
                }
            });
        });

        // Helper to set depth recursively
        const setDepth = (node: BranchNode, d: number) => {
            node.depth = d;
            node.children.forEach(c => setDepth(c, d + 1));
        };

        allTrees.forEach(root => setDepth(root, 0));
        return allTrees;

    }, [state.tasks]);

    // Local state to handle branch toggling (visual only since we don't persist selection back to context yet in this view)
    // In a real app, this would dispatch an action to update the task/post metadata
    const [localSelections, setLocalSelections] = useState<Set<string>>(new Set());

    const toggleSelection = (branchId: string) => {
        setLocalSelections(prev => {
            const next = new Set(prev);
            if (next.has(branchId)) next.delete(branchId);
            else next.add(branchId);
            return next;
        });
    };

    const isSelected = (branch: BranchNode) => {
        // Fallback to local state if tracking changes, otherwise default to branch.isSelected
        return localSelections.has(branch.id) || (localSelections.size === 0 && branch.isSelected);
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
        const selected = isSelected(branch);

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
                            ${selected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-gray-400'}`}
                    >
                        {selected && <Sparkles size={12} className="text-white" />}
                    </button>


                    {/* Branch Card */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="flex">
                            {/* Media Thumbnail/Player */}
                            {branch.mediaUrl ? (
                                <div className="w-32 h-32 bg-gray-900 flex-shrink-0 relative group/media">
                                    {branch.type === 'video' ? (
                                        <div className="w-full h-full relative">
                                            <video
                                                src={branch.mediaUrl}
                                                className="w-full h-full object-cover"
                                                muted
                                                loop
                                                playsInline
                                                onMouseOver={(e) => e.currentTarget.play()}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.pause();
                                                    e.currentTarget.currentTime = 0;
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover/media:opacity-0 transition-opacity">
                                                <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                                                    <Video className="w-4 h-4 text-white" fill="white" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={branch.mediaUrl} alt={branch.name} className="w-full h-full object-cover" />
                                    )}
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
                    {branches.length > 0 ? (
                        branches.map(branch => renderBranch(branch))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                            <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">No content branches found</h3>
                            <p className="text-gray-500 mt-2">Create a workflow in the Planner to see content variations here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentBranches;
