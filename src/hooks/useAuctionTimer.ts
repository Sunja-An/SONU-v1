import { useEffect } from 'react';
import { useRoomStore, selectTimeRemaining } from '../store/roomStore';

/**
 * useAuctionTimer
 * 경매 타이머 훅 - 클라이언트 사이드 카운트다운 (서버 보정 없이)
 *
 * TODO: 실제 서비스에서는 WebSocket 서버에서 받아오는
 * `auction_tick` 이벤트로 대체하거나, 서버 timestamp 기반으로 보정.
 */
export function useAuctionTimer() {
  const status = useRoomStore((s) => s.auction.status);
  const timeRemaining = useRoomStore(selectTimeRemaining);
  const tickTimer = useRoomStore((s) => s.tickTimer);
  const endAuction = useRoomStore((s) => s.endAuction);
  const currentHighestTeamId = useRoomStore(
    (s) => s.auction.currentHighestTeamId
  );

  useEffect(() => {
    if (status !== 'active') return;

    const interval = setInterval(() => {
      const current = useRoomStore.getState().auction.timeRemaining;
      if (current <= 0) {
        clearInterval(interval);
        endAuction(useRoomStore.getState().auction.currentHighestTeamId);
        return;
      }
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tickTimer, endAuction]);

  const isCritical = timeRemaining <= 5 && status === 'active';
  const isSold = status === 'sold';
  const isNoBid = status === 'no_bid';

  return {
    timeRemaining,
    isCritical,
    isSold,
    isNoBid,
    currentHighestTeamId,
  };
}
