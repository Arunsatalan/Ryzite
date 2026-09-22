'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CTABackground } from './CTABackground';
import { CTAButtons } from './CTAButtons';
import { CTATrustSignals } from './CTATrustSignals';
import { ctaAnalyticsTracker } from '../../lib/CTAAnalyticsTracker';
import { handleCTAContactBridge } from './CTAContactBridge';
import { FinalCtaItem } from '../../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const DEFAULT_FALLBACK_CTA: FinalCtaItem = {
  id: 'default-fallback-cta',
  name: 'Default Agency Conversion CTA',
  eyebrow: "READY TO BUILD WHAT'S NEXT?",
  headline: "Let's Turn Your Next Big Idea Into Reality.",
  highlightedText: "Next Big Idea",
  description: "From AI-powered automation and custom software to cloud infrastructure and digital products, we help ambitious businesses design, build, and scale reliable technology.",
  supportingText: "Tell us what you're building. We'll help you figure out the right technical path.",
  primaryLabel: "Start a Project",
  primaryActionType: "CONTACT_FORM",
  primaryActionUrl: "/#contact",
  secondaryLabel: "Explore Our Work",
  secondaryActionType: "PORTFOLIO_PAGE",
  secondaryActionUrl: "/portfolio",
  tertiaryLabel: "Talk to an Expert",
  tertiaryActionType: "BOOK_CALL",
  tertiaryActionUrl: "/#contact",
  variant: "DEFAULT",
  theme: "DARK",
  backgroundType: "DARK",
  overlayEnabled: true,
  overlayOpacity: 0.85,
  showTrustLine: true,
  showTertiaryAction: false,
  showContactInfo: false,
  contactEmail: "contact@ryzite.com",
  contactPhone: "+1-800-555-0199",
  showTrustedClients: true,
  showCaseStudies: false,
  isActive: true,
  isGlobal: true,
  priority: 0,
  status: "ACTIVE"
};

