'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  ArrowRight, 
  Menu, 
  X, 
  Monitor, 
  Smartphone, 
  Cpu, 
  Cloud, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { ServiceItem } from '../types';
import { INITIAL_SOLUTIONS } from '../data/initialData';

interface NavbarProps {
  services?: ServiceItem[];
  onSelectService?: (service: ServiceItem) => void;
  onOpenConsultation?: () => void;
  onOpenAdmin?: () => void;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onSectionChange?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  services = [],
  onSelectService,
  onOpenConsultation,
  onOpenAdmin,
  activeSection = 'hero',
  onNavigate,
  onSectionChange
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor className="w-5 h-5 text-[#0052FF]" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-[#0052FF]" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-[#0052FF]" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-[#0052FF]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-[#0052FF]" />;
      default: return <Sparkles className="w-5 h-5 text-[#0052FF]" />;
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', id: 'hero' },
    { label: 'Services', href: '/services', id: 'services', hasDropdown: 'services' },
    { label: 'Solutions', href: '/solutions', id: 'solutions', hasDropdown: 'solutions' },
    { label: 'Portfolio', href: '/portfolio', id: 'portfolio' },
    { label: 'About Us', href: '/about', id: 'about' },
    { label: 'Blog', href: '/blog', id: 'blog' },
  ];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/85 backdrop-blur-md py-3 border-b border-blue-100/70' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="site-nav-shell flex items-center justify-between gap-5 px-5 sm:px-7 py-2.5">
          
          {/* Brand Logo */}
          <Link 
            id="brand-logo-btn"
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-[#0052FF] flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4h6.5a5.5 5.5 0 0 1 3.9 9.38L19 20h-4l-3.2-5.5H8v5.5H5V4zm3 3v4.5h3.5a2.25 2.25 0 0 0 0-4.5H8z"/>
              </svg>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-cyan-300 rounded-full border-2 border-white animate-ping opacity-75" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0052FF] font-display">
              RYZITE
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              if (link.hasDropdown === 'services') {
                return (
                  <div 
                    key={link.id}
                    className="relative group"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      id="nav-services-dropdown-btn"
                      href="/services"
                      className={`flex items-center gap-1 text-sm font-semibold transition-colors py-2 ${
                        activeSection === 'services' ? 'text-[#0052FF]' : 'text-[#0F172A] hover:text-[#0052FF]'
                      }`}
                    >
                      <span>Services</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-[#0052FF]' : 'text-slate-400'}`} />
                    </Link>

                    {/* Services Dropdown Mega Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 p-4 grid grid-cols-1 gap-2">
                          <div className="px-3 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise Services</span>
                            <Link href="/services" className="text-xs text-[#0052FF] font-medium hover:underline">View All</Link>
                          </div>
                          {services.map((srv) => (
                            <Link
                              key={srv.id}
                              href={`/services/${srv.slug}`}
                              onClick={() => setServicesDropdownOpen(false)}
                              className="w-full text-left p-3 rounded-xl hover:bg-blue-50/70 transition-colors flex items-start gap-3.5 group/item"
                            >
                              <div className="p-2.5 rounded-lg bg-blue-100/50 group-hover/item:bg-[#0052FF] group-hover/item:text-white transition-colors">
                                {getServiceIcon(srv.iconName)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-900 group-hover/item:text-[#0052FF] flex items-center justify-between">
                                  <span>{srv.title}</span>
                                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity -translate-x-1 group-hover/item:translate-x-0" />
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{srv.shortDescription}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (link.hasDropdown === 'solutions') {
                return (
                  <div 
                    key={link.id}
                    className="relative group"
                    onMouseEnter={() => setSolutionsDropdownOpen(true)}
                    onMouseLeave={() => setSolutionsDropdownOpen(false)}
                  >
                    <Link
                      id="nav-solutions-dropdown-btn"
                      href="/solutions"
                      className={`flex items-center gap-1 text-sm font-semibold transition-colors py-2 ${
                        activeSection === 'solutions' ? 'text-[#0052FF]' : 'text-[#0052FF]'
                      }`}
                    >
                      <span>Solutions</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solutionsDropdownOpen ? 'rotate-180 text-[#0052FF]' : 'text-slate-400'}`} />
                    </Link>

                    {/* Solutions Quick Popover */}
                    {solutionsDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-slate-100 p-3 space-y-1">
                          <div className="px-3 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry Solutions</span>
                            <Link href="/solutions" className="text-xs text-[#0052FF] font-medium hover:underline">Explore All</Link>
                          </div>
                          {INITIAL_SOLUTIONS.map((sol) => (
                            <Link
                              key={sol.id}
                              href={`/solutions/${sol.slug}`}
                              onClick={() => setSolutionsDropdownOpen(false)}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/70 transition-colors block"
                            >
                              <div className="text-xs font-bold text-slate-900 hover:text-[#0052FF]">{sol.title}</div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">{sol.subtitle}</div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors py-2 ${
                    activeSection === link.id ? 'text-[#0052FF]' : 'text-[#0F172A] hover:text-[#0052FF]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="nav-get-in-touch-btn"
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-[#0052FF] hover:bg-[#0040cc] active:scale-[0.98] text-white text-sm font-bold rounded-full shadow-lg shadow-blue-600/25 transition-all duration-200 group"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#0052FF] rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-left px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  activeSection === link.id 
                    ? 'bg-blue-50 text-[#0052FF]' 
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenConsultation?.();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-white bg-[#0052FF] rounded-xl shadow-md shadow-blue-500/20"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
