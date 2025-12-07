import React, { useState, useEffect, useRef } from 'react';
import { PostDraft, Platform } from '../types';
import { 
  CheckCircle, 
  MessageCircle, 
  Heart, 
  Send, 
  Terminal, 
  Loader2, 
  Play,
  Share2,
  Bookmark,
  MoreHorizontal,
  Battery,
  Wifi,
  Signal,
  Instagram,
  Repeat
} from 'lucide-react';

interface Props {
  posts: PostDraft[];
  onReset: () => void;
}

interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'action' | 'dm';
}

const AgentSimulation: React.FC<Props> = ({ posts, onReset }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({
    postsPublished: 0,
    dmsReplied: 0,
    commentsLiked: 0
  });
  const [currentTask, setCurrentTask] = useState<string>('Initializing Agent...');
  
  // Feed State
  const distinctPlatforms = Array.from(new Set(posts.map(p => p.platform)));
  const [activePlatform, setActivePlatform] = useState<Platform>(distinctPlatforms[0] || 'Instagram');
  
  // Update active platform if it's not in the new list (e.g. on reset/init)
  useEffect(() => {
    if (!distinctPlatforms.includes(activePlatform) && distinctPlatforms.length > 0) {
      setActivePlatform(distinctPlatforms[0]);
    }
  }, [distinctPlatforms, activePlatform]);

  const feedPosts = posts.filter(p => p.platform === activePlatform);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      time: timeString,
      message,
      type
    }].slice(-50)); // Keep last 50 logs
  };

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];

    // Phase 1: Publish the planned posts
    // We group publishing by platform to make logs cleaner
    let delay = 1000;
    
    // Sort posts to publish in order? Or interleave? Let's simply iterate.
    posts.forEach((post, index) => {
      // 1. Preparing
      timeoutIds.push(setTimeout(() => {
        setCurrentTask(`[${post.platform}] Publishing: ${post.topic.substring(0, 15)}...`);
        addLog(`Preparing content for ${post.platform} (ID: ${post.id})...`, 'info');
      }, delay));
      delay += 800; // Faster prep

      // 2. Uploading
      timeoutIds.push(setTimeout(() => {
        addLog(`Uploading media to ${post.platform} servers...`, 'action');
      }, delay));
      delay += 1200;

      // 3. Published
      timeoutIds.push(setTimeout(() => {
        addLog(`✅ Published to ${post.platform}!`, 'success');
        setStats(s => ({ ...s, postsPublished: s.postsPublished + 1 }));
      }, delay));
      delay += 500;
    });

    // Phase 2: Switch to maintenance/engagement mode
    timeoutIds.push(setTimeout(() => {
      setCurrentTask('Monitoring Incoming Interactions...');
      addLog('All scheduled posts active. Switching to listening mode.', 'info');
    }, delay));
    
    // Phase 3: Random events (DMs, Comments)
    const randomEvents = [
      () => {
        const user = ['@sarah_j', '@mike_design', '@creative_daily'][Math.floor(Math.random() * 3)];
        addLog(`📩 Received DM from ${user}: "Love the new post!"`, 'dm');
        setCurrentTask(`Replying to DM from ${user}`);
        setTimeout(() => {
            addLog(`↩️ Auto-replied to ${user}: "Thanks so much! glad you liked it 🙌"`, 'action');
            setStats(s => ({ ...s, dmsReplied: s.dmsReplied + 1 }));
            setCurrentTask('Monitoring Incoming Interactions...');
        }, 1500);
      },
      () => {
        const user = ['@gym_rat', '@travel_guru', '@foodie_life'][Math.floor(Math.random() * 3)];
        addLog(`💬 New comment from ${user} on recent reel`, 'info');
        setTimeout(() => {
            addLog(`❤️ Liked comment by ${user}`, 'action');
            setStats(s => ({ ...s, commentsLiked: s.commentsLiked + 1 }));
        }, 800);
      },
      () => {
        addLog(`📈 Analyzed engagement: +15% reach in last hour`, 'info');
      }
    ];

    const intervalId = setInterval(() => {
      if (delay <= 0) { // Only start random events after posting is done
         const randomAction = randomEvents[Math.floor(Math.random() * randomEvents.length)];
         if (Math.random() > 0.6) randomAction(); // 40% chance of event every tick
      } else {
        delay -= 2000; // Decrement initial delay counter
      }
    }, 2000);

    return () => {
      timeoutIds.forEach(clearTimeout);
      clearInterval(intervalId);
    };
  }, [posts]);

  // Brand colors helper
  const getPlatformColor = (p: Platform) => {
    switch (p) {
      case 'Instagram': return 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
      case 'Tiktok': return 'from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 border border-gray-700';
      case 'Threads': return 'from-black to-gray-900 hover:from-gray-900 hover:to-gray-800 border border-gray-700';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 md:p-8 flex flex-col xl:flex-row gap-8 justify-center items-start">
      
      {/* LEFT COLUMN: Agent Operations */}
      <div className="w-full xl:max-w-2xl space-y-6 flex-1">
        
        {/* Header Status */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-2xl flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="relative">
               <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute top-0 right-0"></div>
               <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                 <Terminal className="w-6 h-6 text-green-400" />
               </div>
             </div>
             <div>
               <h1 className="text-xl font-bold text-white tracking-wider">AGENT ACTIVE</h1>
               <p className="text-gray-400 text-sm flex items-center gap-2">
                 <Loader2 className="w-3 h-3 animate-spin" />
                 {currentTask}
               </p>
             </div>
          </div>
          <button 
            onClick={onReset}
            className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-sm transition-colors text-gray-300"
          >
            Stop Agent
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Posts Live</p>
                <p className="text-2xl font-bold text-white">{stats.postsPublished}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <Send className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">DMs Replied</p>
                <p className="text-2xl font-bold text-white">{stats.dmsReplied}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Comments Liked</p>
                <p className="text-2xl font-bold text-white">{stats.commentsLiked}</p>
              </div>
              <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400">
                <Heart className="w-5 h-5" />
              </div>
            </div>
        </div>

        {/* Terminal / Activity Feed */}
        <div className="bg-black rounded-xl border border-gray-800 p-4 h-[400px] flex flex-col font-mono text-sm relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 w-full bg-gray-800/50 p-2 text-xs text-gray-400 border-b border-gray-700 flex justify-between">
               <span>root@social-agent:~# tail -f activity.log</span>
               <span className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
               </span>
            </div>
            
            <div className="mt-8 flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
               {logs.length === 0 && <div className="text-gray-600 italic">Waiting for process start...</div>}
               {logs.map((log) => (
                 <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <span className="text-gray-600 shrink-0">[{log.time}]</span>
                    <span className={`
                      ${log.type === 'success' ? 'text-green-400' : ''}
                      ${log.type === 'info' ? 'text-blue-300' : ''}
                      ${log.type === 'action' ? 'text-yellow-300' : ''}
                      ${log.type === 'dm' ? 'text-pink-400' : ''}
                    `}>
                      {log.type === 'success' && '✔ '}
                      {log.type === 'action' && '➜ '}
                      {log.message}
                    </span>
                 </div>
               ))}
               <div ref={logsEndRef} />
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Phone / Feed Preview */}
      <div className="w-full md:w-[380px] flex-shrink-0 flex flex-col gap-4 items-center">
        
        {/* Platform Switcher */}
        {distinctPlatforms.length > 0 && (
          <div className="flex bg-gray-800 p-1.5 rounded-xl w-full gap-2">
            {distinctPlatforms.map(p => (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-br ${
                  activePlatform === p 
                    ? getPlatformColor(p) + ' text-white shadow-lg transform scale-105' 
                    : 'bg-transparent text-gray-400 hover:bg-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Mobile Mockup */}
        <div className="relative w-[360px] h-[720px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="h-8 bg-black w-full flex justify-between items-center px-6 pt-2 text-white text-[10px] z-10">
             <span>9:41</span>
             <div className="flex gap-1.5 items-center">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-4 h-4" />
             </div>
          </div>

          {/* App Header */}
          <div className="h-14 bg-black/90 backdrop-blur-md text-white flex items-center justify-between px-4 border-b border-gray-800 sticky top-0 z-10">
            <span className="font-bold text-lg tracking-tight">
              {activePlatform === 'Instagram' ? 'Instagram' : activePlatform === 'Tiktok' ? 'TikTok' : 'Threads'}
            </span>
            <div className="flex gap-4">
              {activePlatform === 'Tiktok' ? (
                <MessageCircle className="w-6 h-6" />
              ) : (
                <>
                  <Heart className="w-6 h-6" />
                  <MessageCircle className="w-6 h-6" />
                </>
              )}
            </div>
          </div>

          {/* Feed Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide bg-black text-white pb-20">
            {feedPosts.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No posts scheduled for {activePlatform}</p>
               </div>
            ) : (
              feedPosts.map((post, idx) => (
                <div key={post.id} className="mb-6 border-b border-gray-800 pb-4">
                   {/* Post Header */}
                   <div className="flex items-center justify-between px-3 py-3">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                           <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
                             AI
                           </div>
                         </div>
                         <span className="text-sm font-semibold">social_agent_ai</span>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-gray-400" />
                   </div>

                   {/* Media */}
                   <div className="w-full bg-gray-900 aspect-square flex items-center justify-center overflow-hidden">
                      {/* Only show content if it has been "published" (based on stats count vs index)
                          But since indices are reused across platforms, we need a better check.
                          Simple hack: just check if stats.postsPublished > total index across all.
                          Actually, let's just show it if active.
                       */}
                      {post.mediaType === 'video' ? (
                        <div className="relative w-full h-full bg-black">
                            <video src={post.imageUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">
                                <Play className="w-3 h-3 fill-white text-white" />
                            </div>
                        </div>
                      ) : (
                        <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
                      )}
                   </div>

                   {/* Actions */}
                   <div className="px-3 pt-3 flex justify-between items-center">
                      <div className="flex gap-4">
                         <Heart className={`w-6 h-6 ${stats.commentsLiked > 0 && Math.random() > 0.5 ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                         <MessageCircle className="w-6 h-6 text-white" />
                         <Send className="w-6 h-6 text-white -rotate-45 mb-1" />
                      </div>
                      <Bookmark className="w-6 h-6 text-white" />
                   </div>

                   {/* Likes */}
                   <div className="px-3 py-2 text-sm font-semibold">
                      {Math.floor(Math.random() * 50) + 5} likes
                   </div>

                   {/* Caption */}
                   <div className="px-3 text-sm">
                      <span className="font-semibold mr-2">social_agent_ai</span>
                      <span className="text-gray-100">{post.generatedCaption}</span>
                      <div className="mt-1 text-blue-400">
                         {post.hashtags.map((h, i) => (
                           <span key={i} className="mr-1">{h.startsWith('#') ? h : `#${h}`}</span>
                         ))}
                      </div>
                   </div>
                   
                   <div className="px-3 mt-2 text-xs text-gray-500 uppercase">
                      Just now
                   </div>
                </div>
              ))
            )}
            
            {/* End of Feed */}
            <div className="py-10 text-center text-gray-600 text-xs flex flex-col items-center">
               <CheckCircle className="w-8 h-8 mb-2 text-gray-700" />
               You're all caught up
            </div>
          </div>

           {/* Bottom Nav Bar */}
           <div className="h-16 bg-black border-t border-gray-800 flex justify-around items-center px-2 z-10">
               <div className="p-2"><div className="w-6 h-6 rounded bg-gray-600" /></div> {/* Home */}
               <div className="p-2"><div className="w-6 h-6 rounded bg-gray-800" /></div> {/* Search */}
               <div className="p-2"><div className="w-8 h-8 rounded-lg border-2 border-white bg-black" /></div> {/* New */}
               <div className="p-2"><div className="w-6 h-6 rounded bg-gray-800" /></div> {/* Reels */}
               <div className="p-2"><div className="w-6 h-6 rounded-full bg-gray-600" /></div> {/* Profile */}
           </div>
           
           {/* Home Indicator */}
           <div className="h-1 w-1/3 bg-gray-700 rounded-full mx-auto mb-2 opacity-50"></div>

        </div>
      </div>

    </div>
  );
};

export default AgentSimulation;