'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  MapPin, 
  Check, 
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { ServiceItem } from '../types';

interface FooterProps {
  services?: ServiceItem[];
  onSelectService?: (service: ServiceItem) => void;
  onNavigate?: (sectionId: string) => void;
  onOpenConsultation?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  services = [],
  onSelectService,
  onNavigate,
  onOpenConsultation,
  onOpenAdmin
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <footer id="main-footer" className="bg-[#06162B] text-white pt-20 pb-12 relative overflow-hidden border-t border-slate-800">
      
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-left">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-blue-900/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 inline-flex">
              <div className="w-9 h-9 bg-[#0052FF] flex items-center justify-center rounded-xl">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 4h6.5a5.5 5.5 0 0 1 3.9 9.38L19 20h-4l-3.2-5.5H8v5.5H5V4zm3 3v4.5h3.5a2.25 2.25 0 0 0 0-4.5H8z"/>
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                RYZITE
              </span>
            </Link>

            <p className="text-sm text-blue-200/80 leading-relaxed max-w-sm">
              We Build Software That Drives Growth. Empowering startups and enterprises with scalable web apps, mobile solutions, AI automation, and zero-downtime cloud infrastructure.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://twitter.com/ryzite_agency" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-blue-900/50 hover:bg-[#0052FF] text-blue-200 hover:text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com/company/ryzite" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-blue-900/50 hover:bg-[#0052FF] text-blue-200 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/ryzite" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-full bg-blue-900/50 hover:bg-[#0052FF] text-blue-200 hover:text-white flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              SOLUTIONS & SERVICES
            </h4>
            <ul className="space-y-2.5">
              {services.map((srv) => (
                <li key={srv.id}>
                  <Link
                    href={`/services/${srv.slug}`}
                    className="text-sm text-blue-100 hover:text-cyan-300 transition-colors text-left block"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/solutions"
                  className="text-sm text-cyan-300 font-bold hover:underline transition-colors text-left block"
                >
                  View All Solutions →
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-sm text-blue-100">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-cyan-300 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-cyan-300 transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-cyan-300 transition-colors">
                  Portfolio & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-cyan-300 transition-colors">
                  Engineering Blog
                </Link>
              </li>
              <li>
                <button onClick={onOpenConsultation} className="hover:text-cyan-300 transition-colors text-cyan-300 font-bold">
                  Book Consultation →
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              ENGINEERING DIGEST
            </h4>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Subscribe to get our monthly architecture breakdowns and AI engineering insights.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter work email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-blue-950 border border-blue-800 text-white placeholder-blue-300/40 text-xs focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#0052FF] hover:bg-[#0040cc] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span>Join</span>
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Subscribed successfully!
                </div>
              )}
            </form>

            <div className="pt-2 text-xs text-blue-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-300" />
                <span>contact@ryzite.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                <span>San Francisco, CA • Global Delivery</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300/70">
          <div>
            © {new Date().getFullYear()} Ryzite Inc. All rights reserved. Built with precision and high performance.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">SOC2 Compliance</span>
            <span className="hover:text-white cursor-pointer">Security Whitepaper</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
