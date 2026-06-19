import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Users, Search, Trophy, X, Loader2, RefreshCw, Shuffle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  createTournament,
  getTournament,
  shuffle,
  type Tournament,
  type CreateTournamentPayload,
} from '../../api/tournaments';

// ─── Create Tournament Modal ──────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreated: (t: Tournament) => void;
}

function CreateTournamentModal({ onClose, onCreated }: CreateModalProps) {
  const [form, setForm] = useState<CreateTournamentPayload>({
    name: '',
    subtitle: '',
    prize: '',
    date: '',
    slots: '',
    bg_image: '',
    rules: [''],
    invite_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof CreateTournamentPayload, value: string | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleRuleChange = (idx: number, value: string) => {
    const rules = [...(form.rules ?? [])];
    rules[idx] = value;
    set('rules', rules);
  };

  const addRule = () => set('rules', [...(form.rules ?? []), '']);
  const removeRule = (idx: number) => {
    const rules = (form.rules ?? []).filter((_, i) => i !== idx);
    set('rules', rules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('대회 이름은 필수입니다.'); return; }
    setLoading(true);
    setError(null);
    try {
      const payload: CreateTournamentPayload = {
        ...form,
        rules: form.rules?.filter((r) => r.trim()) ?? [],
      };
      const t = await createTournament(payload);
      onCreated(t);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? '대회 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0a0c12] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF4655]/10 flex items-center justify-center">
              <Trophy className="text-[#FF4655]" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">새 대회 생성</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name (required) */}
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">
              대회 이름 <span className="text-[#FF4655]">*</span>
            </label>
            <input
              id="tournament-name"
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="SONU 발로란트 커스텀 #1"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subtitle */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">서브타이틀</label>
              <input
                id="tournament-subtitle"
                type="text"
                value={form.subtitle}
                onChange={(e) => set('subtitle', e.target.value)}
                placeholder="시즌 1 오픈 대회"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
              />
            </div>
            {/* Prize */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">상금/경품</label>
              <input
                id="tournament-prize"
                type="text"
                value={form.prize}
                onChange={(e) => set('prize', e.target.value)}
                placeholder="상금 10만원"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
              />
            </div>
            {/* Date */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">일정</label>
              <input
                id="tournament-date"
                type="text"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                placeholder="2026-07-01 ~ 2026-07-01"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
              />
            </div>
            {/* Slots */}
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">슬롯</label>
              <input
                id="tournament-slots"
                type="text"
                value={form.slots}
                onChange={(e) => set('slots', e.target.value)}
                placeholder="팀장 5명 / 팀원 20명"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
              />
            </div>
          </div>

          {/* bg_image */}
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">배경 이미지 URL</label>
            <input
              id="tournament-bg-image"
              type="url"
              value={form.bg_image}
              onChange={(e) => set('bg_image', e.target.value)}
              placeholder="https://example.com/banner.png"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>

          {/* invite_code */}
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">초대 코드</label>
            <input
              id="tournament-invite-code"
              type="text"
              value={form.invite_code}
              onChange={(e) => set('invite_code', e.target.value)}
              placeholder="SONU2026"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>

          {/* rules */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">규칙</label>
            <div className="space-y-2">
              {(form.rules ?? []).map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(idx, e.target.value)}
                    placeholder={`규칙 ${idx + 1}`}
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(idx)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRule}
                className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> 규칙 추가
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-colors"
            >
              취소
            </button>
            <button
              id="submit-create-tournament"
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-[#FF4655] hover:bg-[#ff5c69] text-white font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              대회 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tournament Row ───────────────────────────────────────────────────────────

interface TournamentRowProps {
  tournament: Tournament;
  onShuffle: (id: number) => Promise<void>;
}

function TournamentRow({ tournament, onShuffle }: TournamentRowProps) {
  const [shuffling, setShuffling] = useState(false);

  const getStatusBadge = (status: Tournament['status']) => {
    switch (status) {
      case 'WAITING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 uppercase tracking-wider">Waiting</span>;
      case 'BIDDING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/20 uppercase tracking-wider">Bidding</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">Completed</span>;
    }
  };

  const handleShuffle = async () => {
    setShuffling(true);
    try {
      await onShuffle(tournament.id);
    } finally {
      setShuffling(false);
    }
  };

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      <td className="px-6 py-4">
        <div className="font-bold text-white">{tournament.name}</div>
        {tournament.subtitle && <div className="text-xs text-slate-500 mt-0.5">{tournament.subtitle}</div>}
        <div className="text-xs text-slate-600 font-mono mt-1">ID: {tournament.id}</div>
      </td>
      <td className="px-6 py-4">{getStatusBadge(tournament.status)}</td>
      <td className="px-6 py-4 text-sm text-slate-300">{tournament.date ?? '—'}</td>
      <td className="px-6 py-4 text-sm text-[#FF4655] font-medium">{tournament.prize ?? '—'}</td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1.5">
          {/* Shuffle — only when WAITING */}
          {tournament.status === 'WAITING' && (
            <button
              onClick={handleShuffle}
              disabled={shuffling}
              title="셔플 시작"
              className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded transition-colors disabled:opacity-50"
            >
              {shuffling ? <Loader2 size={16} className="animate-spin" /> : <Shuffle size={16} />}
            </button>
          )}
          {/* Participants */}
          <Link
            to={`/admin/tournaments/${tournament.id}/users`}
            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
            title="참가자 관리"
          >
            <Users size={16} />
          </Link>
          {/* Teams */}
          <Link
            to={`/admin/tournaments/${tournament.id}/teams`}
            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
            title="팀 관리"
          >
            <ChevronRight size={16} />
          </Link>
          {/* Edit (placeholder) */}
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="편집">
            <Edit2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TournamentManagement() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [search, setSearch] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchTournament = useCallback(async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const t = await getTournament(id.trim());
      setTournaments((prev) => {
        const exists = prev.find((x) => x.id === t.id);
        return exists ? prev.map((x) => (x.id === t.id ? t : x)) : [t, ...prev];
      });
    } catch {
      setError(`대회 ID "${id}"를 찾을 수 없습니다.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTournament(lookupId);
  };

  const handleShuffle = async (id: number) => {
    await shuffle(id);
    await fetchTournament(String(id));
  };

  const handleCreated = (t: Tournament) => {
    setTournaments((prev) => [t, ...prev]);
    setShowCreateModal(false);
  };

  const filtered = tournaments.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      String(t.id).includes(search)
  );

  return (
    <div>
      {showCreateModal && (
        <CreateTournamentModal onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Tournament Management</h2>
          <p className="text-slate-400">대회 생성, 셔플, 참가자 및 팀 관리.</p>
        </div>
        <button
          id="open-create-tournament-modal"
          onClick={() => setShowCreateModal(true)}
          className="bg-[#FF4655] hover:bg-[#ff5c69] text-white px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap self-start"
        >
          <Plus size={20} /> Create Tournament
        </button>
      </div>

      {/* Lookup + Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            id="tournament-lookup-id"
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="대회 ID 입력 (예: 1)"
            className="bg-[#0f1117] border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#FF4655] text-white w-44"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          </button>
        </form>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            id="tournament-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색..."
            className="w-full bg-[#0f1117] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#FF4655] text-white"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Trophy size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">대회 ID를 입력해 조회하거나 새 대회를 생성하세요.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">이름</th>
                <th className="px-6 py-4 font-medium">상태</th>
                <th className="px-6 py-4 font-medium">일정</th>
                <th className="px-6 py-4 font-medium">상금</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <TournamentRow key={t.id} tournament={t} onShuffle={handleShuffle} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
