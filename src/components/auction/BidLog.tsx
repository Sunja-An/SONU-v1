import { useRoomStore, selectBidLog } from '../../store/roomStore';
import { useTranslation } from '../../i18n';

/**
 * BidLog
 * 실시간 입찰 기록 리스트
 * - 새 입찰 발생 시 상단에 추가 + fade-in-up 애니메이션
 * - 최신 항목이 상단에 위치
 * TODO: WebSocket 'bid_placed' 이벤트 → addBidEntry() 호출로 실시간 갱신
 */
export function BidLog() {
  const { t } = useTranslation();
  const bidLog = useRoomStore(selectBidLog);
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        className="flex-1 overflow-y-auto flex flex-col-reverse gap-4 min-h-0 px-2 py-2"
      >
        {bidLog.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-600 text-sm py-6">
            まだ入札記録がありません。
          </div>
        ) : (
          bidLog.map((entry, idx) => {
            const isLatest = idx === 0;
            return (
              <div
                key={entry.id}
                className={`flex items-start gap-3 w-full ${
                  isLatest ? 'animate-[fade-in-up_0.3s_ease-out_forwards]' : ''
                }`}
              >
                {/* Team Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black shadow-md border border-slate-900"
                  style={{ backgroundColor: entry.teamColor, color: '#000' }}
                >
                  {entry.teamName.slice(0, 2)}
                </div>

                {/* Chat Message Body */}
                <div className="flex flex-col min-w-0 max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1 pl-1">
                    <span
                      className="text-xs font-bold tracking-wider"
                      style={{ color: entry.teamColor }}
                    >
                      {entry.teamName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>

                  <div className={`px-4 py-2.5 rounded-2xl rounded-tl-sm inline-block shadow-md border ${isLatest ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-slate-800/80'}`}>
                    <p className="text-slate-200 text-sm">
                      <span className="font-mono font-bold text-[#FF4655] mr-1">{entry.amount.toLocaleString()} P</span>
                      <span>入札しました！</span>
                    </p>
                  </div>
                  
                  {isLatest && (
                    <div className="pl-1 mt-1">
                      <span className="text-[9px] text-[#FF4655] font-bold uppercase tracking-widest px-1.5 py-0.5 border border-[#FF4655]/30 bg-[#FF4655]/10 rounded">
                        {t.auction.log.top}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
