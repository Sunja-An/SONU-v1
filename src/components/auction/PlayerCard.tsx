import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useRoomStore, selectAuction } from '../../store/roomStore';
import { useTranslation } from '../../i18n';
import { Shield, Target, Crosshair, Users, Star } from 'lucide-react';
import type { ValorantRole, TierRank } from '../../types';

// ─────────────────────────────────────────────
// Tier 색상 매핑
// ─────────────────────────────────────────────
const TIER_COLORS: Record<TierRank, string> = {
  Iron: '#9ca3af',
  Bronze: '#b87333',
  Silver: '#94a3b8',
  Gold: '#f59e0b',
  Platinum: '#22d3ee',
  Diamond: '#a855f7',
  Ascendant: '#10b981',
  Immortal: '#ef4444',
  Radiant: '#FF4655',
};

const TIER_JP: Record<TierRank, string> = {
  Iron: 'アイアン',
  Bronze: 'ブロンズ',
  Silver: 'シルバー',
  Gold: 'ゴールド',
  Platinum: 'プラチナ',
  Diamond: 'ダイヤモンド',
  Ascendant: 'アセンダント',
  Immortal: 'イモータル',
  Radiant: 'レディアント',
};

// ─────────────────────────────────────────────
// Role 아이콘 매핑
// ─────────────────────────────────────────────
const RoleIcon = ({ role }: { role: ValorantRole }) => {
  const cls = 'size-3.5';
  switch (role) {
    case 'Duelist':   return <Target className={cls} />;
    case 'Initiator': return <Crosshair className={cls} />;
    case 'Controller': return <Shield className={cls} />;
    case 'Sentinel':  return <Users className={cls} />;
  }
};

const ROLE_COLORS: Record<ValorantRole, string> = {
  Duelist:    'text-[#FF4655] border-[#FF4655]/30 bg-[#FF4655]/10',
  Initiator:  'text-amber-400 border-amber-400/30 bg-amber-400/10',
  Controller: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  Sentinel:   'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
};

const ROLE_JP: Record<ValorantRole, string> = {
  Duelist: 'デュエリスト',
  Initiator: 'イニシエーター',
  Controller: 'コントローラー',
  Sentinel: 'センチネル'
};

// ─────────────────────────────────────────────
// PlayerCard 컴포넌트
// ─────────────────────────────────────────────
export function PlayerCard() {
  const { t } = useTranslation();
  const auction = useRoomStore(selectAuction);
  const player = auction.currentPlayer;
  const teams = useRoomStore((s) => s.teams);
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (auction.status === 'active') {
      gsap.fromTo(containerRef.current, 
        { boxShadow: '0 0 0px rgba(255, 70, 85, 0)', borderColor: 'rgba(30, 41, 59, 1)' },
        { boxShadow: '0 0 20px rgba(255, 70, 85, 0.4)', borderColor: 'rgba(255, 70, 85, 0.5)', duration: 0.8, yoyo: true, repeat: 3 }
      );
    }
  }, [auction.status]);

  useEffect(() => {
    if (badgeRef.current && (auction.status === 'sold' || auction.status === 'no_bid')) {
      gsap.fromTo(badgeRef.current,
        { scale: 2, opacity: 0, rotation: -20 },
        { scale: 1, opacity: 1, rotation: -10, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [auction.status]);

  if (!player) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-600 text-sm">
        {t.auction.waiting}
      </div>
    );
  }

  const tierColor = TIER_COLORS[player.tier];
  const isSold = auction.status === 'sold';
  const isPassed = auction.status === 'no_bid';
  const winningTeam = isSold ? teams.find(t => t.id === auction.currentHighestTeamId) : null;

  return (
    <div id="main-player-card" ref={containerRef} className="flex flex-col h-full border border-slate-800 bg-slate-900/40 p-4 transition-colors duration-300 relative overflow-hidden">
      
      {/* Top half: Photo + Identity + Badges */}
      <div className={`flex gap-4 ${isPassed ? 'opacity-60' : ''}`}>
        
        {/* Photo Box */}
        <div className="relative w-28 h-32 md:w-32 md:h-36 bg-black/60 border border-slate-700 flex-shrink-0 shadow-lg">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#FF4655] z-10" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#FF4655] z-10" />
          
          {player.agentImageUrl ? (
            <img
              src={player.agentImageUrl}
              alt={player.mostAgents[0]}
              className="w-full h-full object-cover opacity-90"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Star size={32} className="text-slate-700" />
            </div>
          )}

          {/* Auction Result Badges Over Photo */}
          {isSold && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <div ref={badgeRef} className="border-2 border-emerald-500 text-emerald-500 font-black text-xl px-2 py-0.5 uppercase tracking-widest transform -rotate-12 bg-black/80">
                落札
              </div>
            </div>
          )}
          {isPassed && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
              <div ref={badgeRef} className="border-2 border-slate-500 text-slate-500 font-black text-xl px-2 py-0.5 uppercase tracking-widest transform -rotate-12 bg-black/80">
                流札
              </div>
            </div>
          )}
        </div>

        {/* Identity & Badges */}
        <div className="flex flex-col flex-1 min-w-0 py-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight truncate uppercase leading-none">
              {player.discordName || player.name}
            </h2>
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 flex-shrink-0"
              style={{ color: tierColor, backgroundColor: `${tierColor}15`, border: `1px solid ${tierColor}30` }}
            >
              {TIER_JP[player.tier] || player.tier}
            </span>
          </div>

          <p className="text-slate-400 text-xs font-mono mb-3">
             IGN: <span className="text-slate-300">{player.name}</span> {player.realName && `(${player.realName})`}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {(player.possibleRoles && player.possibleRoles.length > 0 ? player.possibleRoles : [player.role]).map(role => (
              <div key={role} className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 border ${ROLE_COLORS[role]}`}>
                <RoleIcon role={role} />
                {ROLE_JP[role] || role}
              </div>
            ))}
          </div>

          {isSold && winningTeam && (
            <div className="mt-auto self-start">
              <span 
                className="text-[10px] font-bold tracking-widest px-2 py-1 shadow-md"
                style={{ color: winningTeam.color, backgroundColor: `${winningTeam.color}20`, border: `1px solid ${winningTeam.color}50` }}
              >
                {winningTeam.name} 落札
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Self Intro */}
      <div className={`mt-4 flex-shrink-0 ${isPassed ? 'opacity-60' : ''}`}>
        {player.selfIntro ? (
          <div className="bg-slate-900 p-2.5 border-l-2 border-slate-600 shadow-inner">
            <p className="text-xs italic text-slate-300 leading-relaxed break-words">
              "{player.selfIntro}"
            </p>
          </div>
        ) : (
          <div className="h-8" />
        )}
      </div>

      {/* Bottom: Stats & Most Agents */}
      <div className={`mt-auto pt-4 flex flex-col gap-3 ${isPassed ? 'opacity-60' : ''}`}>
        
        <div>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-1.5">モストエージェント (Top 3)</p>
          <div className="flex flex-wrap gap-1.5">
            {player.mostAgents.map((agent, idx) => (
              <span
                key={agent}
                className={`text-[10px] px-2 py-0.5 border ${
                  idx === 0
                    ? 'text-slate-200 border-slate-500 bg-slate-800'
                    : 'text-slate-400 border-slate-700 bg-slate-900/50'
                }`}
              >
                {agent}
              </span>
            ))}
          </div>
        </div>


      </div>

    </div>
  );
}
