import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2, X, RefreshCw, Users } from 'lucide-react';
import {
  getTeams,
  createTeam,
  updateRoster,
  type Team,
  type CreateTeamPayload,
  type UpdateRosterPayload,
} from '../../api/tournaments';

// ─── Role colors ──────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  Duelist: 'text-[#FF4655] bg-[#FF4655]/10 border-[#FF4655]/20',
  Initiator: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  Controller: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Sentinel: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

// ─── Roster Slot Card ─────────────────────────────────────────────────────────

interface RosterSlotCardProps {
  slot: { position: number; role?: string; player_discord_id?: string; player_nickname?: string };
  teamId: string;
  tournamentId: string;
  onUpdated: () => void;
}

function RosterSlotCard({ slot, teamId, tournamentId, onUpdated }: RosterSlotCardProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UpdateRosterPayload>>({
    position: slot.position,
    role: slot.role as UpdateRosterPayload['role'] | undefined,
    player_discord_id: slot.player_discord_id ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!form.role || !form.player_discord_id) { setError('역할과 Discord ID를 입력하세요.'); return; }
    setLoading(true);
    setError(null);
    try {
      await updateRoster(tournamentId, teamId, {
        position: slot.position,
        role: form.role,
        player_discord_id: form.player_discord_id,
      });
      setEditing(false);
      onUpdated();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? '저장 실패');
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = !slot.player_discord_id;
  const roleStyle = slot.role ? ROLE_COLORS[slot.role] ?? 'text-slate-400 bg-white/5 border-white/10' : '';

  if (editing) {
    return (
      <div className="bg-black/40 border border-white/15 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Position {slot.position}</span>
          <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-white">
            <X size={14} />
          </button>
        </div>
        <select
          value={form.role ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UpdateRosterPayload['role'] }))}
          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF4655]"
        >
          <option value="">역할 선택</option>
          {(['Duelist', 'Initiator', 'Controller', 'Sentinel'] as const).map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input
          type="text"
          value={form.player_discord_id}
          onChange={(e) => setForm((f) => ({ ...f, player_discord_id: e.target.value }))}
          placeholder="Discord ID"
          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#FF4655] placeholder-slate-600 font-mono"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2 bg-[#FF4655] hover:bg-[#ff5c69] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : '저장'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={`w-full text-left rounded-xl p-4 border transition-all hover:scale-[1.02] ${
        isEmpty
          ? 'bg-white/[0.02] border-dashed border-white/10 hover:border-white/20'
          : 'bg-black/30 border-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase">Pos {slot.position}</span>
        {slot.role && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded border ${roleStyle}`}>
            {slot.role}
          </span>
        )}
      </div>
      {isEmpty ? (
        <div className="flex items-center gap-2 text-slate-600">
          <Plus size={14} />
          <span className="text-xs">슬롯 배정</span>
        </div>
      ) : (
        <div>
          <div className="text-sm font-semibold text-white">{slot.player_nickname ?? slot.player_discord_id}</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{slot.player_discord_id}</div>
        </div>
      )}
    </button>
  );
}

// ─── Team Card ────────────────────────────────────────────────────────────────

interface TeamCardProps {
  team: Team;
  tournamentId: string;
  onUpdated: () => void;
}

function TeamCard({ team, tournamentId, onUpdated }: TeamCardProps) {
  const slots = Array.from({ length: 5 }, (_, i) => {
    const existing = (team.roster ?? []).find((r) => r.position === i + 1);
    return existing ?? { position: i + 1 };
  });

  const filledCount = slots.filter((s) => s.player_discord_id).length;

  return (
    <div className="bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden">
      {/* Team header */}
      <div className="h-2" style={{ backgroundColor: team.color }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
              <span className="text-xs text-slate-500 font-mono">Team #{team.team_number}</span>
            </div>
            <h3 className="text-lg font-bold text-white">{team.name}</h3>
            <p className="text-sm text-slate-400">{team.captain_name}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-0.5">포인트</div>
            <div className="text-lg font-bold text-white">
              {(team.current_points ?? team.initial_points).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Roster progress */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(filledCount / 5) * 100}%`, backgroundColor: team.color }}
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">{filledCount}/5</span>
        </div>

        {/* Roster slots */}
        <div className="grid grid-cols-1 gap-2">
          {slots.map((slot) => (
            <RosterSlotCard
              key={slot.position}
              slot={slot}
              teamId={team.id}
              tournamentId={tournamentId}
              onUpdated={onUpdated}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Create Team Modal ────────────────────────────────────────────────────────

interface CreateTeamModalProps {
  tournamentId: string;
  onClose: () => void;
  onCreated: (team: Team) => void;
}

const PRESET_COLORS = ['#FF4655', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

function CreateTeamModal({ tournamentId, onClose, onCreated }: CreateTeamModalProps) {
  const [form, setForm] = useState<CreateTeamPayload>({
    team_number: 1,
    name: '',
    captain_name: '',
    captain_discord_icon_url: '',
    color: '#FF4655',
    initial_points: 100000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof CreateTeamPayload>(key: K, value: CreateTeamPayload[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.captain_name.trim()) {
      setError('팀 이름과 팀장 이름은 필수입니다.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const team = await createTeam(tournamentId, form);
      onCreated(team);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? '팀 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0c12] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-400/10 flex items-center justify-center">
              <Users className="text-blue-400" size={18} />
            </div>
            <h3 className="text-lg font-bold text-white">팀 생성</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">팀 번호 *</label>
              <input
                id="team-number"
                type="number"
                min={1}
                value={form.team_number}
                onChange={(e) => set('team_number', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF4655] transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">초기 포인트</label>
              <input
                id="team-initial-points"
                type="number"
                min={0}
                value={form.initial_points}
                onChange={(e) => set('initial_points', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF4655] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">팀 이름 *</label>
            <input
              id="team-name"
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Team Alpha"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">팀장 이름 *</label>
            <input
              id="team-captain-name"
              type="text"
              value={form.captain_name}
              onChange={(e) => set('captain_name', e.target.value)}
              placeholder="소누캡틴"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">팀장 Discord 아바타 URL (선택)</label>
            <input
              id="team-captain-avatar"
              type="url"
              value={form.captain_discord_icon_url}
              onChange={(e) => set('captain_discord_icon_url', e.target.value)}
              placeholder="https://cdn.discordapp.com/avatars/..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">팀 컬러</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('color', c)}
                  className={`w-8 h-8 rounded-full transition-all border-2 ${form.color === c ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={form.color}
                onChange={(e) => set('color', e.target.value)}
                className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-2 border-white/20 p-0 overflow-hidden"
                title="커스텀 컬러"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors text-sm">
              취소
            </button>
            <button
              id="submit-create-team"
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              팀 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TeamManagement() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTeams = useCallback(async () => {
    if (!tournamentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTeams(tournamentId);
      setTeams(data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? '팀 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleCreated = (team: Team) => {
    setTeams((prev) => [...prev, team]);
    setShowCreateModal(false);
  };

  return (
    <div>
      {showCreateModal && tournamentId && (
        <CreateTeamModal
          tournamentId={tournamentId}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <Link to="/admin/tournaments" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} /> Tournament Management
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-1">팀 관리</h2>
            <p className="text-slate-500 font-mono text-sm">Tournament ID: {tournamentId}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTeams}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
              title="새로고침"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
            </button>
            <button
              id="open-create-team-modal"
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap text-sm"
            >
              <Plus size={16} /> 팀 생성
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      {loading && teams.length === 0 ? (
        <div className="flex items-center justify-center py-32 text-slate-500">
          <Loader2 size={28} className="animate-spin mr-3" />
          <span>팀 정보를 불러오는 중...</span>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-32 text-slate-500">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm">팀이 없습니다. 먼저 팀을 생성하세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              tournamentId={tournamentId ?? ''}
              onUpdated={fetchTeams}
            />
          ))}
        </div>
      )}
    </div>
  );
}
