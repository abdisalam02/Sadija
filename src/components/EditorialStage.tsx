import React from 'react';
import { CreatorLook, StageTransform } from '../types';

// Offsets only (no CSS scale): scaling a composited layer rasterises at 1x and upscales, which blurs the photo.
// x stays in svh to keep the composition; y uses lvh so it tracks the stage height.
export const LOCKED_TRANSFORMS: Record<string, StageTransform> = {
  'look-1': { scale: 1, x: '-19svh', y: '-5lvh' }, // Flushes draped elbow directly to left screen edge (2-remove)
  'look-2': { scale: 1, x: '-14svh', y: '-5lvh' }, // Shifted slightly right for relaxed breathing composition (IMG_5196 denim)
  'look-3': { scale: 1, x: '14svh', y: '-5lvh' },  // Hugs the right screen edge (1-remove trench)
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
    <div className="relative w-full h-full overflow-hidden select-none pointer-events-none">
      {/* Soft opacity-only crossfade: no blur or scale so the switch never looks harsh */}
      {looks.map((look, idx) => {
        const isActive = idx === activeLookIndex;
        const transform = LOCKED_TRANSFORMS[look.id] || { scale: 1, x: 0, y: 0 };

        return (
          <div
            key={look.id}
            style={{
              transform: `translate(${formatCoord(transform.x)}, ${formatCoord(transform.y)})`,
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 10 : 0,
              transition: 'opacity 1400ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* lvh sizing: image stays taller than the stage even after the mobile URL bar collapses */}
            <img
              src={look.imageSrc}
              alt={`${look.title} — Sadija`}
              className="h-[108lvh] sm:h-[115lvh] lg:h-[128lvh] w-auto max-w-none block"
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
