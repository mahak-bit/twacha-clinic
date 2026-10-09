'use client';

import { useRef } from 'react';
import { hairConditions, skinConditions } from '@/content/conditions';
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';

const words = [...skinConditions, ...hairConditions].map((c) => c.name);

/**
 * Editorial ticker of concerns. It leans and squashes in 3D with scroll speed,
 * then springs back when scrolling stops. Pauses on hover; static for reduced motion.
 */
export function Marquee() {
  const root = useRef<HTMLElement>(null);
  const band = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = band.current!;
        const skew = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3.out' });
        const tilt = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power3.out' });
        const squash = gsap.quickTo(el, 'scaleY', { duration: 0.5, ease: 'power3.out' });
        let settle: gsap.core.Tween | null = null;

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500);
            skew(v * -14);
            tilt(v * 18);
            squash(1 - Math.abs(v) * 0.12);
            settle?.kill();
            // once scrolling eases off, bounce back to rest
            settle = gsap.delayedCall(0.12, () => {
              gsap.to(el, { skewX: 0, rotateX: 0, scaleY: 1, duration: 1.1, ease: 'elastic.out(1, 0.35)', overwrite: true });
            }) as unknown as gsap.core.Tween;
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <li key={w} className="flex items-center font-serif text-4xl whitespace-nowrap text-ink sm:text-6xl lg:text-7xl">
          <span className={i % 2 ? 'text-clay italic' : ''}>{w}</span>
          <span aria-hidden className="mx-6 inline-block size-2 rounded-full bg-clay-soft sm:mx-10" />
        </li>
      ))}
    </ul>
  );

  return (
    <section ref={root} aria-label="Concerns we treat" className="overflow-hidden border-y border-line bg-cream py-10 [perspective:900px] sm:py-14">
      <div ref={band} className="will-change-transform">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
