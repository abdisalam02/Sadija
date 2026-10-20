import React from 'react';
import { CreatorLook, StageTransform } from '../types';

// Responsive viewport-relative locked transforms (zero jitter, responsive across 375px - 430px+ mobile & desktop)
export const LOCKED_TRANSFORMS: Record<string, StageTransform> = {
  'look-1': { scale: 1.45, x: '-20svh', y: '-8svh' }, // Flushes draped elbow directly to left screen edge
  'look-3': { scale: 1.25, x: '-15svh', y: '-3svh' }, // Shifted slightly right from edge for relaxed breathing composition
  'look-4': { scale: 1.36, x: '-10svh', y: '6svh' },  // Anchored down so trench coat extends to bottom
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
      {/* GPU-Accelerated Layered Slow Dissolve (Zero Jank / Zero Framerate Drops) */}
      {looks.map((look, idx) => {
        const isActive = idx === activeLookIndex;
        const transform = LOCKED_TRANSFORMS[look.id] || { scale: 1.2, x: 0, y: 0 };
        const isLook1 = look.id === 'look-1';
        const isLook4 = look.id === 'look-4';

        return (
          <div
            key={look.id}
            style={{
              transform: `translate3d(${formatCoord(transform.x)}, ${formatCoord(transform.y)}, 0) scale(${transform.scale})`,
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
            className={`absolute inset-0 w-full h-full flex items-start justify-start pointer-events-none origin-top-left transition-opacity duration-1000 ease-in-out will-change-opacity transform-gpu ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={look.imageSrc}
              alt={`${look.title} — Sadija Gure`}
              className={`${
                isLook1
                  ? 'h-[76svh] sm:h-[82svh] lg:h-[95svh]'
                  : isLook4
                  ? 'h-[88svh] sm:h-[94svh] lg:h-full'
                  : 'h-[76svh] sm:h-[82svh] lg:h-[95svh]'
              } w-auto max-w-none object-contain object-left-top ml-0 pt-0`}
              loading="eager"
              decoding="async"
            />
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
