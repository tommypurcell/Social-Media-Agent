import { useState } from 'react';
import { Play, Pause, Share2, GitBranch, Video, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import { useParams } from 'react-router-dom';

const Workspace = () => {
    useParams();
    const [selectedVersion, setSelectedVersion] = useState('raw');
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock Graph Data
    const versions = {
        'raw': { label: 'Raw Upload', type: 'root', parent: null, time: '12:30', description: 'Original footage uploaded by user.' },
        'v1': { label: 'First Edit', type: 'branch', parent: 'raw', time: '10:15', description: 'Rough cut, removed silence.' },
        'insta': { label: 'Insta Story', type: 'leaf', parent: 'v1', time: '00:59', description: '9:16 aspect ratio, captions added.' },
        'tiktok': { label: 'TikTok Ver', type: 'leaf', parent: 'v1', time: '01:15', description: 'Trending audio mix, fast paced.' },
        'x': { label: 'X Post', type: 'leaf', parent: 'v1', time: '02:00', description: '16:9, subtitles burned in.' },
    };

    const handleVersionClick = (key: string) => {
        setSelectedVersion(key);
        setIsPlaying(false);
    };

    return (
        <div className="flex flex-col h-full bg-background relative">
            {/* Header Toolbar */}
            <div className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between flex-shrink-0 z-20 shadow-sm">
                <div>
                    <h2 className="font-bold text-lg text-primary">Summer Campaign <span className="text-secondary font-normal mx-2">/</span> {versions[selectedVersion as keyof typeof versions].label}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-secondary hover:text-primary hover:bg-gray-50">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 shadow-sm">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Video Player Area */}
            <div className="flex-grow flex items-center justify-center bg-gray-900 overflow-hidden relative group">
                {/* Mock Video Player */}
                <div className={cn(
                    "bg-black relative shadow-2xl transition-all duration-500",
                    versions[selectedVersion as keyof typeof versions].label.includes('Insta') || versions[selectedVersion as keyof typeof versions].label.includes('TikTok') ? "aspect-[9/16] h-[80%]" : "aspect-video w-[80%]"
                )}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-110"
                        >
                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current translate-x-1" />}
                        </button>
                    </div>
                    {/* Fake Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 group-hover:h-2 transition-all cursor-pointer">
                        <div className="h-full bg-accent w-1/3 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-sm" />
                        </div>
                    </div>
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-xs text-white">
                        <Video className="w-3 h-3 text-accent" />
                        {versions[selectedVersion as keyof typeof versions].time} • {versions[selectedVersion as keyof typeof versions].description}
                    </div>
                </div>
            </div>

            {/* Version Tree / Timeline Graph (Bottom Pane) */}
            <div className="h-64 bg-surface border-t border-border flex flex-col flex-shrink-0">
                <div className="px-6 py-3 border-b border-border flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                        <GitBranch className="w-4 h-4 text-accent" />
                        Version History
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto p-8 relative flex items-center">
                    {/* Connecting Lines (CSS only attempt for simplicity, robust impl requires SVG) */}
                    {/* Root to V1 */}
                    <div className="absolute left-[100px] top-1/2 w-[200px] h-0.5 bg-gray-300 -z-0" />
                    {/* V1 to Branches */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                        {/* V1 is at approx 300px. Insta at 500, TikTok at 650, X at 800 */}
                        {/* Curves */}
                        <path d="M 320 128 C 400 128, 400 64, 520 64" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                        <path d="M 320 128 C 400 128, 400 128, 520 128" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                        <path d="M 320 128 C 400 128, 400 192, 520 192" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                    </svg>

                    {/* Nodes */}
                    <div className="flex items-center gap-32 pl-8 min-w-max">
                        {/* RAW */}
                        <Node
                            label="Raw Upload"
                            isActive={selectedVersion === 'raw'}
                            onClick={() => handleVersionClick('raw')}
                            type="root"
                        />

                        {/* V1 */}
                        <Node
                            label="First Edit"
                            isActive={selectedVersion === 'v1'}
                            onClick={() => handleVersionClick('v1')}
                            type="branch"
                        />

                        {/* Leaves */}
                        <div className="flex flex-col gap-8">
                            <Node
                                label="Insta Story"
                                isActive={selectedVersion === 'insta'}
                                onClick={() => handleVersionClick('insta')}
                                type="leaf"
                                icon="insta"
                            />
                            <Node
                                label="TikTok Ver"
                                isActive={selectedVersion === 'tiktok'}
                                onClick={() => handleVersionClick('tiktok')}
                                type="leaf"
                                icon="tiktok"
                            />
                            <Node
                                label="X Post"
                                isActive={selectedVersion === 'x'}
                                onClick={() => handleVersionClick('x')}
                                type="leaf"
                                icon="x"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Node = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void, type?: string, icon?: string }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative z-10 flex flex-col items-center gap-2 transition-all p-2 rounded-lg",
                isActive ? "scale-105" : "opacity-80 hover:opacity-100 hover:scale-105"
            )}
        >
            <div className={cn(
                "w-4 h-4 rounded-full border-2 bg-surface transition-colors",
                isActive ? "border-accent bg-accent" : "border-gray-400"
            )} />
            <div className={cn(
                "px-3 py-1.5 rounded-full border shadow-sm text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-secondary border-border hover:border-primary hover:text-primary"
            )}>
                {label}
            </div>
        </button>
    )
}

export default Workspace;
