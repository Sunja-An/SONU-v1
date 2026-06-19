import { useState, useEffect } from 'react';
import { Users, Trophy, Activity, Gavel, Loader2, TrendingUp } from 'lucide-react';
import { apiClient } from '../../api/client';

interface PlayerProfile {
  discord_id: string;
  nickname?: string;
  riot_id?: string;
  rank?: string;
  avatar_url?: string;
}

const RANK_COLORS: Record<string, string> = {
  IRON: 'text-slate-400', BRONZE: 'text-amber-700', SILVER: 'text-slate-300',
  GOLD: 'text-yellow-400', PLATINUM: 'text-teal-400', DIAMOND: 'text-blue-400',
  ASCENDANT: 'text-emerald-400', IMMORTAL: 'text-red-400', RADIANT: 'text-yellow-300',
};

export function AdminDashboard() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<{ data: PlayerProfile[] }>('/api/v1/players')
      .then((res) => setPlayers(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const rankCount = players.reduce<Record<string, number>>((acc, p) => {
    if (p.rank) acc[p.rank] = (acc[p.rank] ?? 0) + 1;
    return acc;
  }, {});

  const topRanks = Object.entries(rankCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentPlayers = [...players].slice(0, 8);

  const stats = [
    {
      label: '등록 플레이어',
      value: loading ? '—' : players.length.toLocaleString(),
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      sub: '전체 참가자 프로필',
    },
    {
      label: 'Active Auctions',
      value: '—',
      icon: Gavel,
      color: 'text-[#FF4655]',
      bg: 'bg-[#FF4655]/10',
      sub: '실시간 경매 진행 수',
    },
    {
      label: 'Tournaments',
      value: '—',
      icon: Trophy,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      sub: '진행/완료 대회',
    },
    {
      label: 'Radiant Players',
      value: loading ? '—' : (rankCount['RADIANT'] ?? 0).toString(),
      icon: Activity,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      sub: '최고 랭크 참가자',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      <p className="text-slate-400 mb-8 text-sm">SONU Admin Panel 개요</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#0f1117] border border-white/5 p-6 rounded-xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} shrink-0`}>
              <stat.icon size={22} />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-slate-500 mb-0.5 truncate">{stat.sub}</div>
              <div className="text-sm text-slate-300 mb-0.5">{stat.label}</div>
              <div className="text-2xl font-bold text-white">
                {loading && idx === 0 ? <Loader2 size={20} className="animate-spin text-blue-400" /> : stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Players */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-bold mb-5 flex items-center gap-2">
            <Users size={16} className="text-blue-400" /> 최근 등록 플레이어
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-500">
              <Loader2 size={22} className="animate-spin mr-2" /> 불러오는 중...
            </div>
          ) : recentPlayers.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">등록된 플레이어가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {recentPlayers.map((p) => (
                <div key={p.discord_id} className="flex items-center gap-3">
                  {p.avatar_url ? (
                    <img src={p.avatar_url} alt="" className="w-8 h-8 rounded-full border border-white/10 object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                      {(p.nickname ?? p.discord_id ?? '?')[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white truncate">{p.nickname ?? '—'}</div>
                    <div className="text-xs text-slate-500 font-mono truncate">{p.discord_id}</div>
                  </div>
                  {p.rank && (
                    <span className={`text-xs font-bold shrink-0 ${RANK_COLORS[p.rank] ?? 'text-slate-400'}`}>
                      {p.rank}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rank distribution */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-bold mb-5 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" /> 랭크 분포
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-500">
              <Loader2 size={22} className="animate-spin mr-2" /> 불러오는 중...
            </div>
          ) : topRanks.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-8">데이터 없음</p>
          ) : (
            <div className="space-y-3">
              {topRanks.map(([rank, count]) => {
                const pct = players.length > 0 ? Math.round((count / players.length) * 100) : 0;
                return (
                  <div key={rank}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${RANK_COLORS[rank] ?? 'text-slate-300'}`}>{rank}</span>
                      <span className="text-xs text-slate-500">{count}명 ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: rank === 'RADIANT' ? '#facc15' : rank === 'IMMORTAL' ? '#f87171' : rank === 'DIAMOND' ? '#60a5fa' : '#64748b' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
