import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, CheckCircle2, Circle, ArrowRight, Sparkles, Eye, Heart, Share2 } from 'lucide-react';

interface BranchNode {
    id: string;
    parentId?: string;
    name: string;
    caption: string;
    mediaUrl?: string;
    platform: string;
    isSelected: boolean;
    depth: number;
    children: BranchNode[];
}

const ContentBranches = () => {
    const navigate = useNavigate();

    // Mock data - in real app this would come from workflow state
    const [branches, setBranches] = useState<BranchNode[]>([
        {
            id: '1',
            name: 'Original',
            caption: 'Morning coffee vibes ☕✨',
            mediaUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
            platform: 'instagram',
            isSelected: true,
            depth: 0,
            children: [
                {
                    id: '1a',
                    parentId: '1',
                    name: 'Variant A',
                    caption: 'Start your day right with the perfect brew ☕',
                    mediaUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
                    platform: 'instagram',
                    isSelected: false,
                    depth: 1,
                    children: []
                },
                {
                    id: '1b',
                    parentId: '1',
                    name: 'Variant B',
                    caption: 'Coffee is always a good idea ☕💫',
                    mediaUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
                    platform: 'tiktok',
                    isSelected: false,
                    depth: 1,
                    children: [
                        {
                            id: '1b1',
                            parentId: '1b',
                            name: 'Remix 1',
                            caption: 'But first, coffee ☕',
                            mediaUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
                            platform: 'tiktok',
                            isSelected: false,
                            depth: 2,
                            children: []
                        }
                    ]
                },
                {
                    id: '1c',
                    parentId: '1',
                    name: 'Variant C',
                    caption: 'Morning rituals 🌅☕',
                    mediaUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
                    platform: 'threads',
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

    const renderBranch = (branch: BranchNode, isLast: boolean = false) => {
        const hasChildren = branch.children.length > 0;
        const selectedCount = countSelected(branch);

        return (
            <div key={branch.id} className="relative">
                {/* Branch Node */}
                <div className={`flex items-start gap-4 mb-4 ${branch.depth > 0 ? 'ml-12' : ''}`}>
                    {/* Connector Line */}
                    {branch.depth > 0 && (
                        <div className="absolute left-6 top-0 w-6 h-6 border-l-2 border-b-2 border-gray-300 rounded-bl-lg" />
                    )}

                    {/* Selection Checkbox */}
                    <button
                        onClick={() => toggleSelection(branch.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            branch.isSelected
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300 hover:border-green-400'
                        }`}
                    >
                        {branch.isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>

                    {/* Branch Card */}
                    <div
                        className={`flex-1 bg-white rounded-xl border-2 transition-all ${
                            branch.isSelected
                                ? 'border-green-400 shadow-lg shadow-green-100'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                {/* Thumbnail */}
                                {branch.mediaUrl && (
                                    <img
                                        src={branch.mediaUrl}
                                        alt={branch.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                )}

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full capitalize">
                                            {branch.platform}
                                        </span>
                                        {branch.depth === 0 && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                Root
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-700 mb-3">{branch.caption}</p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {hasChildren && (
                                            <div className="flex items-center gap-1">
                                                <GitBranch className="w-3.5 h-3.5" />
                                                <span>{branch.children.length} variants</span>
                                            </div>
                                        )}
                                        {selectedCount > 0 && (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>{selectedCount} selected</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Children */}
                {hasChildren && (
                    <div className="relative">
                        {branch.children.map((child, index) =>
                            renderBranch(child, index === branch.children.length - 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    const countSelected = (branch: BranchNode): number => {
        let count = branch.isSelected ? 1 : 0;
        branch.children.forEach(child => {
            count += countSelected(child);
        });
        return count;
    };

    const getTotalSelected = () => {
        return branches.reduce((sum, branch) => sum + countSelected(branch), 0);
    };

    const handlePublish = () => {
        const selected = getTotalSelected();
        alert(`Publishing ${selected} selected variant(s)!`);
        // In real app, navigate to content pipeline with selected branches
        navigate('/contents');
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-purple-50 p-8">
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <GitBranch className="w-8 h-8 text-purple-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Content Branches</h1>
                        </div>
                        <p className="text-gray-600">
                            Explore different versions of your content and select which ones to publish
                        </p>
                    </div>

                    <button
                        onClick={handlePublish}
                        disabled={getTotalSelected() === 0}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200 transition-all flex items-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        Publish {getTotalSelected()} Selected
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <GitBranch className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {branches.reduce((sum, b) => sum + 1 + b.children.length + b.children.reduce((s, c) => s + c.children.length, 0), 0)}
                                </div>
                                <div className="text-xs text-gray-600">Total Variants</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">{getTotalSelected()}</div>
                                <div className="text-xs text-gray-600">Selected</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Eye className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">1</div>
                                <div className="text-xs text-gray-600">Workflows</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Branch Tree */}
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    {branches.map(branch => renderBranch(branch))}
                </div>
            </div>

            {/* Help Text */}
            <div className="max-w-5xl mx-auto mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <GitBranch className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <strong>How it works:</strong> Select the variants you want to publish by clicking the
                        checkboxes. You can choose multiple versions to create A/B tests or publish to different
                        platforms simultaneously.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentBranches;
