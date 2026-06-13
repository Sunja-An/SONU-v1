import { useAuctionTimer } from '../../hooks/useAuctionTimer';
import { useRoomStore } from '../../store/roomStore';
import { Clock, AlertTriangle } from 'lucide-react';

/**
 * CountdownTimer
 * 경매 남은 시간 표시 컴포넌트.
 * - 5초 미만: 레드 점멸 애니메이션 적용
 * - 30% 미만 시간: 주황빛 경고 색상
 */
export function CountdownTimer() {
  const { timeRemaining, isCritical } = useAuctionTimer();

  const formatTime = (s: number) => String(s).padStart(2, '0');
  
  const totalTime = useRoomStore((s) => s.auction.totalTime);

  const progressPct = Math.max(
    0,
    (timeRemaining / totalTime) * 100
  );

  const barColor =
    timeRemaining <= 5
      ? '#FF4655'
      : timeRemaining <= 10
      ? '#f97316'
      : '#22c55e';

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Time display */}
      <div className="flex items-center gap-2">
        {isCritical ? (
          <AlertTriangle
            size={16}
            className="text-[#FF4655] animate-[timer-blink_0.5s_ease-in-out_infinite]"
          />
        ) : (
          <Clock size={16} className="text-slate-500" />
        )}
        <span
          className={`font-mono text-4xl font-bold tabular-nums tracking-tight transition-colors duration-300 ${
            isCritical
              ? 'text-[#FF4655] animate-[timer-blink_0.5s_ease-in-out_infinite] val-glow-text'
              : timeRemaining <= 10
              ? 'text-orange-400'
              : 'text-slate-100'
          }`}
        >
          {formatTime(timeRemaining)}
        </span>
        <span className="text-slate-600 font-mono text-sm self-end mb-1">s</span>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-[3px] bg-slate-800 rounded-none overflow-hidden">
        <div
          className="h-full transition-colors duration-300 rounded-none"
          style={{
            width: `${progressPct}%`,
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />
      </div>
    </div>
  );
}
