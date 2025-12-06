import { tokenStorage, type PlatformTokens } from './tokenStorage';

const META_APP_ID = import.meta.env.VITE_META_APP_ID;
const REDIRECT_URI = import.meta.env.VITE_META_REDIRECT_URI;
const GRAPH_API_BASE = import.meta.env.VITE_META_GRAPH_API_BASE_URL;
const GRAPH_API_VERSION = import.meta.env.VITE_META_GRAPH_API_VERSION;

export class MetaAuthService {
  // Instagram OAuth URL - Using minimal required scopes
  getInstagramAuthUrl(): string {
    // Start with basic permissions that work in development mode
    // You can add more scopes after the app is configured
    const scope = [
      'public_profile',               // Basic Facebook profile (always available)
      'email',                        // Email address (always available)
    ].join(',');

    const params = new URLSearchParams({
      client_id: META_APP_ID,
      redirect_uri: REDIRECT_URI,
      scope: scope,
      response_type: 'code',
      state: 'instagram',
    });

    return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?${params.toString()}`;
  }

  // Threads OAuth URL - Using minimal required scopes
  getThreadsAuthUrl(): string {
    // Start with basic permissions that work in development mode
    const scope = [
      'public_profile',               // Basic Facebook profile (always available)
      'email',                        // Email address (always available)
    ].join(',');

    const params = new URLSearchParams({
      client_id: META_APP_ID,
      redirect_uri: REDIRECT_URI,
      scope: scope,
      response_type: 'code',
      state: 'threads',
    });

    return `https://www.facebook.com/${GRAPH_API_VERSION}/dialog/oauth?${params.toString()}`;
  }

  // Exchange code for access token
  async exchangeCodeForToken(code: string, platform: 'instagram' | 'threads'): Promise<PlatformTokens> {
    try {
      // Note: This requires a backend endpoint for security
      // Never expose app secret in frontend code
      const response = await fetch(`${GRAPH_API_BASE}/${GRAPH_API_VERSION}/oauth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: META_APP_ID,
          redirect_uri: REDIRECT_URI,
          code: code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();

      // Get long-lived token (60 days)
      const longLivedToken = await this.getLongLivedToken(data.access_token);

      // Get user profile
      const profile = await this.getUserProfile(longLivedToken.access_token, platform);

      const tokens: PlatformTokens = {
        accessToken: longLivedToken.access_token,
        expiresAt: Date.now() + longLivedToken.expires_in * 1000,
        userId: profile.id as string,
        username: profile.username as string,
        profilePicture: profile.profile_picture_url as string,
        longLivedToken: longLivedToken.access_token,
      };

      tokenStorage.setTokens(platform, tokens);

      return tokens;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Get long-lived token (60 days)
  private async getLongLivedToken(shortLivedToken: string): Promise<{ access_token: string; expires_in: number }> {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: META_APP_ID,
      fb_exchange_token: shortLivedToken,
    });

    const response = await fetch(`${GRAPH_API_BASE}/${GRAPH_API_VERSION}/oauth/access_token?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to get long-lived token');
    }

    return response.json();
  }

  // Get user profile
  private async getUserProfile(accessToken: string, platform: 'instagram' | 'threads'): Promise<Record<string, unknown>> {
    const fields = platform === 'instagram'
      ? 'id,username,account_type,media_count'
      : 'id,username,threads_profile_picture_url,threads_biography';

    const params = new URLSearchParams({
      fields: fields,
      access_token: accessToken,
    });

    const endpoint = platform === 'instagram' ? 'me' : 'me/threads_profile';
    const response = await fetch(`${GRAPH_API_BASE}/${GRAPH_API_VERSION}/${endpoint}?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    return response.json();
  }

  // Refresh token before expiration
  async refreshToken(platform: 'instagram' | 'threads'): Promise<void> {
    const tokens = tokenStorage.getTokens(platform);
    if (!tokens) {
      throw new Error('No tokens found for platform');
    }

    try {
      const newToken = await this.getLongLivedToken(tokens.accessToken);

      const updatedTokens: PlatformTokens = {
        ...tokens,
        accessToken: newToken.access_token,
        expiresAt: Date.now() + newToken.expires_in * 1000,
      };

      tokenStorage.setTokens(platform, updatedTokens);
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Disconnect platform
  disconnect(platform: 'instagram' | 'threads'): void {
    tokenStorage.removeTokens(platform);
  }

  // Check if platform is connected
  isConnected(platform: 'instagram' | 'threads'): boolean {
    return tokenStorage.isConnected(platform);
  }
}

export const metaAuth = new MetaAuthService();
