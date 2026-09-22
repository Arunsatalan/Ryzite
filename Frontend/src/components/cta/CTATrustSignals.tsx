import React, { useEffect, useState } from 'react';
import { ShieldCheck, Mail, Phone, Building2 } from 'lucide-react';
import { TrustedClientItem } from '../../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface CTATrustSignalsProps {
  supportingText?: string | null;
  showTrustLine?: boolean;
  showContactInfo?: boolean;
  contactEmail?: string | null;
  contactPhone?: string | null;
  showTrustedClients?: boolean;
}

export const CTATrustSignals: React.FC<CTATrustSignalsProps> = ({
  supportingText = "Tell us what you're building. We'll help you figure out the right technical path.",
  showTrustLine = true,
  showContactInfo = false,
  contactEmail,
  contactPhone,
  showTrustedClients = false
}) => {
  const [trustedClients, setTrustedClients] = useState<TrustedClientItem[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  useEffect(() => {
    if (showTrustedClients) {
      setLoadingClients(true);
      fetch(`${API_BASE}/api/trusted-clients`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.data)) {
            setTrustedClients(data.data.slice(0, 6)); // Top 6 active clients
          }
        })
        .catch(err => console.warn('[TRUSTED CLIENTS FETCH WARN]', err.message))
        .finally(() => setLoadingClients(false));
    }
  }, [showTrustedClients]);

  return (
    <div className="flex flex-col items-center gap-6 mt-6 w-full max-w-2xl mx-auto text-center">
      {/* Supporting Trust & Reassurance Line */}
      {showTrustLine && supportingText && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{supportingText}</span>
        </div>
      )}

      {/* Direct Contact Info Strip (Optional) */}
      {showContactInfo && (contactEmail || contactPhone) && (
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800/60 w-full">
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{contactEmail}</span>
            </a>
          )}
          {contactPhone && (
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{contactPhone}</span>
            </a>
          )}
        </div>
      )}

      {/* Integrated Trusted Client Logos Strip */}
      {showTrustedClients && trustedClients.length > 0 && (
        <div className="pt-6 border-t border-slate-800/80 w-full">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Trusted By Engineering Teams At Scale
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {trustedClients.map(client => (
              <div
                key={client.id}
                className="flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-medium text-slate-300 hover:border-slate-700 transition-colors"
              >
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={client.logoAltText || client.name}
                    className="h-5 w-auto object-contain max-w-[100px]"
                    loading="lazy"
                  />
                ) : (
                  <Building2 className="w-4 h-4 text-blue-400" />
                )}
                <span>{client.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
