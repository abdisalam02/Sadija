import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StackedCardProps {
  index: number;
  totalCards: number;
  zIndex: number;
  tag: string;
  children: React.ReactNode;
}

export const StackedCard: React.FC<StackedCardProps> = ({
  index,
  totalCards,
  zIndex,
  tag,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll of this card container relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scale down and dim when the NEXT card slides over this one (except for the last card)
  const isLast = index === totalCards - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, isLast ? 1 : 0.40]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100dvh] lg:h-[120dvh] pointer-events-auto"
      style={{ zIndex }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          backgroundColor: 'var(--canvas-surface)',
        }}
        className={`sticky top-[44dvh] lg:top-14 min-h-[56dvh] lg:min-h-[calc(100dvh-3.5rem)] rounded-t-[24px] lg:rounded-none border-t border-white/18 shadow-[0_-24px_50px_rgba(0,0,0,0.55)] p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-colors duration-700`}
      >
        {/* Top Edge Indicator Bar */}
        <div className="w-full flex items-center justify-between pb-4 hairline-b mb-6 select-none">
          <span className="bracket-tag text-[10px] sm:text-xs">
            [ CHAPTER 0{index + 1} / 0{totalCards} ]
          </span>
          <span className="bracket-tag text-[10px] sm:text-xs opacity-75">
            {tag}
          </span>
        </div>

        {/* Card Content Body */}
        <div className="flex-1 w-full flex flex-col justify-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
