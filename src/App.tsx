import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SolutionsGrid } from './components/SolutionsGrid';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FeaturedProjects } from './components/FeaturedProjects';
import { LeadGenBanner } from './components/LeadGenBanner';
import { AeoDirectAnswer } from './components/AeoDirectAnswer';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { BlogSection } from './components/BlogSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { ConsultationWizardModal } from './components/ConsultationWizardModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SeoStructuredData } from './components/SeoStructuredData';

import { 
  INITIAL_SERVICES, 
  INITIAL_PROJECTS, 
  INITIAL_BLOGS, 
  DEFAULT_PAGE_METADATA 
} from './data/initialData';
import { ServiceItem, ProjectItem, BlogPost, PageMetadataConfig } from './types';

export default function App() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [pageMetadata, setPageMetadata] = useState<PageMetadataConfig | null>(DEFAULT_PAGE_METADATA);

  const [activeSection, setActiveSection] = useState<string>('hero');

  // Modals state
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [preselectedConsultService, setPreselectedConsultService] = useState<string>('');
  const [adminOpen, setAdminOpen] = useState(false);

  // Fetch initial data from server API
  useEffect(() => {
    const loadServerData = async () => {
      try {
        const [servicesRes, projectsRes, blogsRes, seoRes] = await Promise.allSettled([
          fetch('/api/services').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/projects').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/blogs').then(r => r.ok ? r.json() : null).catch(() => null),
          fetch('/api/seo').then(r => r.ok ? r.json() : null).catch(() => null)
        ]);

        if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value) && servicesRes.value.length > 0) {
          setServices(servicesRes.value);
        }
        if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value) && projectsRes.value.length > 0) {
          setProjects(projectsRes.value);
        }
        if (blogsRes.status === 'fulfilled' && Array.isArray(blogsRes.value) && blogsRes.value.length > 0) {
          setBlogs(blogsRes.value);
        }
        if (seoRes.status === 'fulfilled' && seoRes.value) {
          setPageMetadata(seoRes.value);
        }
      } catch (e) {
        console.warn('API sync using local fallback seed', e);
      }
    };

    loadServerData();

    // Track initial page view in analytics
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName: 'page_view', path: window.location.pathname })
      }).catch(() => {});
    } catch {
      // ignore
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    let targetEl: HTMLElement | null = null;
    if (sectionId === 'hero') targetEl = document.getElementById('hero-section');
    else if (sectionId === 'services') targetEl = document.getElementById('services-section');
    else if (sectionId === 'solutions') targetEl = document.getElementById('services-section');
    else if (sectionId === 'portfolio') targetEl = document.getElementById('portfolio-section');
    else if (sectionId === 'about') targetEl = document.getElementById('about-section');
    else if (sectionId === 'blog') targetEl = document.getElementById('blog-section');

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenConsultation = (initialService?: string) => {
    if (initialService) {
      setPreselectedConsultService(initialService);
    }
    setConsultationOpen(true);
  };

  const handleSelectClient = (clientName: string) => {
    const match = projects.find(p => p.title.toLowerCase().includes(clientName.toLowerCase()) || p.client.toLowerCase().includes(clientName.toLowerCase()));
    if (match) {
      setSelectedProject(match);
    } else {
      handleNavigate('portfolio');
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col selection:bg-[#0052FF] selection:text-white">
      {/* Dynamic SEO JSON-LD injection */}
      <SeoStructuredData 
        metadata={pageMetadata} 
        services={services} 
        blogs={blogs} 
      />

      {/* Main Sticky Header / Navbar */}
      <Navbar
        services={services}
        onSelectService={(srv) => setSelectedService(srv)}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={() => setAdminOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onSectionChange={setActiveSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {selectedService ? (
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onBookService={(srvTitle) => handleOpenConsultation(srvTitle)}
          />
        ) : <>
          {/* 1. Hero Section matching screenshot */}
          <Hero
            onExploreServices={() => handleNavigate('services')}
            onBookConsultation={() => handleOpenConsultation()}
            onSelectClient={handleSelectClient}
          />

        {/* 2. End-to-End Solutions 5-Card Grid matching screenshot */}
        <SolutionsGrid
          services={services}
          onSelectService={(srv) => setSelectedService(srv)}
          onExploreAll={() => handleOpenConsultation()}
        />

        {/* 3. Why Choose Ryzite Section with 3D cube & 4 pillars */}
        <WhyChooseUs
          onStartConsultation={() => handleOpenConsultation()}
        />

        {/* 4. Featured Projects 4 Dark Glowing Mockup Cards */}
        <FeaturedProjects
          projects={projects}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 5. AEO & GEO Direct Answer Engine Knowledge Summary */}
        <AeoDirectAnswer />

        {/* 6. About Us & Engineering Stack Standards */}
        <AboutSection
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 7. Frequently Asked Questions with Accordions */}
        <FaqSection
          onOpenConsultation={() => handleOpenConsultation()}
        />

        {/* 8. Engineering Insights & Perspectives Blog */}
        <BlogSection
          blogs={blogs}
        />

        {/* 9. Dual-Tone Liquid Call-to-Action Banner */}
          <LeadGenBanner
            onOpenConsultation={() => handleOpenConsultation()}
          />
        </>}

      </main>

      {/* Footer */}
      <Footer
        services={services}
        onSelectService={(srv) => setSelectedService(srv)}
        onNavigate={handleNavigate}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Project Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Interactive Consultation Wizard & AI Proposal Scope Estimator */}
      <ConsultationWizardModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        services={services}
        preselectedService={preselectedConsultService}
        onLeadSubmitted={() => {}}
      />

      {/* Admin Operations & CMS Dashboard */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        services={services}
        projects={projects}
        blogs={blogs}
        onUpdateServices={(newSrv) => setServices(newSrv)}
        onUpdateProjects={(newProj) => setProjects(newProj)}
        onUpdateBlogs={(newBlogs) => setBlogs(newBlogs)}
      />
    </div>
  );
}
