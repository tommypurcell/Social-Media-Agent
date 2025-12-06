import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { metaAuth } from '../services/metaAuth';
import { instagramApi } from '../services/instagramApi';
import { threadsApi } from '../services/threadsApi';

interface AccountInfo {
  username?: string;
  followers_count?: number;
  [key: string]: unknown;
}

interface PlatformConnection {
  id: 'instagram' | 'threads';
  name: string;
  icon: string;
  color: string;
  description: string;
  isConnected: boolean;
  accountInfo?: AccountInfo | null;
}

const Settings = () => {
  const [platforms, setPlatforms] = useState<PlatformConnection[]>([
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'IG',
      color: 'from-purple-600 via-pink-600 to-orange-500',
      description: 'Connect your Instagram Business account to post content',
      isConnected: false,
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: '@',
      color: 'from-black to-gray-800',
      description: 'Connect your Threads account to post and engage',
      isConnected: false,
    },
  ]);

  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkConnections = useCallback(async () => {
    // Define the list of platform IDs to check, independent of the 'platforms' state
    const ids: ('instagram' | 'threads')[] = ['instagram', 'threads'];

    const results = await Promise.all(ids.map(async id => {
      const isConnected = metaAuth.isConnected(id);
      let accountInfo: AccountInfo | null = null;
      if (isConnected) {
        try {
          if (id === 'instagram') accountInfo = await instagramApi.getAccountInfo() as AccountInfo;
          else accountInfo = await threadsApi.getProfile() as AccountInfo;
        } catch (err) {
          console.error(`Error fetching ${id} account info: `, err);
        }
      }
      return { id, isConnected, accountInfo };
    }));

    setPlatforms(prev => prev.map(p => {
      const res = results.find(r => r.id === p.id);
      return res ? { ...p, ...res } : p;
    }));
  }, []); // Empty dependency array because 'ids' is internal and 'setPlatforms' is stable

  // Check connection status on mount
  useEffect(() => {
    checkConnections();
  }, [checkConnections]);

  const handleConnect = async (platformId: 'instagram' | 'threads') => {
    try {
      setLoading(platformId);
      setError(null);

      const authUrl =
        platformId === 'instagram'
          ? metaAuth.getInstagramAuthUrl()
          : metaAuth.getThreadsAuthUrl();

      // Open OAuth window
      window.location.href = authUrl;
    } catch (err: unknown) {
      console.error('Connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect account';
      setError(errorMessage);
      setLoading(null);
    }
  };

  const handleDisconnect = async (platformId: 'instagram' | 'threads') => {
    if (!confirm(`Are you sure you want to disconnect ${platformId}?`)) {
      return;
    }

    try {
      setLoading(platformId);
      metaAuth.disconnect(platformId);
      await checkConnections();
    } catch (err: unknown) {
      console.error('Disconnect error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect account';
      setError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  const handleRefresh = async (platformId: 'instagram' | 'threads') => {
    try {
      setLoading(platformId);
      setError(null);
      await metaAuth.refreshToken(platformId);
      await checkConnections();
    } catch (err: unknown) {
      console.error('Refresh error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh token';
      setError(errorMessage);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
          <p className="text-secondary">Manage your social media account connections</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-xl font-semibold text-gray-900">Connected Accounts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Connect your social media accounts to enable posting and analytics
            </p>
          </div>

          <div className="divide-y divide-border">
            {platforms.map((platform) => (
              <div key={platform.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w - 14 h - 14 rounded - xl bg - gradient - to - br ${platform.color} flex items - center justify - center text - white font - bold text - xl shadow - lg flex - shrink - 0`}
                    >
                      {platform.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {platform.name}
                        </h3>
                        {platform.isConnected ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            <XCircle className="w-3 h-3" />
                            Not Connected
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{platform.description}</p>

                      {platform.isConnected && platform.accountInfo && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Account Details
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            @{platform.accountInfo.username || 'N/A'}
                          </p>
                          {platform.accountInfo.followers_count && (
                            <p className="text-xs text-gray-600 mt-1">
                              {platform.accountInfo.followers_count.toLocaleString()} followers
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {platform.isConnected ? (
                      <>
                        <button
                          onClick={() => handleRefresh(platform.id)}
                          disabled={loading === platform.id}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Refresh connection"
                        >
                          {loading === platform.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDisconnect(platform.id)}
                          disabled={loading === platform.id}
                          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 border border-red-200"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(platform.id)}
                        disabled={loading === platform.id}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm flex items-center gap-2"
                      >
                        {loading === platform.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            Connect
                            <ExternalLink className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Setup Instructions
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>
                Create a Meta app at{' '}
                <a
                  href="https://developers.facebook.com/apps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900"
                >
                  developers.facebook.com/apps
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Add Instagram Basic Display and/or Threads products to your app</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Configure OAuth redirect URI: <code className="bg-blue-100 px-1 py-0.5 rounded">http://localhost:5173/auth/callback</code></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Add your App ID and App Secret to the <code className="bg-blue-100 px-1 py-0.5 rounded">.env</code> file</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">5.</span>
              <span>Click "Connect" above to authorize your accounts</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Settings;
