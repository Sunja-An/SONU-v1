import { useState, useEffect } from 'react';
import { Search, RefreshCw, Loader2, User } from 'lucide-react';
import { apiClient } from '../../api/client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayerProfile {
  discord_id: string;
  nickname?: string;
  riot_id?: string;
  rank?: string;
  tier?: number;
  main_agent?: string;
  avatar_url?: string;
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────

const RANK_COLORS: Record<string, string> = {
  IRON: 'text-slate-400',
  BRONZE: 'text-amber-700',
  SILVER: 'text-slate-300',
  GOLD: 'text-yellow-400',
  PLATINUM: 'text-teal-400',
  DIAMOND: 'text-blue-400',
  ASCENDANT: 'text-emerald-400',
  IMMORTAL: 'text-red-400',
  RADIANT: 'text-yellow-300',
};

function RankBadge({ rank, tier }: { rank?: string; tier?: number }) {
  if (!rank) return <span className="text-xs text-slate-600">—</span>;
  const color = RANK_COLORS[rank] ?? 'text-slate-300';
  const tierLabel = tier ? (['I', 'II', 'III'][tier - 1] ?? '') : '';
  return (
    <span className={`text-xs font-bold ${color}`}>
      {rank} {tierLabel}
    </span>
  );
}

// ─── Player Detail Modal ──────────────────────────────────────────────────────

interface PlayerDetailModalProps {
  player: PlayerProfile;
  onClose: () => void;
}

function PlayerDetailModal({ player, onClose }: PlayerDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0c12] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            {player.avatar_url ? (
              <img src={player.avatar_url} alt="" className="w-20 h-20 rounded-full border-2 border-white/10 object-cover mb-4" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-3xl font-bold text-slate-500 mb-4">
                {(player.nickname ?? player.discord_id ?? '?')[0]?.toUpperCase()}
              </div>
            )}
            <h3 className="text-xl font-bold text-white">{player.nickname ?? '이름 없음'}</h3>
            <p className="text-sm text-slate-500 font-mono mt-1">{player.discord_id}</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Riot ID', value: player.riot_id },
              { label: '랭크', value: player.rank ? `${player.rank} ${player.tier ? ['I', 'II', 'III'][player.tier - 1] ?? '' : ''}` : undefined },
              { label: '메인 에이전트', value: player.main_agent },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3">
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-sm font-semibold text-white">{value ?? '—'}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-colors text-sm font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UserManagement() {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(null);

  const fetchPlayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: PlayerProfile[] }>('/api/v1/players');
      setPlayers(res.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? '플레이어 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const filtered = players.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.nickname ?? '').toLowerCase().includes(q) ||
      (p.riot_id ?? '').toLowerCase().includes(q) ||
      (p.discord_id ?? '').toLowerCase().includes(q) ||
      (p.main_agent ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {selectedPlayer && (
        <PlayerDetailModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Player Profiles</h2>
          <p className="text-slate-400">Redis에 등록된 전체 플레이어 프로필.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="refresh-players"
            onClick={fetchPlayers}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
            title="새로고침"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              id="player-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="닉네임, Riot ID, Discord ID..."
              className="bg-[#0f1117] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#FF4655] text-white w-72"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Stats */}
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">
        <User size={16} />
        <span>전체 <span className="text-white font-bold">{players.length}</span>명 / 검색 결과 <span className="text-white font-bold">{filtered.length}</span>명</span>
      </div>

      {/* Table */}
      <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
        {loading && players.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 size={28} className="animate-spin mr-3" />
            <span>불러오는 중...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            <User size={36} className="mx-auto mb-3 opacity-20" />
            <p>{search ? '검색 결과 없음' : '등록된 플레이어가 없습니다.'}</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">플레이어</th>
                <th className="px-6 py-4 font-medium">Riot ID</th>
                <th className="px-6 py-4 font-medium">랭크</th>
                <th className="px-6 py-4 font-medium">메인 에이전트</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.discord_id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => setSelectedPlayer(p)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt="" className="w-9 h-9 rounded-full border border-white/10 object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-500">
                          {(p.nickname ?? p.discord_id ?? '?')[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white text-sm">{p.nickname ?? '—'}</div>
                        <div className="text-xs text-slate-500 font-mono">{p.discord_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{p.riot_id ?? '—'}</td>
                  <td className="px-6 py-4">
                    <RankBadge rank={p.rank} tier={p.tier} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{p.main_agent ?? '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedPlayer(p); }}
                      className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
