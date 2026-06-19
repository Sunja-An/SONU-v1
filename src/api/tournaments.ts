import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Tournament {
  id: number;
  name: string;
  subtitle?: string;
  prize?: string;
  date?: string;
  slots?: string;
  bg_image?: string;
  rules?: string[];
  invite_code?: string;
  status: 'WAITING' | 'BIDDING' | 'COMPLETED';
  created_at?: string;
}

export interface CreateTournamentPayload {
  name: string;
  subtitle?: string;
  prize?: string;
  date?: string;
  slots?: string;
  bg_image?: string;
  rules?: string[];
  invite_code?: string;
}

export interface Participant {
  id: number;
  user_id: number;
  tournament_id: number;
  role: 'LEADER' | 'MEMBER';
  // player profile (from Redis)
  discord_id?: string;
  nickname?: string;
  riot_id?: string;
  rank?: string;
  tier?: number;
  main_agent?: string;
  avatar_url?: string;
}

export interface AddParticipantPayload {
  user_id: number;
  role: 'LEADER' | 'MEMBER';
  invite_code?: string;
}

export interface Team {
  id: string; // format: "{tournament_id}:{team_number}"
  tournament_id: number;
  team_number: number;
  name: string;
  captain_name: string;
  captain_discord_icon_url?: string;
  color: string;
  initial_points: number;
  current_points?: number;
  roster?: RosterSlot[];
}

export interface CreateTeamPayload {
  team_number: number;
  name: string;
  captain_name: string;
  captain_discord_icon_url?: string;
  color: string;
  initial_points: number;
}

export interface RosterSlot {
  position: number;
  role?: 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel';
  player_discord_id?: string;
  player_nickname?: string;
}

export interface UpdateRosterPayload {
  position: number;
  role: 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel';
  player_discord_id: string;
}

export interface AuctionResult {
  player_discord_id: string;
  player_nickname?: string;
  assigned_team_id: string;
  final_price: number;
}

// ─── Tournaments ──────────────────────────────────────────────────────────────

export async function createTournament(data: CreateTournamentPayload): Promise<Tournament> {
  const res = await apiClient.post<{ data: Tournament }>('/api/v1/tournaments', data);
  return res.data.data;
}

export async function getTournament(id: number | string): Promise<Tournament> {
  const res = await apiClient.get<{ data: Tournament }>(`/api/v1/tournaments/${id}`);
  return res.data.data;
}

// ─── Participants ─────────────────────────────────────────────────────────────

export async function getParticipants(tournamentId: number | string): Promise<Participant[]> {
  const res = await apiClient.get<{ data: Participant[] }>(
    `/api/v1/tournaments/${tournamentId}/participants`
  );
  return res.data.data;
}

export async function addParticipant(
  tournamentId: number | string,
  data: AddParticipantPayload
): Promise<Participant> {
  const res = await apiClient.post<{ data: Participant }>(
    `/api/v1/tournaments/${tournamentId}/participants`,
    data
  );
  return res.data.data;
}

// ─── Auction Controls (운영자) ────────────────────────────────────────────────

export async function shuffle(tournamentId: number | string): Promise<void> {
  await apiClient.post(`/api/v1/tournaments/${tournamentId}/shuffle`);
}

export async function startNextAuction(tournamentId: number | string): Promise<void> {
  await apiClient.post(`/api/v1/tournaments/${tournamentId}/auction/next`);
}

export async function finalizeAuction(
  tournamentId: number | string,
  won: boolean
): Promise<void> {
  await apiClient.post(`/api/v1/tournaments/${tournamentId}/auction/finalize`, { won });
}

export async function getAuctionResults(
  tournamentId: number | string
): Promise<AuctionResult[]> {
  const res = await apiClient.get<{ data: AuctionResult[] }>(
    `/api/v1/tournaments/${tournamentId}/auction/results`
  );
  return res.data.data;
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function createTeam(
  tournamentId: number | string,
  data: CreateTeamPayload
): Promise<Team> {
  const res = await apiClient.post<{ data: Team }>(
    `/api/v1/tournaments/${tournamentId}/teams`,
    data
  );
  return res.data.data;
}

export async function getTeams(tournamentId: number | string): Promise<Team[]> {
  const res = await apiClient.get<{ data: Team[] }>(
    `/api/v1/tournaments/${tournamentId}/teams`
  );
  return res.data.data;
}

export async function updateRoster(
  tournamentId: number | string,
  teamId: string,
  data: UpdateRosterPayload
): Promise<void> {
  await apiClient.put(
    `/api/v1/tournaments/${tournamentId}/teams/${teamId}/roster`,
    data
  );
}
