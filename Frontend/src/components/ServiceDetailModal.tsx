import React from 'react';
import { ArrowLeft, ArrowRight, Check, Clock, Code2, Compass, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (serviceTitle: string) => void;
}

const consultingCapabilities = [
  ['Technology Advisory', 'We help you choose the right tech stack for your product and goals.', Compass],
  ['Architecture Design', 'Scalable, secure and maintainable architecture designed for growth.', Layers],
  ['Security & Compliance', 'Security-first approach with industry standards and compliance best practices.', ShieldCheck],
  ['Roadmap Planning', 'Clear roadmap and milestones to turn your ideas into a successful product.', Clock],
  ['Code & System Review', 'In-depth review and actionable insights to improve code quality and performance.', Code2]
] as const;

const consultingProcess = [
  ['01', 'Discover', 'Understand your business, goals and challenges.'],
  ['02', 'Analyze', 'Evaluate current systems and required capabilities.'],
  ['03', 'Design', 'Create architecture and solution approach.'],
  ['04', 'Recommend', 'Provide actionable plans, tools and best practices.'],
  ['05', 'Support', 'Guide implementation and ensure success.']
];

const technologyGroups: Array<[string, string[]]> = [
  ['Frontend', ['Next.js', 'React', 'TypeScript']],
  ['Backend', ['Node.js', 'REST', 'GraphQL']],
  ['Data', ['PostgreSQL', 'Redis']],
  ['Cloud & Infrastructure', ['AWS', 'Docker', 'Kubernetes']],
  ['Architecture', ['Microservices', 'Event-Driven Systems', 'CI/CD']]
];

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose, onBookService }) => {
  if (!service) return null;

  const isConsulting = service.category === 'consulting';

  return (
    <section className="service-detail-page bg-white pt-28 pb-24 text-[#101828]">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Home</span><span>/</span><span>Services</span><span>/</span>
            <span className="text-slate-800">{service.title}</span>
          </div>
          <button onClick={onClose} className="min-h-11 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0052FF] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </button>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center py-16 lg:py-24">
          <div className="service-detail-enter max-w-xl">
            <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.18em] text-slate-400">
              <span className="text-4xl tracking-tight text-slate-300 font-light">{isConsulting ? '05' : '01'}</span>
              <span className="h-7 w-px bg-[#0052FF]" />
              <span>{isConsulting ? 'Consulting Service' : 'Enterprise Service'}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.045em] leading-[0.98] font-display mb-8">{service.title}</h1>
            <p className="text-base sm:text-lg leading-8 text-slate-600 max-w-lg mb-8">
              {isConsulting ? 'Expert guidance to help you choose the right technology, design robust architectures and build future-ready software.' : service.fullDescription}
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {(isConsulting ? ['System Architecture', 'Security Standards', '+3 more'] : (service.techStack || ['Next.js', 'PostgreSQL']).slice(0, 3)).map((item) => (
                <span key={item} className="px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-full">{item}</span>
              ))}
            </div>
            <div className="flex items-center gap-8 border-t border-slate-200 pt-6">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Engagement Time</div>
                <div className="font-semibold">{service.timeline}</div>
              </div>
              <button onClick={() => document.getElementById('service-benefits')?.scrollIntoView({ behavior: 'smooth' })} className="min-h-11 text-sm font-semibold hover:text-[#0052FF] transition-colors">Explore Service <span className="ml-1">↓</span></button>
            </div>
          </div>

          <div className="service-image-enter relative min-h-[360px] sm:min-h-[520px] overflow-hidden bg-[#F4F4F1]">
            <img 
              src={service.imageUrl || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=85&w=1400&auto=format&fit=crop"} 
              alt={service.imageAlt || service.title} 
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=85&w=1400&auto=format&fit=crop"; }}
              className="absolute inset-0 w-full h-full object-cover grayscale-[15%]" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent" />
          </div>
        </div>

        {isConsulting ? <>
          <section id="service-benefits" className="border-t border-slate-200 py-16 lg:py-20">
            <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What You Get</h2>
              <p className="max-w-sm text-sm leading-6 text-slate-500">We help you make confident technology decisions and turn ideas into scalable solutions.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              {consultingCapabilities.map(([title, description, Icon]) => (
                <div key={title} className="py-4 lg:px-6 first:pl-0 border-t lg:border-t-0 lg:border-l border-slate-200 first:border-l-0">
                  <Icon className="w-5 h-5 mb-8 text-slate-800" strokeWidth={1.5} />
                  <h3 className="text-sm font-semibold mb-3">{title}</h3>
                  <p className="text-sm leading-6 text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#F5F5F7] px-6 sm:px-10 lg:px-12 py-12 lg:py-16">
            <div className="grid lg:grid-cols-[0.8fr_1.8fr] gap-12">
              <div><h2 className="text-2xl font-bold tracking-tight mb-3">Our Consulting Process</h2><p className="text-sm text-slate-500">A proven process to deliver impact.</p></div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5">
                {consultingProcess.map(([number, title, description]) => (
                  <div key={number} className="border-t sm:border-t-0 sm:border-l border-slate-300 py-5 sm:px-5 first:pl-0">
                    <div className="text-lg text-slate-400 mb-8">{number}</div><h3 className="text-sm font-semibold mb-2">{title}</h3><p className="text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-20 lg:py-24 border-b border-slate-200">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12">Technology Expertise</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {technologyGroups.map(([category, technologies]) => (
                <div key={category}><h3 className="text-xs uppercase tracking-wider text-slate-400 mb-5">{category}</h3><div className="space-y-3">{technologies.map((technology) => <div key={technology} className="text-sm border-b border-slate-100 pb-2 text-slate-700 hover:text-[#0052FF] transition-colors">{technology}</div>)}</div></div>
              ))}
            </div>
          </section>

          <section className="py-20 lg:py-28 text-center">
            <Sparkles className="w-5 h-5 mx-auto mb-6 text-slate-500" strokeWidth={1.5} />
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5">Have a complex software challenge?</h2>
            <p className="text-slate-500 mb-8">Let’s discuss your requirements and determine the right technical approach.</p>
            <button onClick={() => onBookService(service.title)} className="min-h-11 inline-flex items-center gap-2 px-6 py-3 bg-[#101828] text-white text-sm font-semibold hover:bg-[#0052FF] transition-colors">Talk to an Expert <ArrowRight className="w-4 h-4" /></button>
          </section>
        </> : (
          <section id="service-benefits" className="border-t border-slate-200 py-16"><h2 className="text-3xl font-bold mb-8">Core Architectural Capabilities</h2><div className="grid sm:grid-cols-2 gap-3">{(service.features || []).map((feature) => <div key={feature} className="flex gap-3 border-b border-slate-100 py-4 text-sm text-slate-600"><Check className="w-4 h-4 text-[#0052FF] shrink-0" />{feature}</div>)}</div></section>
        )}
      </div>
    </section>
  );
};
