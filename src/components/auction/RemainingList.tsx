import { useRoomStore } from '../../store/roomStore';
import type { TierRank } from '../../types';

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

export function RemainingList() {
  const playerPool = useRoomStore((s) => s.playerPool);

  // Group by tier
  const grouped = playerPool.reduce((acc, player) => {
    const t = player.tier;
    if (!acc[t]) acc[t] = [];
    acc[t].push(player.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="flex flex-col h-full bg-black/40 p-4 border-t border-slate-800 overflow-y-auto hide-scrollbar">
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <div className="w-1 h-4 bg-slate-500" />
        <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">
          残りの選手名簿
        </span>
      </div>
      
      <div className="flex flex-col gap-3 min-h-0">
        {Object.entries(grouped).map(([tier, names]) => (
          <div key={tier} className="text-[11px] leading-relaxed">
            <span className="font-bold tracking-wider text-[10px] uppercase text-slate-400 mr-2 border border-slate-700 bg-slate-800 px-1.5 py-0.5 inline-block mb-1">
              {TIER_JP[tier as TierRank] || tier}
            </span>
            <span className="text-slate-300 font-mono">
              {names.join(' / ')}
            </span>
          </div>
        ))}
        {playerPool.length === 0 && (
          <div className="text-xs text-slate-600 italic">すべての選手のオークションが終了しました。</div>
        )}
      </div>
    </div>
  );
}