interface FinalCTAProps {
  pageType?: 'home' | 'service' | 'portfolio' | 'blog' | 'case_study' | 'about' | 'contact' | string;
  pageId?: string;
  serviceName?: string;
  overrideData?: FinalCtaItem | null;
  isPreview?: boolean;
  className?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  pageType = 'home',
  pageId,
  serviceName,
  overrideData = null,
  isPreview = false,
  className = ''
}) => {
  const [ctaData, setCtaData] = useState<FinalCtaItem>(overrideData || DEFAULT_FALLBACK_CTA);
  const [loading, setLoading] = useState<boolean>(!overrideData);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackedRef = useRef<boolean>(false);

  // Fetch active CTA if not provided via overrideData prop
  useEffect(() => {
    if (overrideData) {
      setCtaData(overrideData);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const cacheBuster = `_t=${Date.now()}`;
    const fetchUrl = `${API_BASE}/api/final-cta?page=${encodeURIComponent(pageType)}${pageId ? `&id=${encodeURIComponent(pageId)}` : ''}&${cacheBuster}`;

    fetch(fetchUrl, { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        if (isMounted && json.success && json.data) {
          setCtaData(json.data);
        }
      })
      .catch(err => {
        console.warn('[FINAL CTA FETCH FALLBACK]', err.message);
        if (isMounted) setCtaData(DEFAULT_FALLBACK_CTA);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pageType, pageId, overrideData]);

  // IntersectionObserver for non-duplicate Impression Tracking
  useEffect(() => {
    if (isPreview || trackedRef.current || !ctaData?.id) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !trackedRef.current) {
            trackedRef.current = true;
            ctaAnalyticsTracker.trackImpression({
              ctaId: ctaData.id,
              pageType,
              pageId
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ctaData?.id, pageType, pageId, isPreview]);

  // Click Handlers
  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      ctaAnalyticsTracker.trackClick({
        ctaId: ctaData.id,
        actionType: 'primary',
        pageType,
        pageId
      });

      if (ctaData.primaryActionType === 'CONTACT_FORM') {
        ctaAnalyticsTracker.trackContactOpen({ ctaId: ctaData.id, pageType, pageId });
        handleCTAContactBridge({ pageType, pageId, serviceName, ctaId: ctaData.id });
      }
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      ctaAnalyticsTracker.trackClick({
        ctaId: ctaData.id,
        actionType: 'secondary',
        pageType,
        pageId
      });

      if (ctaData.secondaryActionType === 'CONTACT_FORM') {
        ctaAnalyticsTracker.trackContactOpen({ ctaId: ctaData.id, pageType, pageId });
        handleCTAContactBridge({ pageType, pageId, serviceName, ctaId: ctaData.id });
      }
    }
  };

  const handleTertiaryClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      ctaAnalyticsTracker.trackClick({
        ctaId: ctaData.id,
        actionType: 'tertiary',
        pageType,
        pageId
      });

      if (ctaData.tertiaryActionType === 'CONTACT_FORM') {
        ctaAnalyticsTracker.trackContactOpen({ ctaId: ctaData.id, pageType, pageId });
        handleCTAContactBridge({ pageType, pageId, serviceName, ctaId: ctaData.id });
      }
    }
  };

  // Render Highlighted Text within Headline
  const renderHeadline = () => {
    if (!ctaData.headline) return null;
    const highlight = ctaData.highlightedText?.trim();

    if (highlight) {
      const lowerHeadline = ctaData.headline.toLowerCase();
      const lowerHighlight = highlight.toLowerCase();
      const matchIndex = lowerHeadline.indexOf(lowerHighlight);

      if (matchIndex !== -1) {
        const before = ctaData.headline.slice(0, matchIndex);
        const matched = ctaData.headline.slice(matchIndex, matchIndex + highlight.length);
        const after = ctaData.headline.slice(matchIndex + highlight.length);

        return (
          <>
            {before}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 bg-clip-text text-transparent font-extrabold">
              {matched}
            </span>
            {after}
          </>
        );
      }
    }
    return ctaData.headline;
  };

  if (!ctaData.isActive && !isPreview) {
    return null; // Hidden if deactivated
  }

  return (
    <section
      ref={containerRef}
      className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 ${className}`}
      aria-label="Final Conversion Call to Action"
    >
      <CTABackground
        backgroundType={ctaData.backgroundType}
        backgroundImageUrl={ctaData.backgroundImageUrl}
        backgroundImageAlt={ctaData.backgroundImageAlt}
        mobileBackgroundImageUrl={ctaData.mobileBackgroundImageUrl}
        overlayEnabled={ctaData.overlayEnabled}
        overlayOpacity={ctaData.overlayOpacity}
      >
        <div className="px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20 flex flex-col items-center text-center">
          {/* Eyebrow Badge */}
          {ctaData.eyebrow && (
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 text-xs sm:text-sm font-semibold tracking-wider text-blue-400 uppercase">
              {ctaData.eyebrow}
            </div>
          )}

          {/* Large Impact Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl leading-[1.15] mb-6">
            {renderHeadline()}
          </h2>

          {/* Supporting Value Proposition Description */}
          {ctaData.description && (
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
              {ctaData.description}
            </p>
          )}

          {/* CTA Action Buttons */}
          <CTAButtons
            ctaId={ctaData.id}
            primaryLabel={ctaData.primaryLabel}
            primaryActionType={ctaData.primaryActionType}
            primaryActionUrl={ctaData.primaryActionUrl}
            secondaryLabel={ctaData.secondaryLabel}
            secondaryActionType={ctaData.secondaryActionType}
            secondaryActionUrl={ctaData.secondaryActionUrl}
            tertiaryLabel={ctaData.tertiaryLabel}
            tertiaryActionType={ctaData.tertiaryActionType}
            tertiaryActionUrl={ctaData.tertiaryActionUrl}
            showTertiaryAction={ctaData.showTertiaryAction}
            onPrimaryClick={handlePrimaryClick}
            onSecondaryClick={handleSecondaryClick}
            onTertiaryClick={handleTertiaryClick}
          />

          {/* Trust Line & Integrated Signals */}
          <CTATrustSignals
            supportingText={ctaData.supportingText}
            showTrustLine={ctaData.showTrustLine}
            showContactInfo={ctaData.showContactInfo}
            contactEmail={ctaData.contactEmail}
            contactPhone={ctaData.contactPhone}
            showTrustedClients={ctaData.showTrustedClients}
          />
        </div>
      </CTABackground>
    </section>
  );
};
