'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';

/**
 * Turns its content gently in 3D as it travels through the viewport:
 * angled in on entry, square to the reader in the middle, angled out on exit.
 */
export function ScrollTilt({ children, className, maxY = 14, maxX = 6 }: { children: ReactNode; className?: string; maxY?: number; maxX?: number }) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
          .fromTo(inner.current, { rotateY: maxY, rotateX: maxX, scale: 0.94 }, { rotateY: 0, rotateX: 0, scale: 1, ease: 'power2.out' })
          .to(inner.current, { rotateY: -maxY * 0.6, rotateX: -maxX * 0.5, scale: 0.97, ease: 'power1.in' });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className} style={{ perspective: 1200 }}>
      <div ref={inner} data-scroll-tilt className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
