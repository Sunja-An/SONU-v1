import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { RoomState, AuctionState, Team, BidEntry, Player } from '../types';
import {
  MOCK_TEAMS,
  MOCK_PLAYERS,
  MOCK_AUCTION_STATE,
} from '../data/mockData';

// ─────────────────────────────────────────────
// Store Actions Interface
// ─────────────────────────────────────────────
interface RoomActions {
  // 입찰 관련
  placeBid: (teamId: string, amount: number) => void;
  addBidEntry: (entry: BidEntry) => void;

  // 경매 상태 업데이트
  // TODO: WebSocket 'auction_update' 이벤트 핸들러에서 호출
  setAuctionState: (state: Partial<AuctionState>) => void;
  setCurrentPlayer: (player: Player | null) => void;
  tickTimer: () => void;
  startAuction: (player: Player) => void;
  endAuction: (soldToTeamId: string | null) => void;

  // 팀 업데이트
  // TODO: WebSocket 'team_update' 이벤트 핸들러에서 호출
  updateTeams: (teams: Team[]) => void;

  // 현재 유저 팀 설정
  setMyTeamId: (teamId: string) => void;
}

// ─────────────────────────────────────────────
// Full Store Type
// ─────────────────────────────────────────────
type RoomStore = RoomState & RoomActions;

// ─────────────────────────────────────────────
// Zustand Store
// subscribeWithSelector: 특정 상태 슬라이스 변화를 subscribe 가능하게 함
// (e.g. timeRemaining이 5 이하로 떨어질 때 UI 효과 트리거)
// ─────────────────────────────────────────────
export const useRoomStore = create<RoomStore>()(
  subscribeWithSelector((set, get) => ({
    // ── Initial State ──────────────────────────
    roomId: 'room-001',
    roomName: 'SONU 滅亡戦 シーズン1',
    teams: MOCK_TEAMS,
    playerPool: MOCK_PLAYERS.slice(1), // 첫 번째 선수는 현재 경매 중
    auction: MOCK_AUCTION_STATE,
    myTeamId: 'team-alpha', // TODO: 로그인/방 입장 시 서버에서 받아올 값

    // ── Actions ───────────────────────────────

    placeBid: (teamId, amount) => {
      const { auction, teams } = get();
      const team = teams.find((t) => t.id === teamId);
      if (!team) return;
      if (amount <= auction.currentHighestBid) return;
      if (team.remainingPoints < amount) return;

      const newEntry: BidEntry = {
        id: `bid-${Date.now()}`,
        teamId,
        teamName: team.name,
        teamColor: team.color,
        amount,
        timestamp: Date.now(),
      };

      set((state) => ({
        auction: {
          ...state.auction,
          currentHighestBid: amount,
          currentHighestTeamId: teamId,
          bidLog: [newEntry, ...state.auction.bidLog],
          // TODO: WebSocket 'place_bid' emit 이후 서버 응답으로 상태 갱신
          timeRemaining: state.auction.totalTime, // 입찰 시 타이머 초기화
        },
      }));
    },

    addBidEntry: (entry) => {
      // TODO: WebSocket 'bid_placed' 이벤트 수신 시 호출
      set((state) => ({
        auction: {
          ...state.auction,
          bidLog: [entry, ...state.auction.bidLog],
          currentHighestBid: entry.amount,
          currentHighestTeamId: entry.teamId,
          timeRemaining: state.auction.totalTime, // 다른 유저 입찰 시에도 타이머 초기화
        },
      }));
    },

    setAuctionState: (partial) => {
      // TODO: WebSocket 'auction_update' 이벤트 수신 시 호출
      set((state) => ({
        auction: { ...state.auction, ...partial },
      }));
    },

    setCurrentPlayer: (player) => {
      set((state) => ({
        auction: { ...state.auction, currentPlayer: player },
      }));
    },

    tickTimer: () => {
      set((state) => ({
        auction: {
          ...state.auction,
          timeRemaining: Math.max(0, state.auction.timeRemaining - 1),
        },
      }));
    },

    startAuction: (player) => {
      set((state) => ({
        auction: {
          ...state.auction,
          status: 'active',
          currentPlayer: player,
          currentHighestBid: state.auction.startingBid,
          currentHighestTeamId: null,
          bidLog: [],
          timeRemaining: state.auction.totalTime,
        },
      }));
    },

    endAuction: (soldToTeamId) => {
      set((state) => {
        let newTeams = state.teams;
        let newAuction = { ...state.auction, status: (soldToTeamId ? 'sold' : 'no_bid') as 'sold' | 'no_bid' };

        if (soldToTeamId && state.auction.currentPlayer) {
          const teamIndex = newTeams.findIndex(t => t.id === soldToTeamId);
          if (teamIndex !== -1) {
            const team = newTeams[teamIndex];
            const emptySlotIndex = team.roster.findIndex(s => s.player === null);
            if (emptySlotIndex !== -1) {
              const updatedRoster = [...team.roster];
              updatedRoster[emptySlotIndex] = {
                ...updatedRoster[emptySlotIndex],
                player: state.auction.currentPlayer
              };

              const updatedTeam = {
                ...team,
                roster: updatedRoster,
                remainingPoints: team.remainingPoints - state.auction.currentHighestBid
              };

              newTeams = [...newTeams];
              newTeams[teamIndex] = updatedTeam;
            }
          }
        }

        return {
          teams: newTeams,
          auction: newAuction
        };
      });
    },

    updateTeams: (teams) => {
      // TODO: WebSocket 'teams_update' 이벤트 수신 시 호출
      set({ teams });
    },

    setMyTeamId: (teamId) => {
      set({ myTeamId: teamId });
    },
  }))
);

// ─────────────────────────────────────────────
// Derived Selectors (성능 최적화: 컴포넌트가 필요한 슬라이스만 구독)
// ─────────────────────────────────────────────
export const selectAuction = (s: RoomStore) => s.auction;
export const selectTeams = (s: RoomStore) => s.teams;
export const selectMyTeam = (s: RoomStore) =>
  s.teams.find((t) => t.id === s.myTeamId) ?? null;
export const selectBidLog = (s: RoomStore) => s.auction.bidLog;
export const selectTimeRemaining = (s: RoomStore) => s.auction.timeRemaining;
export const selectIsMyTeamHighest = (s: RoomStore) =>
  s.auction.currentHighestTeamId === s.myTeamId;
