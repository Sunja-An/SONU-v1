// ─────────────────────────────────────────────
// 포지션 (Valorant Role)
// ─────────────────────────────────────────────
export type ValorantRole = 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel';

export type TierRank =
  | 'Iron' | 'Bronze' | 'Silver' | 'Gold'
  | 'Platinum' | 'Diamond' | 'Ascendant' | 'Immortal' | 'Radiant';

// ─────────────────────────────────────────────
// 선수 (Player)
// ─────────────────────────────────────────────
export interface PlayerStats {
  kda: number;       // Kill/Death/Assist ratio
  acs: number;       // Average Combat Score
  headshot: number;  // Headshot percentage (0–100)
  winRate: number;   // Win rate percentage (0–100)
}

export interface Player {
  id: string;
  name: string;         // 인게임 닉네임
  realName?: string;    // 실명 (선택)
  discordName?: string;    // 디스코드 이름
  discordIconUrl?: string; // 디스코드 아이콘
  selfIntro?: string;      // 자기소개
  tier: TierRank;
  mostAgents: string[]; // 모스트 요원 이름 (최대 3개)
  role: ValorantRole;   // 주력 포지션
  possibleRoles?: ValorantRole[]; // 가능한 포지션 (선택적 여러 개)
  stats: PlayerStats;
  avatarUrl?: string;   // 선수 프로필 이미지 URL
  agentImageUrl?: string; // 모스트 요원 이미지 URL
}

// ─────────────────────────────────────────────
// 입찰 기록 (Bid Log)
// ─────────────────────────────────────────────
export interface BidEntry {
  id: string;
  teamId: string;
  teamName: string;
  teamColor: string;    // hex color for UI highlighting
  amount: number;
  timestamp: number;    // Unix ms
}

// ─────────────────────────────────────────────
// 팀 로스터 슬롯 (Team Roster Slot)
// ─────────────────────────────────────────────
export interface RosterSlot {
  position: number;     // 1–5
  role: ValorantRole | null;
  player: Player | null;
}

// ─────────────────────────────────────────────
// 팀 (Team)
// ─────────────────────────────────────────────
export interface Team {
  id: string;
  name: string;
  captainName: string;
  captainDiscordIconUrl?: string;
  color: string;        // hex — used for UI accents
  remainingPoints: number;
  roster: RosterSlot[];
}

// ─────────────────────────────────────────────
// 경매 상태 (Auction Status)
// ─────────────────────────────────────────────
export type AuctionStatus = 'idle' | 'shuffling' | 'active' | 'sold' | 'no_bid' | 'auto_assigned';

export interface AuctionState {
  status: AuctionStatus;
  currentPlayer: Player | null;
  currentHighestBid: number;
  currentHighestTeamId: string | null;
  bidLog: BidEntry[];
  timeRemaining: number; // seconds
  totalTime: number;     // seconds (default 30)
  minBidIncrement: number;
  startingBid: number;
  autoAssignTarget?: { teamId: string; position: number } | null;
}

// ─────────────────────────────────────────────
// 전체 Room 상태
// ─────────────────────────────────────────────
export interface RoomState {
  roomId: string;
  roomName: string;
  teams: Team[];
  playerPool: Player[];  // 아직 경매 안 된 선수 풀
  auction: AuctionState;
  myTeamId: string | null; // 현재 접속 유저의 팀 ID
}
