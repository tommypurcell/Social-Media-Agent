// Secure token storage for social media platform credentials

export interface PlatformTokens {
  accessToken: string;
  expiresAt: number;
  userId: string;
  username?: string;
  profilePicture?: string;
  longLivedToken?: string;
}

export interface StoredTokens {
  instagram?: PlatformTokens;
  threads?: PlatformTokens;
  facebook?: PlatformTokens;
}

const STORAGE_KEY = 'social_media_tokens';

class TokenStorage {
  // private encryptionKey = 'feedie-v1'; // In production, use proper encryption

  // Store tokens for a platform
  setTokens(platform: keyof StoredTokens, tokens: PlatformTokens): void {
    const allTokens = this.getAllTokens();
    allTokens[platform] = tokens;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTokens));
  }

  // Get tokens for a specific platform
  getTokens(platform: keyof StoredTokens): PlatformTokens | null {
    const allTokens = this.getAllTokens();
    const tokens = allTokens[platform];

    if (!tokens) return null;

    // Check if token is expired
    if (tokens.expiresAt && Date.now() > tokens.expiresAt) {
      this.removeTokens(platform);
      return null;
    }

    return tokens;
  }

  // Get all stored tokens
  getAllTokens(): StoredTokens {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }

  // Remove tokens for a platform
  removeTokens(platform: keyof StoredTokens): void {
    const allTokens = this.getAllTokens();
    delete allTokens[platform];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTokens));
  }

  // Check if a platform is connected
  isConnected(platform: keyof StoredTokens): boolean {
    return this.getTokens(platform) !== null;
  }

  // Get access token for a platform
  getAccessToken(platform: keyof StoredTokens): string | null {
    const tokens = this.getTokens(platform);
    return tokens?.accessToken || null;
  }

  // Clear all tokens
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Get connected platforms
  getConnectedPlatforms(): Array<keyof StoredTokens> {
    const allTokens = this.getAllTokens();
    return Object.keys(allTokens).filter(
      (platform) => this.isConnected(platform as keyof StoredTokens)
    ) as Array<keyof StoredTokens>;
  }
}

export const tokenStorage = new TokenStorage();
