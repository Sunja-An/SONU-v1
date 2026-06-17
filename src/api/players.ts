import { apiClient } from './client';

export interface PlayerProfileRequest {
  nickname: string;
  riot_id: string;
  rank: string; // IRON / BRONZE / SILVER / GOLD / PLATINUM / DIAMOND / ASCENDANT / IMMORTAL / RADIANT
  tier: number; // 1(I) / 2(II) / 3(III)
  main_agent: string;
  avatar_url: string;
}

export interface PlayerProfileResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export interface ParticipantRequest {
  user_id: number | string;
  role: 'LEADER' | 'MEMBER';
}

export interface ParticipantResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Saves the player profile to Redis
 */
export async function savePlayerProfile(profileData: PlayerProfileRequest): Promise<PlayerProfileResponse> {
  const response = await apiClient.post<PlayerProfileResponse>('/api/v1/players/profile', profileData);
  return response.data;
}

/**
 * Registers a user to a specific tournament as a participant (LEADER or MEMBER)
 */
export async function addTournamentParticipant(
  tournamentId: string | number,
  participantData: ParticipantRequest
): Promise<ParticipantResponse> {
  const response = await apiClient.post<ParticipantResponse>(
    `/api/v1/tournaments/${tournamentId}/participants`,
    participantData
  );
  return response.data;
}
