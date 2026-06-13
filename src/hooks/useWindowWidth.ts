import { useState, useEffect } from 'react';

/**
 * 현재 브라우저 창 너비를 반응형으로 추적하는 훅.
 * resize 이벤트에 debounce를 적용해 성능을 최적화합니다.
 */
export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setWidth(window.innerWidth));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return width;
}
