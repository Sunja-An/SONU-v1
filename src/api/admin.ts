import { apiClient } from './client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuctionRoom {
  id: string;
  tournament_id: number;
  start_price: number;
  status: 'ACTIVE' | 'EXPIRED';
  created_at: string;
  expires_at: string;
}

export interface StartAuctionRoomPayload {
  tournament_id: string | number;
  start_price: number;
}

// ─── Admin Auction Room ───────────────────────────────────────────────────────

export async function startAuctionRoom(data: StartAuctionRoomPayload): Promise<AuctionRoom> {
  const res = await apiClient.post<{ data: AuctionRoom }>('/api/v1/admin/auction/start', {
    tournament_id: String(data.tournament_id),
    start_price: data.start_price,
  });
  return res.data.data;
}

export async function getAuctionRoom(roomId: string): Promise<AuctionRoom> {
  const res = await apiClient.get<{ data: AuctionRoom }>(
    `/api/v1/admin/auction/rooms/${roomId}`
  );
  return res.data.data;
}
