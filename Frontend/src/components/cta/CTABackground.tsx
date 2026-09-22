import React from 'react';
import { CtaBackgroundType } from '../../types';

interface CTABackgroundProps {
  backgroundType?: CtaBackgroundType;
  backgroundImageUrl?: string | null;
  backgroundImageAlt?: string | null;
  mobileBackgroundImageUrl?: string | null;
  overlayEnabled?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

export const CTABackground: React.FC<CTABackgroundProps> = ({
  backgroundType = 'DARK',
  backgroundImageUrl,
  backgroundImageAlt,
  mobileBackgroundImageUrl,
  overlayEnabled = true,
  overlayOpacity = 0.85,
  children
}) => {
  const effectiveImageUrl = backgroundImageUrl || null;
  const isImageBackground = (backgroundType === 'IMAGE' || backgroundType === 'IMAGE_GRADIENT') && effectiveImageUrl;

  // Background style classes
  const getBackgroundStyles = () => {
    switch (backgroundType) {
      case 'LIGHT':
        return 'bg-slate-900 text-slate-100 border border-slate-800/80 shadow-2xl';
      case 'SOLID':
        return 'bg-slate-950 text-white border border-slate-800/80 shadow-2xl';
      case 'GRADIENT':
        return 'bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-900 text-white border border-blue-900/30 shadow-2xl shadow-blue-950/20';
      case 'IMAGE_GRADIENT':
        return 'bg-slate-950 text-white border border-slate-800/80 shadow-2xl';
      case 'IMAGE':
        return 'bg-slate-950 text-white border border-slate-800/80 shadow-2xl';
      case 'DARK':
      default:
        return 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800/80 shadow-2xl';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl ${getBackgroundStyles()}`}>
      {/* Background Image Layer with Reserved Dimensions */}
      {isImageBackground && (
        <div className="absolute inset-0 z-0">
          <picture className="w-full h-full block">
            {mobileBackgroundImageUrl && (
              <source media="(max-width: 639px)" srcSet={mobileBackgroundImageUrl} />
            )}
            <img
              src={effectiveImageUrl}
              alt={backgroundImageAlt || 'CTA Visual Background'}
              className="w-full h-full object-cover object-center opacity-40 transition-opacity duration-700"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      )}

      {/* Subtle Visual Grid & Ambient Glow Texture */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Contrast Overlay */}
      {overlayEnabled && isImageBackground && (
        <div
          className="absolute inset-0 z-0 bg-slate-950 pointer-events-none transition-opacity duration-300"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content Container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
