import { useRoomStore, selectTeams } from '../../store/roomStore';
import { useTranslation } from '../../i18n';
import { User, Coins } from 'lucide-react';
import type { ValorantRole } from '../../types';

// Position to role label mapping (fixed 5-slot roster)
const POSITION_LABELS: Record<number, ValorantRole> = {
  1: 'Duelist',
  2: 'Initiator',
  3: 'Controller',
  4: 'Sentinel',
  5: 'Sentinel',
};

const ROLE_SHORT: Record<ValorantRole, string> = {
  Duelist: 'DL',
  Initiator: 'IN',
  Controller: 'CT',
  Sentinel: 'SE',
};

const INITIAL_POINTS = 1000; // 팀당 초기 포인트

/**
 * TeamRosterBoard
 * 사이드바 - 팀별 로스터 현황 + 잔여 포인트
 * - 팀 컬러 기반 액센트 라인
 * - 포인트 소진율 시각화 (progress bar)
 * TODO: WebSocket 'teams_update' 이벤트 → updateTeams() 호출로 실시간 갱신
 */
export function TeamRosterBoard() {
  const { t } = useTranslation();
  const teams = useRoomStore(selectTeams);
  const myTeamId = useRoomStore((s) => s.myTeamId);

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 hide-scrollbar pb-24">
      {teams.map((team) => {
        const isMyTeam = team.id === myTeamId;
        const filledSlots = team.roster.filter((s) => s.player !== null).length;

        return (
          <div
            id={`team-card-${team.id}`}
            key={team.id}
            className={`relative flex items-stretch border-l-[6px] shadow-lg overflow-hidden transition-all duration-200 flex-shrink-0 ${
              isMyTeam ? 'ring-2 ring-white z-10 scale-[1.01]' : ''
            }`}
            style={{
               borderLeftColor: team.color, 
               backgroundColor: `${team.color}20`,
               height: '140px'
            }}
          >
            {/* Background gradient/glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-slate-900/30 pointer-events-none" />

            {/* Left section: Team Leader */}
            <div className="relative flex flex-col items-center justify-center w-24 md:w-32 py-2 px-2 border-r border-white/10 bg-black/30 flex-shrink-0">
               {team.captainDiscordIconUrl ? (
                 <img src={team.captainDiscordIconUrl} alt={team.captainName} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 shadow-md mb-2 object-cover" style={{ borderColor: team.color }} />
               ) : (
                 <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-800 flex items-center justify-center border-2 mb-2" style={{ borderColor: team.color }}>
                   <User size={24} className="text-slate-500" />
                 </div>
               )}
               <span className="px-2 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded text-white border border-white/20 w-full text-center truncate mb-1" style={{ backgroundColor: `${team.color}80` }}>
                 {team.name}
               </span>
               <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center px-1">
                 {team.captainName}
               </span>
            </div>

            {/* Right section: 5 Slots */}
            <div className="relative flex-1 flex flex-col p-2 md:p-3 min-w-0">
              {/* Header inside the slot area (Points & Slots count) */}
              <div className="flex justify-between items-center mb-2 px-1 flex-shrink-0">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <Coins size={12} className="text-yellow-400/80" />
                  <span className="text-slate-200 font-bold">{team.remainingPoints.toLocaleString()}</span> P
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  スロット: <span className="text-slate-200">{filledSlots}</span> / 5
                </div>
              </div>

              {/* Slots Row */}
              <div className="flex flex-1 items-stretch justify-between gap-1.5 md:gap-2 px-1 min-h-0">
                {team.roster.map((slot) => {
                  const isFilled = !!slot.player;
                  return (
                    <div
                      id={`roster-slot-${team.id}-${slot.position}`}
                      key={slot.position}
                      className={`flex-1 flex flex-col items-center justify-center border border-white/10 rounded-sm transition-all duration-300 relative overflow-hidden h-full ${
                        isFilled ? 'bg-black/50 shadow-inner' : 'bg-black/20'
                      }`}
                    >
                      {/* Slot Position Number (Watermark) */}
                      {!isFilled && (
                        <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white/5 pointer-events-none select-none">
                          {slot.position}
                        </span>
                      )}

                      {isFilled ? (
                        <>
                          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: team.color }} />
                          {slot.player!.discordIconUrl ? (
                            <img src={slot.player!.discordIconUrl} alt="Player" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 z-10 shadow-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/20 z-10">
                              <User size={16} className="text-slate-400" />
                            </div>
                          )}
                          <span className="mt-2 text-[9px] md:text-[10px] font-bold text-slate-200 truncate w-full text-center px-1 z-10">
                            {slot.player!.discordName || slot.player!.name}
                          </span>
                          <span className="mt-0.5 text-[8px] font-mono text-slate-500 z-10">
                            {slot.player!.tier.slice(0, 3).toUpperCase()}
                          </span>
                        </>
                      ) : (
                        <span className="text-[9px] text-slate-600 uppercase tracking-widest relative z-10 hidden sm:block">
                          空き
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
