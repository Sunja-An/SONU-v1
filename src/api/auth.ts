import { apiClient } from './client';

export interface DiscordAuthResponse {
  auth_url: string;
}

export interface DiscordCallbackResponse {
  access_token: string;
  user?: {
    id: number;
    username: string;
    discriminator?: string;
    avatar_url?: string;
    nickname?: string;
  };
}

export interface UserProfileResponse {
  id: string | number;
  username: string;
  discriminator?: string;
  avatar_url?: string;
  nickname?: string;
  riot_id?: string;
}

/**
 * Fetches the Discord OAuth2 authorization URL
 */
export async function getDiscordAuthUrl(): Promise<string> {
  const response = await apiClient.get<{ data?: DiscordAuthResponse; auth_url?: string }>('/api/v1/auth/discord');
  const authUrl = response.data?.data?.auth_url || response.data?.auth_url;
  if (!authUrl) {
    throw new Error('Discord auth URL not found in response');
  }
  return authUrl;
}

/**
 * Sends authorization code and state to retrieve JWT
 */
export async function discordCallback(code: string, state: string): Promise<DiscordCallbackResponse> {
  const response = await apiClient.get<{ data?: DiscordCallbackResponse }>(
    '/api/v1/auth/discord/callback',
    {
      params: { code, state },
    }
  );
  
  // Extract from response.data.data or fallback to response.data
  const data = response.data?.data || (response.data as unknown as DiscordCallbackResponse);
  if (!data || !data.access_token) {
    throw new Error('Access token not found in callback response');
  }
  return data;
}

/**
 * Fetches current authenticated user profile
 */
export async function getMe(): Promise<UserProfileResponse> {
  const response = await apiClient.get<{ data?: UserProfileResponse }>('/api/v1/users/me');
  const user = response.data?.data || (response.data as unknown as UserProfileResponse);
  if (!user) {
    throw new Error('User data not found in profile response');
  }
  return user;
}
