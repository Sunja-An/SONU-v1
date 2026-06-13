import { useRoomStore } from '../../store/roomStore';
import { User } from 'lucide-react';
import { useTranslation } from '../../i18n';

export function UpcomingPlayers() {
  const { t } = useTranslation();
  const playerPool = useRoomStore((s) => s.playerPool);

  return (
    <div className="flex flex-col h-full bg-slate-900/40 p-4 border-l border-t border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-4 bg-[#FF4655]" />
        <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">
          {t.auction.nextScheduled}
        </span>
      </div>
      
      <div className="flex-1 flex justify-around items-center gap-2">
        {playerPool.slice(0, 4).map((p, i) => (
          <div key={p.id} className="flex flex-col items-center justify-center gap-2 flex-1 max-w-[80px]">
            <div className="relative w-full aspect-square border border-slate-700 bg-slate-800/50 flex items-center justify-center overflow-hidden shadow-lg">
              <span className="absolute top-1 left-1 text-[8px] font-black text-[#FF4655] z-20 bg-black/60 px-1 rounded">
                #{i + 1}
              </span>
              {p.discordIconUrl ? (
                <img src={p.discordIconUrl} alt="Player" className="w-full h-full object-cover opacity-80" />
              ) : (
                <User size={24} className="text-slate-600" />
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-300 w-full text-center truncate px-1">
              {p.discordName || p.name}
            </span>
          </div>
        ))}
        {playerPool.length === 0 && (
          <div className="text-xs text-slate-600 italic">待機中の選手はいません</div>
        )}
      </div>
    </div>
  );
}
