import React from 'react';
import { motion } from 'framer-motion';
import { CreatorLook, StageTransform } from '../types';

// Responsive viewport-relative locked transforms (zero jitter, responsive across 375px - 430px+ mobile & desktop)
export const LOCKED_TRANSFORMS: Record<string, StageTransform> = {
  'look-1': { scale: 1.35, x: '-19svh', y: '-5svh' }, // Flushes draped elbow directly to left screen edge (2-remove)
  'look-2': { scale: 1.35, x: '-14svh', y: '-5svh' }, // Shifted slightly right for relaxed breathing composition (IMG_5196 denim)
  'look-3': { scale: 1.35, x: '14svh', y: '-5svh' },  // Hugs the right screen edge (1-remove trench)
};

const formatCoord = (val: number | string): string => {
  return typeof val === 'number' ? `${val}px` : val;
};

interface EditorialStageProps {
  looks: CreatorLook[];
  activeLookIndex: number;
}

export const EditorialStage: React.FC<EditorialStageProps> = ({
  looks,
  activeLookIndex,
}) => {
  return (
    <div className="relative w-full h-full flex items-start justify-start overflow-hidden select-none pointer-events-none transform-gpu">
      {/* GPU-Accelerated Editorial Motion Dissolve with Optical Rack Focus & Depth Breathing */}
      {looks.map((look, idx) => {
        const isActive = idx === activeLookIndex;
        const transform = LOCKED_TRANSFORMS[look.id] || { scale: 1.2, x: 0, y: 0 };

        return (
          <div
            key={look.id}
            style={{
              transform: `translate3d(${formatCoord(transform.x)}, ${formatCoord(transform.y)}, 0) scale(${transform.scale})`,
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
            className={`absolute inset-0 w-full h-full flex items-start justify-start pointer-events-none origin-top-left transform-gpu ${
              isActive ? 'z-10' : 'z-0'
            }`}
          >
            <motion.div
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.04,
                filter: isActive ? 'blur(0px)' : 'blur(5px)',
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full h-full flex items-start justify-start pointer-events-none origin-top-left will-change-transform transform-gpu"
            >
              <img
                src={look.imageSrc}
                alt={`${look.title} — Sadija`}
                className="h-[80svh] sm:h-[85svh] lg:h-[95svh] w-auto max-w-none object-contain object-left-top ml-0 pt-0"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </div>
        );
      })}

      {/* Subtle right-edge ambient gradient for smooth transition on desktop */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-36 bg-gradient-to-r from-transparent to-[#fcfbf8] pointer-events-none z-10" />

      {/* Soft bottom edge blend to seamlessly ground all looks into the canvas */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fcfbf8] via-[#fcfbf8]/40 to-transparent pointer-events-none z-10 opacity-80" />
    </div>
  );
};
