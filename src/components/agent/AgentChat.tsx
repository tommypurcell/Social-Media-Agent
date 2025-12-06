import { useState, useRef, useEffect } from 'react';
import { useAgentContext } from '../../lib/AgentContext';
import { Send, Bot, User, Terminal, Sparkles, Settings2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AgentChat = () => {
    const { state, sendChatMessage } = useAgentContext();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [state.chatHistory]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Pass context about screen if needed, or just send content
        // ideally we might prepend "Context: [Current Screen]" but let's keep it simple for user feel
        sendChatMessage(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface border-l border-border w-80 shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-border bg-surface/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-primary">Agent Interface</h2>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${state.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            <p className="text-xs text-secondary">
                                {state.isActive ? 'Active - Autonomous' : 'Standby'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Info Bar */}
            <div className="px-4 py-2 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-2 text-xs text-indigo-700">
                <Terminal className="w-3 h-3" />
                <span className="truncate">Context: {location.pathname.replace('/', '') || 'dashboard'}</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {state.chatHistory && state.chatHistory.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                ? 'bg-gray-200 text-gray-600'
                                : 'bg-indigo-100 text-indigo-600'
                            }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-white border border-border text-primary rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Simulated Typing Indicator (could be real state trigger) */}
                {/* Ideally we check if last message was user and it's been < 1s */}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-white">
                <div className="relative">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Direct the agent..."
                        rows={1}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none min-h-[44px] max-h-32"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex justify-between items-center mt-2 px-1">
                    <button className="text-xs text-secondary hover:text-indigo-600 flex items-center gap-1 transition-colors">
                        <Settings2 className="w-3 h-3" />
                        Configure Policy
                    </button>
                    <button className="text-xs text-secondary hover:text-purple-600 flex items-center gap-1 transition-colors">
                        <Sparkles className="w-3 h-3" />
                        Auto-Suggestions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentChat;
