import React from 'react';

export interface CTAContactBridgeContext {
  pageType?: string;
  pageId?: string;
  serviceName?: string;
  ctaId?: string;
}

export function handleCTAContactBridge(context: CTAContactBridgeContext) {
  if (typeof window === 'undefined') return;

  // Save context into sessionStorage so the Contact Form modal/section reads it safely
  const prefillData = {
    serviceName: context.serviceName || (context.pageType === 'service' ? context.pageId : 'Custom Software Architecture'),
    sourcePage: window.location.pathname,
    sourceCtaId: context.ctaId || null,
    timestamp: Date.now()
  };

  sessionStorage.setItem('ryzite_contact_prefill', JSON.stringify(prefillData));

  // Dispatch custom window event so open contact modals immediately prefill fields
  window.dispatchEvent(new CustomEvent('ryzite:contact_prefill', { detail: prefillData }));
}
