import type { Message } from '../lib/types';
import { Mail, User, Bot } from 'lucide-react';

interface InboxProps {
    messages: Message[];
}

export function Inbox({ messages }: InboxProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <Mail className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">Direct Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-10">No messages yet.</div>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.isFromAgent ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isFromAgent ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'}`}>
                            {msg.isFromAgent ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>

                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.isFromAgent
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                            }`}>
                            <p>{msg.content}</p>
                            <span className={`text-[10px] mt-1 block opacity-70 ${msg.isFromAgent ? 'text-indigo-100' : 'text-gray-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
