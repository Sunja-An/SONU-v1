import { useState } from 'react';
import { Users, Shield, Activity, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for Registered Players
interface Participant {
  id: string;
  name: string;
  riotId: string;
  tier: string;
  role: string;
  mainAgent: string;
  avatarUrl: string;
}

const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    name: 'ShadowAgent',
    riotId: 'SHADOW#KR1',
    tier: 'Diamond',
    role: 'Duelist',
    mainAgent: 'Jett',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png',
  },
  {
    id: '2',
    name: 'SkyLine',
    riotId: 'SKY#JP1',
    tier: 'Platinum',
    role: 'Initiator',
    mainAgent: 'Sova',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/2.png',
  },
  {
    id: '3',
    name: 'HexCode',
    riotId: 'HEX#KR2',
    tier: 'Gold',
    role: 'Sentinel',
    mainAgent: 'Killjoy',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/3.png',
  },
  {
    id: '4',
    name: 'GhostMage',
    riotId: 'GHOST#NA1',
    tier: 'Ascendant',
    role: 'Controller',
    mainAgent: 'Omen',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/4.png',
  },
  {
    id: '5',
    name: 'ViperBite',
    riotId: 'VIPER#JP2',
    tier: 'Diamond',
    role: 'Controller',
    mainAgent: 'Viper',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
  },
  {
    id: '6',
    name: 'RuneBreaker',
    riotId: 'RUNE#KR3',
    tier: 'Silver',
    role: 'Duelist',
    mainAgent: 'Raze',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png',
  },
];

// Mock Auction Results
interface AuctionResult {
  playerName: string;
  riotId: string;
  role: string;
  tier: string;
  soldTo: string;
  soldPrice: number; // points
  status: 'DRAFTED' | 'UNSOLD';
}

const MOCK_AUCTION_RESULTS: AuctionResult[] = [
  { playerName: 'ShadowAgent', riotId: 'SHADOW#KR1', role: 'Duelist', tier: 'Diamond', soldTo: 'Team Alpha', soldPrice: 850, status: 'DRAFTED' },
  { playerName: 'SkyLine', riotId: 'SKY#JP1', role: 'Initiator', tier: 'Platinum', soldTo: 'Team Delta', soldPrice: 620, status: 'DRAFTED' },
  { playerName: 'GhostMage', riotId: 'GHOST#NA1', role: 'Controller', tier: 'Ascendant', soldTo: 'Team Gamma', soldPrice: 910, status: 'DRAFTED' },
  { playerName: 'HexCode', riotId: 'HEX#KR2', role: 'Sentinel', tier: 'Gold', soldTo: 'Team Beta', soldPrice: 400, status: 'DRAFTED' },
  { playerName: 'ViperBite', riotId: 'VIPER#JP2', role: 'Controller', tier: 'Diamond', soldTo: 'Team Alpha', soldPrice: 750, status: 'DRAFTED' },
];

export function Contests() {
  const [activeTab, setActiveTab] = useState<'participants' | 'auction'>('participants');

  return (
    <div className="min-h-screen bg-[#06070b] text-[#f1f5f9] font-sans pb-24 selection:bg-[#FF4655] selection:text-white">
      <main className="max-w-6xl mx-auto px-6 pt-16">
        
        {/* Page Header */}
        <div className="border-l-4 border-[#FF4655] pl-4 mb-10">
          <span className="block text-xs text-gray-500 font-mono tracking-widest uppercase">TOURNAMENT HUB</span>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white mt-1">
            CONTESTS & MATCHING
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            参加選手リスト、そしてオークションドラフトの結果をまとめて管理・確認できます。
          </p>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div className="flex border-b border-white/5 mb-10 overflow-x-auto select-scrollbar font-mono">
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex items-center gap-2.5 px-6 py-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === 'participants'
                ? 'border-[#FF4655] text-white bg-[#FF4655]/5'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Users size={16} />
            選手リスト ({MOCK_PARTICIPANTS.length})
          </button>

          <button
            onClick={() => setActiveTab('auction')}
            className={`flex items-center gap-2.5 px-6 py-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${
              activeTab === 'auction'
                ? 'border-[#FF4655] text-white bg-[#FF4655]/5'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Coins size={16} />
            オークション結果
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: Participants List */}
          {activeTab === 'participants' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Activity size={18} className="text-[#FF4655]" /> 登録済み選手プール
                </h2>
                <span className="text-[10px] text-gray-500 font-mono">プール: 地域-KR/JP</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PARTICIPANTS.map((player) => (
                  <div 
                    key={player.id} 
                    className="relative bg-[#0d0f15] border border-white/5 p-5 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="absolute top-0 left-0 w-2 h-0.5 bg-[#FF4655]/60" />
                    <div className="absolute top-0 left-0 w-0.5 h-2 bg-[#FF4655]/60" />
                    
                    <div className="flex items-start gap-4">
                      <img 
                        src={player.avatarUrl} 
                        alt={player.name} 
                        className="w-14 h-14 rounded-full border border-white/10 bg-black/40 p-1"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-white text-base truncate" title={player.name}>
                            {player.name}
                          </h3>
                          <span className="text-[9px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 rounded-sm font-mono uppercase">
                            {player.tier}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mt-0.5 uppercase tracking-wider">{player.riotId}</p>
                        
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-[10px] text-gray-400 font-mono">
                          <div>
                            <span className="text-gray-500 block text-[8px] uppercase">ポジション</span>
                            <span className="font-bold text-white">{player.role}</span>
                          </div>
                          <div className="border-l border-white/10 pl-4">
                            <span className="text-gray-500 block text-[8px] uppercase">使用エージェント</span>
                            <span className="font-bold text-white">{player.mainAgent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: Auction results */}
          {activeTab === 'auction' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Shield size={18} className="text-[#FF4655]" /> ドラフトボード ＆ 入札結果
                </h2>
                <span className="text-[10px] text-gray-500 font-mono">予算: 各チーム 1000PTS</span>
              </div>

              {/* Auction Draft Table */}
              <div className="bg-[#0d0f15] border border-white/5 overflow-hidden">
                <div className="overflow-x-auto select-scrollbar">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-black/30 border-b border-white/5 text-[9px] text-gray-500 font-mono uppercase tracking-widest">
                        <th className="p-4">選手</th>
                        <th className="p-4">Riot ID</th>
                        <th className="p-4">ポジション</th>
                        <th className="p-4">現在のティア</th>
                        <th className="p-4">指名チーム</th>
                        <th className="p-4 text-right">落札ポイント</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono">
                      {MOCK_AUCTION_RESULTS.map((draft, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 font-bold text-white flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[#00FF9D] rounded-full" />
                            {draft.playerName}
                          </td>
                          <td className="p-4 text-gray-400 uppercase">{draft.riotId}</td>
                          <td className="p-4 text-gray-300 uppercase">{draft.role}</td>
                          <td className="p-4 text-gray-400 uppercase">{draft.tier}</td>
                          <td className="p-4 text-white font-bold uppercase">{draft.soldTo}</td>
                          <td className="p-4 text-right text-[#FF4655] font-black">{draft.soldPrice} Pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
