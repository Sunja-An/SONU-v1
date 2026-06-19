import { useEffect, useRef, useCallback, useState } from 'react';

// ─── WebSocket Event Types ────────────────────────────────────────────────────

export type WSEventType =
  | 'shuffle_started'
  | 'shuffle_result'
  | 'auction_item_started'
  | 'bid_placed'
  | 'auction_won'
  | 'auction_failed'
  | 'round_completed'
  | 'second_round_started'
  | 'auction_all_ended';

export interface WSEvent<T = unknown> {
  event: WSEventType;
  data: T;
}

export interface ShuffleResultData {
  order: Array<{ discord_id: string; nickname: string; order: number }>;
  teams: Array<{ team_number: number; captain_discord_id: string }>;
}

export interface AuctionItemStartedData {
  discord_id: string;
  nickname: string;
  rank?: string;
  tier?: number;
  main_agent?: string;
  avatar_url?: string;
  start_price: number;
  order: number;
}

export interface BidPlacedData {
  team_nickname: string;
  team_id: string;
  amount: number;
  leader_id: number;
}

export interface AuctionWonData {
  player_discord_id: string;
  player_nickname: string;
  assigned_team_id: string;
  final_price: number;
}

export interface RoundCompletedData {
  failed_players: Array<{ discord_id: string; nickname: string }>;
}

export type WSConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface UseTournamentWebSocketOptions {
  tournamentId: number | string;
  enabled?: boolean;
  onShuffleStarted?: () => void;
  onShuffleResult?: (data: ShuffleResultData) => void;
  onAuctionItemStarted?: (data: AuctionItemStartedData) => void;
  onBidPlaced?: (data: BidPlacedData) => void;
  onAuctionWon?: (data: AuctionWonData) => void;
  onAuctionFailed?: () => void;
  onRoundCompleted?: (data: RoundCompletedData) => void;
  onSecondRoundStarted?: () => void;
  onAuctionAllEnded?: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTournamentWebSocket({
  tournamentId,
  enabled = true,
  onShuffleStarted,
  onShuffleResult,
  onAuctionItemStarted,
  onBidPlaced,
  onAuctionWon,
  onAuctionFailed,
  onRoundCompleted,
  onSecondRoundStarted,
  onAuctionAllEnded,
}: UseTournamentWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WSConnectionStatus>('disconnected');
  const [lastEvent, setLastEvent] = useState<WSEvent | null>(null);

  // Store callbacks in refs to avoid re-connecting on every render
  const callbacksRef = useRef({
    onShuffleStarted,
    onShuffleResult,
    onAuctionItemStarted,
    onBidPlaced,
    onAuctionWon,
    onAuctionFailed,
    onRoundCompleted,
    onSecondRoundStarted,
    onAuctionAllEnded,
  });
  useEffect(() => {
    callbacksRef.current = {
      onShuffleStarted,
      onShuffleResult,
      onAuctionItemStarted,
      onBidPlaced,
      onAuctionWon,
      onAuctionFailed,
      onRoundCompleted,
      onSecondRoundStarted,
      onAuctionAllEnded,
    };
  });

  const connect = useCallback(() => {
    if (!enabled || !tournamentId) return;

    const wsBase = (import.meta.env.VITE_API_URL || 'http://localhost:8080')
      .replace(/^http/, 'ws');
    const token = localStorage.getItem('token');
    const url = `${wsBase}/ws/tournaments/${tournamentId}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;
    setStatus('connecting');

    ws.onopen = () => {
      setStatus('connected');
      // Send auth token if available
      if (token) {
        ws.send(JSON.stringify({ type: 'auth', token }));
      }
    };

    ws.onmessage = (e) => {
      try {
        const event: WSEvent = JSON.parse(e.data);
        setLastEvent(event);

        const cb = callbacksRef.current;
        switch (event.event) {
          case 'shuffle_started':
            cb.onShuffleStarted?.();
            break;
          case 'shuffle_result':
            cb.onShuffleResult?.(event.data as ShuffleResultData);
            break;
          case 'auction_item_started':
            cb.onAuctionItemStarted?.(event.data as AuctionItemStartedData);
            break;
          case 'bid_placed':
            cb.onBidPlaced?.(event.data as BidPlacedData);
            break;
          case 'auction_won':
            cb.onAuctionWon?.(event.data as AuctionWonData);
            break;
          case 'auction_failed':
            cb.onAuctionFailed?.();
            break;
          case 'round_completed':
            cb.onRoundCompleted?.(event.data as RoundCompletedData);
            break;
          case 'second_round_started':
            cb.onSecondRoundStarted?.();
            break;
          case 'auction_all_ended':
            cb.onAuctionAllEnded?.();
            break;
        }
      } catch {
        console.warn('[WS] Failed to parse message', e.data);
      }
    };

    ws.onerror = () => {
      setStatus('error');
    };

    ws.onclose = () => {
      setStatus('disconnected');
      wsRef.current = null;
    };
  }, [tournamentId, enabled]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setStatus('disconnected');
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [connect, enabled]);

  return { status, lastEvent, disconnect, reconnect: connect };
}
