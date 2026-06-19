import { useState, useCallback } from 'react';
import { Gavel, Play, SkipForward, CheckCircle, XCircle, Loader2, Trophy, Wifi, WifiOff, Search } from 'lucide-react';
import { startAuctionRoom, getAuctionRoom, type AuctionRoom } from '../../api/admin';
import {
  startNextAuction,
  finalizeAuction,
  getAuctionResults,
  type AuctionResult,
} from '../../api/tournaments';
import {
  useTournamentWebSocket,
  type AuctionItemStartedData,
  type BidPlacedData,
} from '../../hooks/useTournamentWebSocket';

// ─── Bid history item ─────────────────────────────────────────────────────────

interface BidEntry {
  team_nickname: string;
  amount: number;
  timestamp: string;
}

// ─── Start Auction Room Panel ─────────────────────────────────────────────────

interface StartRoomPanelProps {
  onRoomStarted: (room: AuctionRoom, tournamentId: string) => void;
}

function StartRoomPanel({ onRoomStarted }: StartRoomPanelProps) {
  const [tournamentId, setTournamentId] = useState('');
  const [startPrice, setStartPrice] = useState(10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId.trim()) { setError('대회 ID를 입력하세요.'); return; }
    setLoading(true);
    setError(null);
    try {
      const room = await startAuctionRoom({ tournament_id: tournamentId, start_price: startPrice });
      onRoomStarted(room, tournamentId);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string } } };
      if (e?.response?.status === 409) {
        setError('이미 경매가 진행 중입니다.');
      } else {
        setError(e?.response?.data?.message ?? '경매방 시작 실패');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[#0f1117] border border-white/5 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FF4655]/10 flex items-center justify-center mx-auto mb-4">
            <Gavel className="text-[#FF4655]" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">경매방 활성화</h3>
          <p className="text-slate-400 text-sm">대회 ID와 시작가를 설정하고 경매를 시작하세요.</p>
        </div>

        <form onSubmit={handleStart} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">대회 ID *</label>
            <input
              id="auction-tournament-id"
              type="text"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              placeholder="1"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1.5 block">시작가</label>
            <input
              id="auction-start-price"
              type="number"
              min={0}
              value={startPrice}
              onChange={(e) => setStartPrice(Number(e.target.value))}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
          )}
          <button
            id="submit-start-auction-room"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FF4655] hover:bg-[#ff5c69] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
            경매 시작
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Active Auction Panel ─────────────────────────────────────────────────────

interface ActiveAuctionPanelProps {
  room: AuctionRoom;
  tournamentId: string;
}

function ActiveAuctionPanel({ room, tournamentId }: ActiveAuctionPanelProps) {
  const [currentItem, setCurrentItem] = useState<AuctionItemStartedData | null>(null);
  const [bidHistory, setBidHistory] = useState<BidEntry[]>([]);
  const [topBid, setTopBid] = useState<BidPlacedData | null>(null);
  const [results, setResults] = useState<AuctionResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string>('경매를 시작할 준비가 되었습니다.');

  const { status: wsStatus } = useTournamentWebSocket({
    tournamentId,
    onShuffleStarted: () => setStatusMsg('🔀 셔플이 시작되었습니다...'),
    onShuffleResult: () => setStatusMsg('✅ 셔플 완료! 경매 순서가 배정되었습니다.'),
    onAuctionItemStarted: (data) => {
      setCurrentItem(data);
      setBidHistory([]);
      setTopBid(null);
      setStatusMsg(`🎯 경매 시작: ${data.nickname}`);
    },
    onBidPlaced: (data) => {
      setTopBid(data);
      setBidHistory((prev) => [
        { team_nickname: data.team_nickname, amount: data.amount, timestamp: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    },
    onAuctionWon: (data) => {
      setStatusMsg(`🏆 낙찰: ${data.player_nickname} → ${data.assigned_team_id} (${data.final_price.toLocaleString()}pt)`);
      setCurrentItem(null);
    },
    onAuctionFailed: () => {
      setStatusMsg('❌ 유찰 처리되었습니다.');
      setCurrentItem(null);
    },
    onRoundCompleted: (data) => {
      setStatusMsg(`라운드 종료. 유찰자 ${data.failed_players.length}명.`);
    },
    onSecondRoundStarted: () => setStatusMsg('🔄 2라운드 시작!'),
    onAuctionAllEnded: () => {
      setStatusMsg('🎉 모든 경매가 종료되었습니다!');
      setCurrentItem(null);
    },
  });

  const doAction = async (label: string, fn: () => Promise<void>) => {
    setActionLoading(label);
    setError(null);
    try {
      await fn();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? `${label} 실패`);
    } finally {
      setActionLoading(null);
    }
  };

  const loadResults = async () => {
    try {
      const data = await getAuctionResults(tournamentId);
      setResults(data);
      setShowResults(true);
    } catch {
      setError('결과 조회 실패');
    }
  };

  const ActionButton = ({
    id, label, icon: Icon, onClick, color = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10',
    disabled,
  }: {
    id: string;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    color?: string;
    disabled?: boolean;
  }) => (
    <button
      id={id}
      onClick={onClick}
      disabled={!!actionLoading || disabled}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${color}`}
    >
      {actionLoading === label ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
      {label}
    </button>
  );

  const wsIcon = wsStatus === 'connected' ? (
    <span className="flex items-center gap-1.5 text-xs text-emerald-400"><Wifi size={12} /> 연결됨</span>
  ) : wsStatus === 'connecting' ? (
    <span className="flex items-center gap-1.5 text-xs text-yellow-400"><Loader2 size={12} className="animate-spin" /> 연결 중</span>
  ) : (
    <span className="flex items-center gap-1.5 text-xs text-slate-500"><WifiOff size={12} /> 미연결</span>
  );

  return (
    <div className="space-y-6">
      {/* Room info bar */}
      <div className="bg-[#0f1117] border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Room ID</span>
            <span className="text-sm font-mono text-white">{room.id}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Tournament</span>
            <span className="text-sm font-mono text-white">{tournamentId}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">시작가</span>
            <span className="text-sm font-bold text-[#FF4655]">{room.start_price.toLocaleString()}pt</span>
          </div>
        </div>
        {wsIcon}
      </div>

      {/* Status message */}
      <div className="bg-black/30 border border-white/5 rounded-xl px-5 py-4 text-sm text-slate-300">
        {statusMsg}
      </div>

      {/* Control buttons */}
      <div className="bg-[#0f1117] border border-white/5 rounded-xl p-5">
        <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-4">운영자 컨트롤</h4>
        <div className="flex flex-wrap gap-3">
          <ActionButton
            id="btn-next-auction"
            label="다음 경매"
            icon={SkipForward}
            onClick={() => doAction('다음 경매', () => startNextAuction(tournamentId))}
            color="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
          />
          <ActionButton
            id="btn-finalize-won"
            label="낙찰"
            icon={CheckCircle}
            onClick={() => doAction('낙찰', () => finalizeAuction(tournamentId, true))}
            color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
            disabled={!currentItem}
          />
          <ActionButton
            id="btn-finalize-failed"
            label="유찰"
            icon={XCircle}
            onClick={() => doAction('유찰', () => finalizeAuction(tournamentId, false))}
            color="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
            disabled={!currentItem}
          />
          <ActionButton
            id="btn-load-results"
            label="결과 조회"
            icon={Trophy}
            onClick={loadResults}
            color="bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
          />
        </div>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current auction item */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-5">
          <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-4">현재 경매 대상</h4>
          {currentItem ? (
            <div className="flex items-center gap-4">
              {currentItem.avatar_url ? (
                <img src={currentItem.avatar_url} alt="" className="w-14 h-14 rounded-full border border-white/10 object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-slate-400">
                  {currentItem.nickname[0]}
                </div>
              )}
              <div>
                <div className="text-lg font-bold text-white">{currentItem.nickname}</div>
                {currentItem.rank && (
                  <div className="text-sm text-slate-400">{currentItem.rank} {currentItem.tier}</div>
                )}
                {currentItem.main_agent && (
                  <div className="text-sm text-slate-500">{currentItem.main_agent}</div>
                )}
                <div className="mt-2 text-sm font-bold text-[#FF4655]">
                  시작가: {currentItem.start_price.toLocaleString()}pt
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-600 text-sm">경매 대기 중</div>
          )}

          {/* Top bid */}
          {topBid && (
            <div className="mt-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
              <div className="text-xs text-emerald-400/60 mb-1">최고 입찰</div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{topBid.team_nickname}</span>
                <span className="font-bold text-emerald-400 text-lg">{topBid.amount.toLocaleString()}pt</span>
              </div>
            </div>
          )}
        </div>

        {/* Bid history */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-5">
          <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-4">입찰 히스토리</h4>
          {bidHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-600 text-sm">입찰 내역 없음</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {bidHistory.map((b, i) => (
                <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg ${i === 0 ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/[0.02]'}`}>
                  <span className="text-sm font-semibold text-white">{b.team_nickname}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${i === 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {b.amount.toLocaleString()}pt
                    </span>
                    <span className="text-xs text-slate-600">{b.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-5">
          <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Trophy size={14} className="text-yellow-400" /> 낙찰 결과
          </h4>
          {results.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-4">낙찰 결과 없음</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-white/5">
                    <th className="pb-3 text-left font-medium">플레이어</th>
                    <th className="pb-3 text-left font-medium">배정 팀</th>
                    <th className="pb-3 text-right font-medium">낙찰가</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-3 text-white font-medium">{r.player_nickname ?? r.player_discord_id}</td>
                      <td className="py-3 text-slate-400 font-mono text-xs">{r.assigned_team_id}</td>
                      <td className="py-3 text-right font-bold text-[#FF4655]">{r.final_price.toLocaleString()}pt</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AuctionManagement() {
  const [activeRoom, setActiveRoom] = useState<AuctionRoom | null>(null);
  const [activeTournamentId, setActiveTournamentId] = useState<string>('');
  const [lookupRoomId, setLookupRoomId] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleRoomStarted = useCallback((room: AuctionRoom, tid: string) => {
    setActiveRoom(room);
    setActiveTournamentId(tid);
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupRoomId.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    try {
      const room = await getAuctionRoom(lookupRoomId.trim());
      setActiveRoom(room);
      setActiveTournamentId(String(room.tournament_id));
    } catch {
      setLookupError('경매방을 찾을 수 없습니다.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gavel className="text-[#FF4655]" size={24} />
            Auction Management
          </h2>
          <p className="text-slate-400 text-sm mt-1">경매방 생성, 실시간 제어, 낙찰/유찰 처리.</p>
        </div>
        {activeRoom && (
          <button
            onClick={() => { setActiveRoom(null); setActiveTournamentId(''); }}
            className="text-sm text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            경매방 변경
          </button>
        )}
      </div>

      {/* Room lookup */}
      {!activeRoom && (
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-3">기존 경매방 ID로 재연결</p>
          <form onSubmit={handleLookup} className="flex gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                id="lookup-room-id"
                type="text"
                value={lookupRoomId}
                onChange={(e) => setLookupRoomId(e.target.value)}
                placeholder="Room ID 입력"
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-[#FF4655] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={lookupLoading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 text-sm transition-colors disabled:opacity-50"
            >
              {lookupLoading ? <Loader2 size={14} className="animate-spin" /> : '조회'}
            </button>
          </form>
          {lookupError && <p className="mt-2 text-red-400 text-xs">{lookupError}</p>}
        </div>
      )}

      {activeRoom ? (
        <ActiveAuctionPanel room={activeRoom} tournamentId={activeTournamentId} />
      ) : (
        <StartRoomPanel onRoomStarted={handleRoomStarted} />
      )}
    </div>
  );
}
