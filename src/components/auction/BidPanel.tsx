import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRoomStore, selectAuction, selectMyTeam, selectIsMyTeamHighest } from '../../store/roomStore';
import { useTranslation } from '../../i18n';
import { Plus, Minus, TrendingUp, CheckCircle } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

// Quick bid increment options
const QUICK_BID_AMOUNTS = [50, 100, 200];

/**
 * BidPanel
 * 입찰 패널 - Quick Bid 버튼 + 커스텀 금액 입력
 * - 최고 입찰자가 내 팀이면 "현재 최고입찰" 배지 표시
 * - 잔액 부족 시 버튼 비활성화
 * - 낙찰/유찰 시 적절한 상태 메시지 표시
 */
export function BidPanel() {
  const { t } = useTranslation();
  const auction = useRoomStore(selectAuction);
  const myTeam = useRoomStore(selectMyTeam);
  const isMyTeamHighest = useRoomStore(selectIsMyTeamHighest);
  const placeBid = useRoomStore((s) => s.placeBid);

  const [customAmount, setCustomAmount] = useState<string>('');
  const bidValueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (bidValueRef.current && auction.currentHighestBid > auction.startingBid) {
      const color = isMyTeamHighest ? '#10b981' : '#FF4655'; // Emerald if mine, Red if others
      gsap.fromTo(bidValueRef.current,
        { scale: 1.4, color: color },
        { scale: 1, color: '#f1f5f9', duration: 0.5, ease: 'back.out(2)' }
      );
    }
  }, [auction.currentHighestBid, isMyTeamHighest, auction.startingBid]);

  const isActive = auction.status === 'active';
  const canBid = isActive && !!myTeam;

  // 다음 최소 입찰가
  const minNextBid = auction.currentHighestBid + auction.minBidIncrement;

  const handleQuickBid = (increment: number) => {
    if (!myTeam || !canBid) return;
    const amount = auction.currentHighestBid + increment;
    if (amount > myTeam.remainingPoints) return;
    placeBid(myTeam.id, amount);
  };

  const handleCustomBid = () => {
    if (!myTeam || !canBid) return;
    const amount = parseInt(customAmount, 10);
    if (isNaN(amount) || amount < minNextBid) return;
    if (amount > myTeam.remainingPoints) return;
    placeBid(myTeam.id, amount);
    setCustomAmount('');
  };

  // ── 낙찰/유찰 상태 화면 ──────────────────────
  if (auction.status === 'sold' || auction.status === 'no_bid') {
    const isSoldToMe =
      auction.status === 'sold' &&
      auction.currentHighestTeamId === myTeam?.id;

    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 py-8 border ${
          isSoldToMe
            ? 'border-[#FF4655]/40 bg-[#FF4655]/5'
            : 'border-slate-800 bg-slate-900/50'
        }`}
      >
        {auction.status === 'sold' ? (
          <>
            <CheckCircle
              size={28}
              className={isSoldToMe ? 'text-[#FF4655]' : 'text-slate-500'}
            />
            <p className={`text-sm font-semibold ${isSoldToMe ? 'text-[#FF4655]' : 'text-slate-400'}`}>
              {isSoldToMe
                ? `🎉 ${t.auction.bid.soldToMe} — ${auction.currentHighestBid.toLocaleString()} P`
                : `${t.auction.bid.sold} — ${auction.currentHighestBid.toLocaleString()} P`}
            </p>
          </>
        ) : (
          <p className="text-slate-500 text-sm">{t.auction.bid.noBid}</p>
        )}
      </div>
    );
  }

  // ── 경매 대기 상태 ────────────────────────────
  if (auction.status === 'idle' || auction.status === 'shuffling') {
    return (
      <div className="flex items-center justify-center py-8 border border-slate-800">
        <p className="text-slate-600 text-sm">{t.auction.bid.waitingNext}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-gradient-to-br from-[#FF4655]/30 to-[#b51421]/30 border border-[#FF4655]/50 h-full">
      {/* Top area: Timer and Current Bid */}
      <div className="flex items-center justify-between">
        <CountdownTimer />
        <div className="text-right">
          <p className="text-[#FF4655] text-[10px] uppercase tracking-widest font-bold mb-0.5 shadow-sm">
            {t.auction.bid.highestBid}
          </p>
          <span ref={bidValueRef} className="text-4xl font-bold font-mono text-white drop-shadow-[0_0_8px_rgba(255,70,85,0.8)]">
            {auction.currentHighestBid.toLocaleString()}
          </span>
          <span className="text-white/70 text-sm ml-1 font-mono">P</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        {isMyTeamHighest ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/20 px-2 py-1 rounded-sm">
            <TrendingUp size={12} />
            {t.auction.bid.myTeamHighest}
          </div>
        ) : (
          auction.currentHighestTeamId ? (
            <p className="text-white/60 font-semibold uppercase tracking-wider">
              {auction.currentHighestTeamId.replace('team-', '')} {t.auction.bid.teamBidding}
            </p>
          ) : <div/>
        )}
        <p className="text-white/50 font-mono">
          {t.auction.bid.nextMinBid}: {minNextBid.toLocaleString()} P
        </p>
      </div>

      {/* My team remaining points */}
      {myTeam && (
        <div className="flex items-center justify-between px-3 py-2 bg-black/40 border border-white/10 rounded-sm mt-auto">
          <span className="text-white/60 text-xs font-semibold">{t.auction.bid.remainingPoints}</span>
          <span
            className="font-mono text-sm font-bold text-yellow-400 drop-shadow-sm"
          >
            {myTeam.remainingPoints.toLocaleString()} P
          </span>
        </div>
      )}

      {/* Custom Amount Input (Chat-like) */}
      <div className="flex gap-2">
        <div className="flex flex-1 border border-white/20 bg-black/60 focus-within:border-white/60 transition-colors duration-200 px-4 rounded-sm shadow-inner">
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCustomBid();
            }}
            placeholder={`${minNextBid} ${t.auction.bid.orMore}`}
            className="flex-1 bg-transparent text-left text-white text-base font-mono placeholder:text-white/30 outline-none py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button
          onClick={handleCustomBid}
          disabled={
            !canBid ||
            !customAmount ||
            parseInt(customAmount) < minNextBid ||
            (myTeam ? parseInt(customAmount) > myTeam.remainingPoints : true)
          }
          className={`px-8 py-3 text-sm font-black uppercase tracking-widest transition-all duration-150 rounded-sm ${
            canBid &&
            customAmount &&
            parseInt(customAmount) >= minNextBid &&
            (!myTeam || parseInt(customAmount) <= myTeam.remainingPoints)
              ? 'bg-white text-[#FF4655] hover:bg-slate-200 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
              : 'bg-black/40 text-white/30 border border-white/10 cursor-not-allowed'
          }`}
        >
          {t.auction.bid.placeBid}
        </button>
      </div>
    </div>
  );
}
