'use client';

import { m, type Transition, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Springy settle with a small overshoot: the "bounce" on every 3D entrance.
 * Opacity uses a plain tween so it never overshoots.
 */
const SPRING = { type: 'spring', stiffness: 120, damping: 14, mass: 0.9 } as const;
const springWithFade = (delay = 0): Transition => ({
  ...SPRING,
  delay,
  opacity: { duration: 0.6, ease: EASE, delay },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'li' | 'section' | 'article' | 'span';
};

/**
 * Tips content up into view in 3D (rotating forward from below) and lets it
 * settle with a soft bounce. Runs once per element. With reduced motion,
 * MotionConfig drops the transforms and only the fade remains.
 */
export function Reveal({ children, className, delay = 0, y = 48, as = 'div' }: RevealProps) {
  const Component = m[as];
  return (
    <Component
      className={className}
      style={{ transformPerspective: 1100, transformOrigin: '50% 100%' }}
      initial={{ opacity: 0, y, rotateX: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={springWithFade(delay)}
    >
      {children}
    </Component>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** Cards tumble in from alternating 3D angles, then spring flat. */
const item: Variants = {
  hidden: (i: number = 0) => ({
    opacity: 0,
    y: 70,
    rotateX: -38,
    rotateY: i % 2 === 0 ? -16 : 16,
    rotateZ: i % 2 === 0 ? -2 : 2,
    scale: 0.9,
  }),
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    transition: springWithFade(),
  },
};

export function Stagger({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const Component = m[as];
  return (
    <Component
      className={className}
      style={{ perspective: 1400 }}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
  /** Position in the list; alternates the tilt direction. */
  index?: number;
}) {
  const Component = m[as];
  return (
    <Component className={className} style={{ transformOrigin: '50% 100%' }} variants={item} custom={index}>
      {children}
    </Component>
  );
}

/** Line-by-line heading reveal: each line rolls up out of a mask in 3D. */
export function TextReveal({ lines, className, delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  return (
    <span className={className} style={{ perspective: 900 }}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <m.span
            className="block"
            style={{ transformOrigin: '50% 100%' }}
            initial={{ y: '105%', rotateX: -75 }}
            animate={{ y: '0%', rotateX: 0 }}
            transition={{ ...SPRING, stiffness: 90, delay: delay + i * 0.12 }}
          >
            {line}
          </m.span>
        </span>
      ))}
    </span>
  );
}
