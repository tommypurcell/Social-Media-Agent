
import { motion } from 'framer-motion';
import { Play, Heart, MessageCircle, Share2, Music2 } from 'lucide-react';

const videos = [
    { id: 1, type: 'video', src: '/assets/videos/dance.mp4', category: 'Dance', views: '1.2M' },
    { id: 2, type: 'video', src: '/assets/videos/art.mp4', category: 'Art', views: '850K' },
    { id: 3, type: 'video', src: '/assets/videos/science.mp4', category: 'Science', views: '2.4M' },
    { id: 4, type: 'video', src: '/assets/videos/kids.mp4', category: 'Kids', views: '3.1M' },
    { id: 5, type: 'video', src: '/assets/videos/travel.mp4', category: 'Travel', views: '980K' },
];

// Duplicate for marquee effect
const marqueeVideos = [...videos, ...videos, ...videos];

const VideoCard = ({ video }: { video: typeof videos[0] }) => (
    <div className="relative w-[280px] h-[500px] bg-slate-900 rounded-3xl overflow-hidden mx-4 flex-shrink-0 border border-slate-800 shadow-2xl group cursor-pointer transform hover:scale-[1.02] transition-all duration-300">
        {/* Real HTML Video Element */}
        <video
            src={video.src}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
        />

        {/* Persistent Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-input from-black/10 via-transparent to-black/90 pointer-events-none" />

        {/* UI Controls - Always Visible */}
        <div className="absolute inset-y-0 right-4 flex flex-col justify-end pb-8 gap-6 items-center z-10">
            <div className="w-10 h-10 bg-slate-800/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <div className="w-8 h-8 rounded-full border border-white/50 bg-white/10" />
            </div>
            <div className="flex flex-col items-center gap-1">
                <Heart className="w-8 h-8 text-white fill-white drop-shadow-md" />
                <span className="text-xs font-bold text-white drop-shadow-md">{video.views}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <MessageCircle className="w-7 h-7 text-white drop-shadow-md" />
                <span className="text-xs font-bold text-white drop-shadow-md">842</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <Share2 className="w-7 h-7 text-white drop-shadow-md" />
                <span className="text-xs font-bold text-white drop-shadow-md">Share</span>
            </div>
            <div className="w-10 h-10 bg-slate-800/80 rounded-full flex items-center justify-center animate-spin-slow border border-white/20">
                <Music2 className="w-5 h-5 text-white" />
            </div>
        </div>

        {/* Content Info - Always Visible with Higher Contrast */}
        <div className="absolute bottom-6 left-4 right-16 text-white text-left z-10">
            <div className="flex items-center gap-2 mb-2">
                <div className="px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {video.category}
                </div>
            </div>
            <p className="text-sm font-semibold leading-tight drop-shadow-lg line-clamp-2 text-white/95">
                Viral {video.category.toLowerCase()} content generated in seconds. <span className="font-bold text-indigo-300">#AI</span> <span className="font-bold text-indigo-300">#Feedie</span>
            </p>
            <div className="flex items-center gap-2 mt-3 opacity-90">
                <Music2 className="w-3 h-3 text-indigo-300" />
                <span className="text-xs font-medium">Original Sound - Feedie AI</span>
            </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                <Play className="w-8 h-8 text-white fill-white" />
            </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
            <div className="h-full bg-indigo-500 w-2/3" />
        </div>
    </div>
);

export const VideoMarquee = () => {
    return (
        <div className="w-full overflow-hidden py-12">
            <div className="flex marquee-scroll">
                <motion.div
                    className="flex"
                    animate={{ x: [0, -2000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 80 // Doubled duration for simpler/slower scroll
                    }}
                >
                    {marqueeVideos.map((video, index) => (
                        <VideoCard key={`${video.id}-${index}`} video={video} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
