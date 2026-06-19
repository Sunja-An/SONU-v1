import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRoomStore, selectAuction } from '../../store/roomStore';

export function ShuffleRevealOverlay() {
  const auction = useRoomStore(selectAuction);
  const playerPool = useRoomStore((s) => s.playerPool);
  const setAuctionState = useRoomStore((s) => s.setAuctionState);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (auction.status === 'shuffling') {
      const tl = gsap.timeline({
        onComplete: () => {
          // 애니메이션 종료 후 1초 대기 후 active 상태로 전환
          setTimeout(() => {
            setAuctionState({ status: 'active' });
          }, 1500);
        }
      });

      // 초기: 모든 카드가 뒤집혀 있는 상태
      gsap.set(cardsRef.current, { rotationY: 180, opacity: 0, scale: 0.8 });
      gsap.set(containerRef.current, { display: 'flex', opacity: 1 });

      // 카드 나타나기 -> 순차적으로 앞면으로 뒤집기
      tl.to(cardsRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }).to(cardsRef.current, {
        rotationY: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      }, "+=0.3");
    } else {
      gsap.to(containerRef.current, { opacity: 0, duration: 0.5, onComplete: () => {
        if (containerRef.current) containerRef.current.style.display = 'none';
      }});
    }
  }, [auction.status, setAuctionState]);

  if (auction.status !== 'shuffling' && auction.status !== 'idle') return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0a0b0f]/95 flex flex-col items-center justify-center p-10 backdrop-blur-sm hidden"
    >
      <h2 className="text-3xl font-bold text-white mb-8 tracking-widest uppercase">
        <span className="text-[#FF4655]">Player</span> Shuffle Result
      </h2>
      
      <div className="flex flex-wrap gap-4 justify-center max-w-5xl">
        {playerPool.map((player, index) => (
          <div 
            key={player.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            className="relative w-32 h-44 bg-slate-900 border border-slate-700 overflow-hidden perspective-1000 transform-style-3d"
          >
            {/* Front (Player info) */}
            <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center bg-slate-800 p-2">
              <span className="absolute top-1 left-1 text-[10px] text-[#FF4655] font-mono font-bold">
                #{index + 1}
              </span>
              <img 
                src={player.agentImageUrl} 
                alt={player.name} 
                className="w-16 h-16 object-contain mb-2 opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-xs font-bold text-slate-200 truncate w-full text-center">{player.name}</span>
              <span className="text-[10px] text-slate-400 mt-1">{player.tier}</span>
            </div>
            
            {/* Back (Cover) */}
            <div 
              className="absolute inset-0 backface-hidden bg-slate-950 border border-[#FF4655]/50 flex items-center justify-center"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="w-8 h-8 border-2 border-[#FF4655] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-[#FF4655] rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
