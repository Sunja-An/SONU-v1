import { useEffect } from 'react';
import gsap from 'gsap';
import { PlayerCard } from '../components/auction/PlayerCard';
import { CountdownTimer } from '../components/auction/CountdownTimer';
import { BidPanel } from '../components/auction/BidPanel';
import { BidLog } from '../components/auction/BidLog';
import { TeamRosterBoard } from '../components/sidebar/TeamRosterBoard';
import { useRoomStore, selectAuction } from '../store/roomStore';
import { useAuctionTimer } from '../hooks/useAuctionTimer';
import { useTranslation } from '../i18n';

import { ShuffleRevealOverlay } from '../components/auction/ShuffleRevealOverlay';
import { UpcomingPlayers } from '../components/auction/UpcomingPlayers';
import { RemainingList } from '../components/auction/RemainingList';

/**
 * AuctionRoom
 * ─────────────────────────────────────────
 * 경매장 메인 레이아웃 (3-column dashboard)
 *
 * ┌──────────────────────────────────────────────────┐
 * │                   RoomHeader                     │
 * ├─────────────────────────────┬────────────────────┤
 * │                             │                    │
 * │  [Top] PlayerCard + Timer   │  TeamRosterBoard   │
 * │                             │  (사이드바)          │
 * │  [Mid] BidPanel (입찰)       │                    │
 * │                             │                    │
 * │  [Bottom] BidLog (기록)      │                    │
 * │                             │                    │
 * └─────────────────────────────┴────────────────────┘
 *
 * WebSocket 연결 포인트:
 * - useEffect에서 소켓 초기화 및 이벤트 핸들러 등록
 * - 'auction_update' → setAuctionState()
 * - 'bid_placed'     → addBidEntry()
 * - 'teams_update'   → updateTeams()
 * - 'auction_start'  → startAuction()
 * - 'auction_end'    → endAuction()
 */
