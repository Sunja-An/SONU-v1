import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SuccessAnimationProps {
  onComplete?: () => void;
}

export function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Reset initial states
    gsap.set(containerRef.current, { autoAlpha: 1 });
    gsap.set(bgRef.current, { scaleY: 0, transformOrigin: 'bottom' });
    gsap.set(textRef.current, { y: 50, autoAlpha: 0, scale: 0.8 });

    // Animation sequence
    tl.to(bgRef.current, {
      scaleY: 1,
      duration: 0.6,
      ease: 'power3.inOut'
    })
    .to(textRef.current, {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, '-=0.2')
    .to(textRef.current, {
      scale: 1.05,
      duration: 1,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => {
      tl.kill();
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none"
    >
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-[#FF4655]"
      />
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 
          ref={textRef}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic"
          style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
        >
          APPLICATION COMPLETE
        </h1>
        <p className="text-white mt-4 font-medium opacity-90 animate-pulse">
          Your application has been submitted successfully.
        </p>
      </div>
    </div>
  );
}
