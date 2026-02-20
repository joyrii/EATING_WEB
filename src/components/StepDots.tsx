'use client';

import { LayoutGroup, motion } from 'framer-motion';

type Props = {
  step: number;
  totalSteps?: number;
  dotSize?: number;
  gap?: number;
  pillWidth?: number;
};

const pillSpring = {
  type: 'spring',
  stiffness: 520,
  damping: 34,
  mass: 0.8,
} as const;

const dotSpring = {
  type: 'spring',
  stiffness: 420,
  damping: 36,
  mass: 0.9,
} as const;

export default function StepIndicator({
  step,
  totalSteps = 8,
  dotSize = 8,
  gap = 6,
  pillWidth = 40,
}: Props) {
  const safeStep = clamp(step, 1, totalSteps);

  // 전체 너비 고정
  const trackWidth =
    pillWidth + (totalSteps - 1) * dotSize + (totalSteps - 1) * gap;

  return (
    <LayoutGroup>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 999,
        }}
      >
        <div
          style={{
            width: trackWidth,
            display: 'flex',
            alignItems: 'center',
            gap,
          }}
        >
          {Array.from({ length: totalSteps }).map((_, i) => {
            const idx = i + 1;
            const isActive = idx === safeStep;

            return (
              <motion.div
                key={`slot-${idx}`}
                layout
                transition={dotSpring}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: '0 0 auto',
                }}
              >
                {isActive ? (
                  <motion.div
                    layoutId="pill"
                    transition={pillSpring}
                    style={{
                      width: pillWidth,
                      height: dotSize,
                      borderRadius: 999,
                      background: '#ff5900',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: dotSize,
                      height: dotSize,
                      borderRadius: 999,
                      background: '#d9d9d9',
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
