import { useState } from 'react';
import { Plus, Trash2, Check, Instagram, Twitter, Linkedin, Video } from 'lucide-react';
import { cn } from '../lib/utils';

const Settings = () => {
    const [groups] = useState([
        {
            id: 1,
            name: 'Brand A (EcoWear)',
            accounts: [
                { platform: 'Instagram', connected: true, handle: '@ecowear_official' },
                { platform: 'TikTok', connected: true, handle: '@ecowear_tiktok' },
                { platform: 'X', connected: false, handle: '' },
            ]
        },
        {
            id: 2,
            name: 'Brand B (TechDaily)',
            accounts: [
                { platform: 'Instagram', connected: false, handle: '' },
                { platform: 'YouTube Shorts', connected: true, handle: '@techdaily_shorts' },
                { platform: 'LinkedIn', connected: true, handle: 'Tech Daily Inc.' },
            ]
        }
    ]);

    const PlatformIcon = ({ name }: { name: string }) => {
        switch (name) {
            case 'Instagram': return <Instagram className="w-5 h-5 text-pink-600" />;
            case 'X': return <Twitter className="w-5 h-5 text-black" />;
            case 'LinkedIn': return <Linkedin className="w-5 h-5 text-blue-700" />;
            case 'TikTok': return <Video className="w-5 h-5 text-black" />; // Generic for now
            default: return <Video className="w-5 h-5 text-gray-600" />;
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-background p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Settings & Accounts</h1>
                <p className="text-secondary">Manage your brand groups and social connections.</p>
            </div>

            <div className="space-y-8 max-w-4xl">
                {/* Account Groups */}
                {groups.map((group) => (
                    <div key={group.id} className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                        <div className="px-6 py-4 border-b border-border bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-primary">{group.name}</h3>
                            <button className="text-secondary hover:text-red-500 transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {group.accounts.map((account, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <PlatformIcon name={account.platform} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-primary">{account.platform}</p>
                                            <p className="text-sm text-secondary">
                                                {account.connected ? (
                                                    <span className="text-green-600 flex items-center gap-1">
                                                        <Check className="w-3 h-3" /> Connected as {account.handle}
                                                    </span>
                                                ) : (
                                                    'Not connected'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            account.connected
                                                ? "bg-white border border-border text-secondary hover:bg-gray-50"
                                                : "bg-primary text-white hover:bg-primary/90"
                                        )}
                                    >
                                        {account.connected ? 'Disconnect' : 'Connect'}
                                    </button>
                                </div>
                            ))}

                            <button className="w-full py-3 border-2 border-dashed border-border rounded-lg text-secondary hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 font-medium">
                                <Plus className="w-4 h-4" />
                                Add Platform
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Group */}
                <button className="w-full py-4 bg-surface border border-border shadow-sm rounded-xl text-primary font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Brand Group
                </button>
            </div>
        </div>
    );
};

export default Settings;
