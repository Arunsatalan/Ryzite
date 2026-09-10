import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Cpu, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Loader2, 
  CheckCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ServiceItem } from '../types';

interface ConsultationWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  preselectedService?: string;
  onLeadSubmitted: () => void;
}

export const ConsultationWizardModal: React.FC<ConsultationWizardModalProps> = ({
  isOpen,
  onClose,
  services,
  preselectedService,
  onLeadSubmitted
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>(preselectedService || 'Web Application Development');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['User Authentication & RBAC', 'Scalable Database & API']);
  const [budgetTier, setBudgetTier] = useState<string>('$15k - $30k');
  const [timeline, setTimeline] = useState<string>('4 - 8 Weeks');
  
  // Contact details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  // AI Scope Generator state
  const [generatingScope, setGeneratingScope] = useState(false);
  const [aiScopeResult, setAiScopeResult] = useState<{
    summary?: string;
    recommendedArchitecture?: string;
    keyDeliverables?: string[];
    recommendedTechStack?: string[];
    estimatedWeeks?: string;
    estimatedBudgetRange?: string;
  } | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const featureOptions = [
    'User Authentication & RBAC',
    'High-Concurrency Database & API',
    'Generative AI / Vector RAG Pipeline',
    'Real-time WebSockets & Live Sync',
    'Stripe / Payments Integration',
    'Native Mobile App (iOS / Android)',
    'Zero-Downtime Cloud DevOps CI/CD',
    'Custom Analytics Dashboard'
  ];

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleGenerateAiScope = async () => {
    setGeneratingScope(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: selectedService,
          features: selectedFeatures,
          budgetTier,
          targetTimeline: timeline,
          description: message
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiScopeResult(data.data);
      }
    } catch (err) {
      console.error('AI estimate failed:', err);
    } finally {
      setGeneratingScope(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMessage('Please fill in your name and work email.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          serviceSelected: selectedService,
          budget: budgetTier,
          timeline,
          message: `${message}\n\nSelected Features: ${selectedFeatures.join(', ')}`,
          source: 'Interactive Consultation Wizard'
        })
      });

      const result = await res.json();
      if (result.success || result.data) {
        setSubmitted(true);
        onLeadSubmitted();
        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      } else {
        setErrorMessage(result.error?.message || result.error || 'Failed to submit proposal request.');
      }
    } catch (err) {
      setErrorMessage('Network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col relative text-left">
        
        {/* Modal Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-5 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052FF] flex items-center justify-center font-extrabold text-xs">
              0{step}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                PROJECT ESTIMATOR & CONSULTATION
              </span>
              <span className="text-sm font-bold text-slate-900">
                {step === 1 && 'Select Solution'}
                {step === 2 && 'Architecture & Features'}
                {step === 3 && 'Budget & Timeline'}
                {step === 4 && 'Contact & Technical Scope'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                Proposal Request Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. A Ryzite Solutions Architect has received your project specifications and will email you back within <strong>2 business hours</strong> with a tailored architecture assessment.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#0052FF] text-white font-bold text-xs rounded-full shadow-md hover:bg-blue-700 transition-all"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Select Service */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Which core capability best fits your project?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedService(s.title)}
                        className={`p-4 rounded-2xl text-left border transition-all ${
                          selectedService === s.title 
                            ? 'bg-blue-50/80 border-[#0052FF] shadow-sm ring-2 ring-[#0052FF]/20' 
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-slate-900">{s.title}</span>
                          {selectedService === s.title && <Check className="w-4 h-4 text-[#0052FF]" />}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{s.shortDescription}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Features & Architecture */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Select the key modules and architectural requirements:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {featureOptions.map((feat, idx) => {
                      const isSelected = selectedFeatures.includes(feat);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleFeature(feat)}
                          className={`p-3 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all ${
                            isSelected 
                              ? 'bg-blue-50 border-[#0052FF] text-[#0052FF]' 
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{feat}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#0052FF]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Budget & Timeline */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Estimated Investment Tier</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['<$10k', '$10k - $25k', '$25k - $50k', '$50k+'].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setBudgetTier(tier)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            budgetTier === tier 
                              ? 'bg-[#0052FF] text-white border-[#0052FF] shadow-md shadow-blue-500/20' 
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Target Launch Timeline</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Immediate (<2w)', '4 - 8 Weeks', '2 - 4 Months', 'Flexible'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setTimeline(time)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                            timeline === time 
                              ? 'bg-[#0052FF] text-white border-[#0052FF] shadow-md shadow-blue-500/20' 
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Contact details & AI Scope generation */}
              {step === 4 && (
                <form onSubmit={handleSubmitProposal} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0052FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0052FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Dynamics Inc."
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Brief / Key Goals</label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe what you're building, target users, or special requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0052FF]"
                    />
                  </div>

                  {/* AI Scope Generator Trigger */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#001F54] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#0052FF]" />
                        <span>AI Architecture Scope Assistant</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Get an instant technical assessment and timeline preview.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAiScope}
                      disabled={generatingScope}
                      className="px-4 py-2 bg-white hover:bg-blue-50 border border-blue-200 text-[#0052FF] font-bold text-xs rounded-full shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                    >
                      {generatingScope ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Generate Scope</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Generated Preview Box */}
                  {aiScopeResult && (
                    <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs space-y-2 border border-slate-800 animate-in fade-in">
                      <div className="text-cyan-400 font-bold flex items-center justify-between">
                        <span>Architecture Recommendation:</span>
                        <span className="text-emerald-400 font-mono">{aiScopeResult.estimatedWeeks}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{aiScopeResult.summary}</p>
                      {aiScopeResult.recommendedTechStack && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {aiScopeResult.recommendedTechStack.map((t, idx) => (
                            <span key={idx} className="bg-slate-800 text-cyan-300 px-2 py-0.5 rounded text-[10px]">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {errorMessage && (
                    <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg font-semibold">
                      {errorMessage}
                    </div>
                  )}
                </form>
              )}

              {/* Wizard Navigation Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-xs rounded-full shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitProposal}
                    disabled={submitting}
                    className="px-7 py-3 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-xs rounded-full shadow-lg shadow-blue-500/25 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Proposal...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
