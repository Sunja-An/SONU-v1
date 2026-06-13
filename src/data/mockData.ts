import type { Player, Team, BidEntry, RosterSlot, AuctionState, AuctionStatus } from '../types';

// ─────────────────────────────────────────────
// Mock Players Pool
// TODO: WebSocket接続時、サーバーからリアルタイムで受け取るデータ
// ─────────────────────────────────────────────
export const MOCK_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Zephyr',
    realName: 'キム・テヤン',
    discordName: 'Zephyr#1234',
    discordIconUrl: 'https://i.pravatar.cc/150?u=Zephyr',
    selfIntro: 'エントリー専門です！豪快な突破をお見せします。',
    tier: 'Radiant',
    mostAgents: ['Jett', 'Raze', 'Neon'],
    role: 'Duelist',
    possibleRoles: ['Duelist', 'Initiator'],
    stats: { kda: 3.2, acs: 312, headshot: 38, winRate: 67 },
    agentImageUrl: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png',
  },
  {
    id: 'p2',
    name: 'WraithX',
    realName: 'イ・ジウン',
    discordName: 'Wraith#0001',
    discordIconUrl: 'https://i.pravatar.cc/150?u=WraithX',
    selfIntro: 'スモークの職人です。安定した射線構築はお任せください。',
    tier: 'Immortal',
    mostAgents: ['Omen', 'Viper', 'Astra'],
    role: 'Controller',
    possibleRoles: ['Controller'],
    stats: { kda: 2.8, acs: 278, headshot: 31, winRate: 62 },
    agentImageUrl: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png',
  },
  {
    id: 'p3',
    name: 'NovaStar',
    discordName: 'Nova#9999',
    discordIconUrl: 'https://i.pravatar.cc/150?u=Nova',
    selfIntro: '裏取り警戒と回復は私にお任せください！',
    tier: 'Ascendant',
    mostAgents: ['Sage', 'Killjoy', 'Cypher'],
    role: 'Sentinel',
    possibleRoles: ['Sentinel', 'Controller'],
    stats: { kda: 2.1, acs: 224, headshot: 24, winRate: 58 },
    agentImageUrl: 'https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png',
  },
  {
    id: 'p4',
    name: 'PulseV',
    discordName: 'PulseV#1029',
    discordIconUrl: 'https://i.pravatar.cc/150?u=Pulse',
    selfIntro: '確実に情報を取ります。',
    tier: 'Diamond',
    mostAgents: ['Sova', 'Breach', 'Fade'],
    role: 'Initiator',
    possibleRoles: ['Initiator'],
    stats: { kda: 2.5, acs: 256, headshot: 29, winRate: 55 },
    agentImageUrl: 'https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png',
  },
];

// ─────────────────────────────────────────────
// Mock Teams
// TODO: WebSocket接続時、サーバーからリアルタイムで受け取るデータ
// ─────────────────────────────────────────────
const createRoster = (): RosterSlot[] =>
  Array.from({ length: 5 }, (_, i) => ({
    position: i + 1,
    role: null,
    player: null,
  }));

export const MOCK_TEAMS: Team[] = [
  {
    id: 'team-alpha',
    name: 'ORANGE',
    captainName: 'CaptainOrange',
    captainDiscordIconUrl: 'https://i.pravatar.cc/150?u=CaptainOrange',
    color: '#F97316', // Orange
    remainingPoints: 850,
    roster: createRoster(),
  },
  {
    id: 'team-bravo',
    name: 'PURPLE',
    captainName: 'ShadowPurple',
    captainDiscordIconUrl: 'https://i.pravatar.cc/150?u=ShadowPurple',
    color: '#A855F7', // Purple
    remainingPoints: 920,
    roster: createRoster(),
  },
  {
    id: 'team-charlie',
    name: 'RED',
    captainName: 'GhostRed',
    captainDiscordIconUrl: 'https://i.pravatar.cc/150?u=GhostRed',
    color: '#EF4444', // Red
    remainingPoints: 780,
    roster: createRoster(),
  },
  {
    id: 'team-delta',
    name: 'BLUE',
    captainName: 'BlueWarden',
    captainDiscordIconUrl: 'https://i.pravatar.cc/150?u=BlueWarden',
    color: '#3B82F6', // Blue
    remainingPoints: 1000,
    roster: createRoster(),
  },
];

// ─────────────────────────────────────────────
// Mock Bid Log
// TODO: WebSocket 'bid_placed' イベントでリアルタイム更新
// ─────────────────────────────────────────────
export const MOCK_BID_LOG: BidEntry[] = [
  {
    id: 'b1',
    teamId: 'team-alpha',
    teamName: 'ALPHA',
    teamColor: '#FF4655',
    amount: 150,
    timestamp: Date.now() - 12000,
  },
  {
    id: 'b2',
    teamId: 'team-bravo',
    teamName: 'BRAVO',
    teamColor: '#4FBBEF',
    amount: 200,
    timestamp: Date.now() - 8000,
  },
  {
    id: 'b3',
    teamId: 'team-charlie',
    teamName: 'CHARLIE',
    teamColor: '#A8F037',
    amount: 250,
    timestamp: Date.now() - 5000,
  },
  {
    id: 'b4',
    teamId: 'team-alpha',
    teamName: 'ALPHA',
    teamColor: '#FF4655',
    amount: 300,
    timestamp: Date.now() - 2000,
  },
];

// ─────────────────────────────────────────────
// Mock Auction State
// ─────────────────────────────────────────────
export const MOCK_AUCTION_STATE: AuctionState = {
  status: 'active' as AuctionStatus,
  currentPlayer: MOCK_PLAYERS[0],
  currentHighestBid: 300,
  currentHighestTeamId: 'team-alpha',
  bidLog: MOCK_BID_LOG,
  timeRemaining: 10,
  totalTime: 10,
  minBidIncrement: 50,
  startingBid: 100,
};
