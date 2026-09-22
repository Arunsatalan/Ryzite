import React from 'react';
import { ArrowRight, Sparkles, PhoneCall, ExternalLink, Download, Mail, ChevronRight } from 'lucide-react';
import { CtaActionType } from '../../types';

interface CTAButtonsProps {
  ctaId: string;
  primaryLabel: string;
  primaryActionType?: CtaActionType;
  primaryActionUrl?: string | null;
  secondaryLabel?: string | null;
  secondaryActionType?: CtaActionType | null;
  secondaryActionUrl?: string | null;
  tertiaryLabel?: string | null;
  tertiaryActionType?: CtaActionType | null;
  tertiaryActionUrl?: string | null;
  showTertiaryAction?: boolean;
  onPrimaryClick?: (e: React.MouseEvent) => void;
  onSecondaryClick?: (e: React.MouseEvent) => void;
  onTertiaryClick?: (e: React.MouseEvent) => void;
}

// Sanitize URLs to prevent unsafe javascript: or data: URIs
function sanitizeUrl(url?: string | null, defaultFallback: string = '/#contact'): string {
  if (!url || typeof url !== 'string') return defaultFallback;
  const trimmed = url.trim();
  if (trimmed.toLowerCase().startsWith('javascript:') || trimmed.toLowerCase().startsWith('data:')) {
    return defaultFallback;
  }
  return trimmed;
}

export const CTAButtons: React.FC<CTAButtonsProps> = ({
  primaryLabel,
  primaryActionType = 'CONTACT_FORM',
  primaryActionUrl,
  secondaryLabel,
  secondaryActionType = 'PORTFOLIO_PAGE',
  secondaryActionUrl,
  tertiaryLabel,
  tertiaryActionType = 'BOOK_CALL',
  tertiaryActionUrl,
  showTertiaryAction = false,
  onPrimaryClick,
  onSecondaryClick,
  onTertiaryClick
}) => {
  const getPrimaryHref = () => {
    if (primaryActionType === 'EMAIL' && primaryActionUrl) {
      return primaryActionUrl.startsWith('mailto:') ? primaryActionUrl : `mailto:${primaryActionUrl}`;
    }
    return sanitizeUrl(primaryActionUrl, '/#contact');
  };

  const getSecondaryHref = () => {
    if (secondaryActionType === 'EMAIL' && secondaryActionUrl) {
      return secondaryActionUrl.startsWith('mailto:') ? secondaryActionUrl : `mailto:${secondaryActionUrl}`;
    }
    return sanitizeUrl(secondaryActionUrl, '/portfolio');
  };

  const getTertiaryHref = () => {
    return sanitizeUrl(tertiaryActionUrl, '/#contact');
  };

  const isExternal = (url: string) => url.startsWith('http://') || url.startsWith('https://');

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full my-6">
      {/* Primary CTA Button (High Intent) */}
      <a
        href={getPrimaryHref()}
        onClick={onPrimaryClick}
        target={isExternal(getPrimaryHref()) ? '_blank' : '_self'}
        rel={isExternal(getPrimaryHref()) ? 'noopener noreferrer' : undefined}
        className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 w-full sm:w-auto"
        aria-label={primaryLabel}
      >
        <span className="flex items-center gap-2">
          {primaryActionType === 'BOOK_CALL' ? (
            <PhoneCall className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
          ) : primaryActionType === 'DOWNLOAD' ? (
            <Download className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
          ) : (
            <Sparkles className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
          )}
          <span>{primaryLabel}</span>
          <ArrowRight className="w-5 h-5 text-blue-200 group-hover:translate-x-1 transition-transform" />
        </span>
      </a>

      {/* Secondary CTA Button (Medium Intent) */}
      {secondaryLabel && (
        <a
          href={getSecondaryHref()}
          onClick={onSecondaryClick}
          target={isExternal(getSecondaryHref()) ? '_blank' : '_self'}
          rel={isExternal(getSecondaryHref()) ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-medium text-base text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 w-full sm:w-auto"
          aria-label={secondaryLabel}
        >
          <span className="flex items-center gap-2">
            <span>{secondaryLabel}</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </a>
      )}

      {/* Tertiary CTA Button (Optional Low Intent) */}
      {showTertiaryAction && tertiaryLabel && (
        <a
          href={getTertiaryHref()}
          onClick={onTertiaryClick}
          className="inline-flex items-center justify-center px-5 py-3.5 rounded-xl font-medium text-sm text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600 w-full sm:w-auto"
          aria-label={tertiaryLabel}
        >
          <span className="flex items-center gap-1.5 underline underline-offset-4 decoration-slate-700 hover:decoration-slate-400">
            {tertiaryActionType === 'EMAIL' ? <Mail className="w-4 h-4" /> : null}
            <span>{tertiaryLabel}</span>
          </span>
        </a>
      )}
    </div>
  );
};