export function AuctionRoom() {
  const { t } = useTranslation();
  const auction = useRoomStore(selectAuction);
  const playerPool = useRoomStore((s) => s.playerPool);

  // CountdownTimer 컴포넌트 내부에서 useAuctionTimer 훅을 사용하므로 여기서 제거하여 2번씩 렌더링/초기화되는 버그 방지

  // 랜딩 페이지에서 넘어올 때 생성된 오버레이를 페이드아웃 후 제거
  useEffect(() => {
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => overlay.remove(),
      });
    }
  }, []);

  // 낙찰(Sold) 또는 자동 배정(Fly) 애니메이션 로직
  useEffect(() => {
    const isSold = auction.status === 'sold' && auction.currentHighestTeamId;
    const isAutoAssigned = auction.status === 'auto_assigned' && auction.autoAssignTarget;

    if (isSold || isAutoAssigned) {
      const sourceCard = document.getElementById('main-player-card');
      let targetElement: HTMLElement | null = null;

      if (isAutoAssigned && auction.autoAssignTarget) {
        targetElement = document.getElementById(`roster-slot-${auction.autoAssignTarget.teamId}-${auction.autoAssignTarget.position}`);
      } else if (isSold && auction.currentHighestTeamId) {
        // 방금 들어간 슬롯 찾기 (스토어가 업데이트되어 이미 로스터에 선수가 있음)
        const team = useRoomStore.getState().teams.find(t => t.id === auction.currentHighestTeamId);
        const slot = team?.roster.find(s => s.player?.id === auction.currentPlayer?.id);
        
        if (slot) {
          targetElement = document.getElementById(`roster-slot-${auction.currentHighestTeamId}-${slot.position}`);
          
          // 방금 들어간 슬롯의 내부 요소들을 잠시 숨김 (애니메이션이 도착할 때 나타나도록)
          if (targetElement) {
            const innerElements = targetElement.querySelectorAll('img, span, div:not(.absolute.inset-0)');
            gsap.set(innerElements, { opacity: 0 });
          }
        } else {
          targetElement = document.getElementById(`team-card-${auction.currentHighestTeamId}`);
        }
      }

      if (sourceCard && targetElement) {
        // Clone the source card
        const clone = sourceCard.cloneNode(true) as HTMLElement;
        const sourceRect = sourceCard.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        // Style the clone to match the exact position of the source
        clone.style.position = 'fixed';
        clone.style.top = `${sourceRect.top}px`;
        clone.style.left = `${sourceRect.left}px`;
        clone.style.width = `${sourceRect.width}px`;
        clone.style.height = `${sourceRect.height}px`;
        clone.style.margin = '0';
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.boxShadow = '0 0 40px rgba(255, 70, 85, 0.5)';
        clone.style.borderRadius = '16px';

        document.body.appendChild(clone);

        // Hide the original temporarily or fade it out
        gsap.to(sourceCard, { opacity: 0, duration: 0.3 });

        // Calculate center of target for fly-to destination
        const destTop = targetRect.top + targetRect.height / 2 - sourceRect.height / 4;
        const destLeft = targetRect.left + targetRect.width / 2 - sourceRect.width / 4;

        // Animate the clone to the target slot/team card
        gsap.to(clone, {
          top: destTop,
          left: destLeft,
          width: sourceRect.width / 2,
          height: sourceRect.height / 2,
          opacity: 0,
          scale: 0.2,
          rotation: 15,
          duration: 1.2,
          ease: 'power3.inOut',
          onComplete: () => {
            clone.remove();
            gsap.set(sourceCard, { opacity: 1 });
            
            if (targetElement) {
              const innerElements = targetElement.querySelectorAll('img, span, div:not(.absolute.inset-0)');
              gsap.to(innerElements, { opacity: 1, duration: 0.3, stagger: 0.1 });
              
              gsap.fromTo(targetElement, 
                { scale: 0.95 }, 
                { scale: 1, duration: 0.4, ease: "back.out(2)" }
              );
            }
          }
        });
      }
    }
  }, [auction.status, auction.autoAssignTarget, auction.currentHighestTeamId, auction.currentPlayer?.id]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0b0f] overflow-hidden relative">
      <ShuffleRevealOverlay />
      
      {/* ── Main Content ─────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ── Left Sidebar: Team Roster Board (50%) ─────── */}
        <aside className="w-1/2 flex-shrink-0 flex flex-col px-4 py-4 overflow-hidden border-r border-slate-800">
          <TeamRosterBoard />
        </aside>

        {/* ── Right: Main Auction Area (50%) ──────────────── */}
        <main className="w-1/2 min-w-0 grid grid-cols-2 grid-rows-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] gap-px bg-slate-800">
          
          {/* Top Left: Video/Stream Placeholder */}
          <section className="bg-[#0a0b0f] overflow-hidden flex flex-col relative group">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" 
              alt="Live Stream" 
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] to-transparent opacity-80" />
            <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 bg-black/60 border border-white/10 rounded-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF4655] animate-pulse shadow-[0_0_8px_#FF4655]" />
              <span className="text-white text-[10px] font-black tracking-widest uppercase">ライブ配信</span>
            </div>
            
            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4">
              <h3 className="text-white font-black text-2xl uppercase tracking-tighter drop-shadow-lg">VALORANT ドラフト</h3>
              <p className="text-white/60 font-mono text-xs uppercase tracking-widest mt-1">シーズン1 オークションステージ</p>
            </div>
          </section>

          {/* Top Right: Player Card */}
          <section className="bg-[#0a0b0f] overflow-hidden">
            <PlayerCard />
          </section>

          {/* Mid Left: Bid Panel (Now includes Timer inside) */}
          <section className="bg-[#0a0b0f] overflow-hidden">
            <BidPanel />
          </section>

          {/* Mid Right: Bid Log */}
          <section className="bg-[#0a0b0f] overflow-hidden">
            <BidLog />
          </section>

          {/* Bottom Left: Remaining List */}
          <section className="bg-[#0a0b0f] overflow-hidden">
            <RemainingList />
          </section>

          {/* Bottom Right: Upcoming Players */}
          <section className="bg-[#0a0b0f] overflow-hidden">
            <UpcomingPlayers />
          </section>

        </main>
      </div>
    </div>
  );
}
