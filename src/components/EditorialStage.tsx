import React, { useState } from 'react';
import { CreatorLook, StageTransform } from '../types';

export const LOCKED_TRANSFORMS: Record<string, StageTransform> = {
  'look-1': { scale: 1.45, x: -70, y: -60 }, // Restored user's exact chosen placement
  'look-2': { scale: 1.25, x: -60, y: -40 },
  'look-3': { scale: 1.25, x: -75, y: -20 },
  'look-4': { scale: 1.36, x: -30, y: 50 },  // Anchored down so trench coat reaches bottom edge
};

const getActiveTransforms = (): Record<string, StageTransform> => {
  try {
    const saved = localStorage.getItem('sadija_stage_transforms');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...LOCKED_TRANSFORMS, ...parsed };
    }
  } catch {
    // fallback
  }
  return LOCKED_TRANSFORMS;
};

interface EditorialStageProps {
  looks: CreatorLook[];
  activeLookIndex: number;
}

export const EditorialStage: React.FC<EditorialStageProps> = ({
  looks,
  activeLookIndex,
}) => {
  const [transforms] = useState<Record<string, StageTransform>>(getActiveTransforms);

  return (
    <div className="relative w-full h-full flex items-start justify-start overflow-hidden select-none pointer-events-none transform-gpu">
      {/* GPU-Accelerated Layered Slow Dissolve (Zero Jank / Zero Framerate Drops) */}
      {looks.map((look, idx) => {
        const isActive = idx === activeLookIndex;
        const transform = transforms[look.id] || LOCKED_TRANSFORMS[look.id] || { scale: 1.2, x: 0, y: 0 };
        const isLook1 = look.id === 'look-1';
        const isLook4 = look.id === 'look-4';

        return (
          <div
            key={look.id}
            style={{
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
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
                  ? 'h-[72dvh] sm:h-[80dvh] lg:h-[95dvh]'
                  : isLook4
                  ? 'h-[86dvh] sm:h-[92dvh] lg:h-full' // Extends Look 4 coat down to bottom edge
                  : 'h-[74dvh] sm:h-[82dvh] lg:h-[95dvh]'
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
