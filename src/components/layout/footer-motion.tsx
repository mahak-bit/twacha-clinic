'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';

/**
 * As the footer scrolls into view it swings up from a backward tilt into
 * place (like a lid closing), and its columns follow one after another.
 */
export function FooterMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-footer-panel]',
          { rotateX: 24, y: 90, opacity: 0.35, transformOrigin: '50% 0%' },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 45%', scrub: 0.8 },
          },
        );
        gsap.from('[data-footer-col]', {
          y: 50,
          rotateX: -40,
          opacity: 0,
          transformOrigin: '50% 100%',
          duration: 1,
          ease: 'back.out(1.8)',
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} style={{ perspective: 1400 }}>
      <div data-footer-panel className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
