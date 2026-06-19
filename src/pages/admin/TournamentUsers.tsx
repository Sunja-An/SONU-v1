import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, Loader2, X, Plus, RefreshCw, Shield, Swords } from 'lucide-react';
import {
  getParticipants,
  addParticipant,
  type Participant,
} from '../../api/tournaments';

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
  if (!rank) return <span className="text-slate-600 text-xs">—</span>;
  const color = RANK_COLORS[rank] ?? 'text-slate-300';
  const tierLabel = tier ? ['I', 'II', 'III'][tier - 1] ?? '' : '';
  return (
    <span className={`text-xs font-bold ${color}`}>
      {rank} {tierLabel}
    </span>
  );
}

// ─── Add Participant Modal ────────────────────────────────────────────────────

interface AddParticipantModalProps {
  tournamentId: string;
  onClose: () => void;
  onAdded: (p: Participant) => void;
}

function AddParticipantModal({ tournamentId, onClose, onAdded }: AddParticipantModalProps) {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<'LEADER' | 'MEMBER'>('MEMBER');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) { setError('User ID를 입력하세요.'); return; }
    setLoading(true);
    setError(null);
    try {
      const p = await addParticipant(tournamentId, {
        user_id: Number(userId),
        role,
        invite_code: inviteCode.trim() || undefined,
      });
      onAdded(p);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? '참가자 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0c12] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-400/10 flex items-center justify-center">
              <UserPlus className="text-emerald-400" size={18} />
            </div>
            <h3 className="text-lg font-bold text-white">참가자 추가</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">
              User ID <span className="text-[#FF4655]">*</span>
            </label>
            <input
              id="add-participant-user-id"
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="2"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">역할</label>
            <div className="flex gap-3">
              {(['MEMBER', 'LEADER'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                    role === r
                      ? r === 'LEADER'
                        ? 'bg-[#FF4655]/20 border-[#FF4655] text-[#FF4655]'
                        : 'bg-emerald-400/10 border-emerald-400 text-emerald-400'
                      : 'border-white/10 text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {r === 'LEADER' ? (
                    <span className="flex items-center justify-center gap-1.5"><Shield size={14} /> 팀장</span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5"><Swords size={14} /> 팀원</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">초대 코드 (선택)</label>
            <input
              id="add-participant-invite-code"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="SONU2026"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors text-sm">
              취소
            </button>
            <button
              id="submit-add-participant"
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TournamentUsers() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchParticipants = useCallback(async () => {
    if (!tournamentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getParticipants(tournamentId);
      setParticipants(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? '참가자를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  const handleAdded = (p: Participant) => {
    setParticipants((prev) => [p, ...prev]);
    setShowAddModal(false);
  };

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    return (
      (p.nickname ?? '').toLowerCase().includes(q) ||
      (p.riot_id ?? '').toLowerCase().includes(q) ||
      (p.discord_id ?? '').toLowerCase().includes(q)
    );
  });

  const leaders = filtered.filter((p) => p.role === 'LEADER');
  const members = filtered.filter((p) => p.role === 'MEMBER');

  return (
    <div>
      {showAddModal && tournamentId && (
        <AddParticipantModal
          tournamentId={tournamentId}
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <Link to="/admin/tournaments" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} /> Tournament Management
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-1">참가자 관리</h2>
            <p className="text-slate-500 font-mono text-sm">Tournament ID: {tournamentId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchParticipants}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
              title="새로고침"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="검색..."
                className="bg-[#0f1117] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#FF4655] text-white w-52"
              />
            </div>
            <button
              id="open-add-participant-modal"
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap text-sm"
            >
              <UserPlus size={16} /> 참가자 추가
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: '전체', value: filtered.length, color: 'text-white' },
          { label: '팀장 (LEADER)', value: leaders.length, color: 'text-[#FF4655]' },
          { label: '팀원 (MEMBER)', value: members.length, color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0f1117] border border-white/5 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
        {loading && participants.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 size={28} className="animate-spin mr-3" />
            <span>불러오는 중...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">참가자가 없습니다.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">플레이어</th>
                <th className="px-6 py-4 font-medium">Riot ID</th>
                <th className="px-6 py-4 font-medium">랭크</th>
                <th className="px-6 py-4 font-medium">메인</th>
                <th className="px-6 py-4 font-medium">역할</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p.id ?? idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover border border-white/10" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 text-xs font-bold">
                          {(p.nickname ?? '?')[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white text-sm">{p.nickname ?? '—'}</div>
                        {p.discord_id && (
                          <div className="text-xs text-slate-500 font-mono">{p.discord_id}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{p.riot_id ?? '—'}</td>
                  <td className="px-6 py-4">
                    <RankBadge rank={p.rank} tier={p.tier} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{p.main_agent ?? '—'}</td>
                  <td className="px-6 py-4">
                    {p.role === 'LEADER' ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#FF4655] bg-[#FF4655]/10 px-2.5 py-1 rounded w-fit">
                        <Shield size={11} /> 팀장
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded w-fit">
                        <Swords size={11} /> 팀원
                      </span>
                    )}
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
