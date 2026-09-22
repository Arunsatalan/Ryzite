'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { SolutionsGrid } from './SolutionsGrid';
import { WhyChooseUs } from './WhyChooseUs';
import { FeaturedProjects } from './FeaturedProjects';
import { AeoDirectAnswer } from './AeoDirectAnswer';
import { AboutSection } from './AboutSection';
import { FaqSection } from './FaqSection';
import { BlogSection } from './BlogSection';
import { LeadGenBanner } from './LeadGenBanner';
import { FinalCTA } from './cta/FinalCTA';
import { Footer } from './Footer';
import { ProjectModal } from './ProjectModal';
import { ServiceDetailModal } from './ServiceDetailModal';
import { ConsultationWizardModal } from './ConsultationWizardModal';
import { AdminDashboard } from './AdminDashboard';
import { SeoStructuredData } from './SeoStructuredData';

import { 
  INITIAL_SERVICES, 
  INITIAL_PROJECTS, 
  INITIAL_BLOGS, 
  DEFAULT_PAGE_METADATA 
} from '../data/initialData';
import { ServiceItem, ProjectItem, BlogPost, HomeHeroConfig, TrustedClientItem } from '../types';
import { api } from '../lib/api';

interface HomePageClientProps {
  initialHero?: HomeHeroConfig | null;
}

export default function HomePageClient({ initialHero }: HomePageClientProps) {
  const [hero, setHero] = useState<HomeHeroConfig | undefined>(initialHero || undefined);
  const [trustedClients, setTrustedClients] = useState<TrustedClientItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [preselectedConsultService, setPreselectedConsultService] = useState<string>('');
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    // Fetch live database data from Express API (Port 5000) on mount
    const loadBackendData = async () => {
      try {
        const [heroData, clientData, srvData, projData, blogData] = await Promise.all([
          api.getHomeHero().catch(() => null),
          api.getTrustedClients().catch(() => null),
          api.getServices().catch(() => null),
          api.getProjects().catch(() => null),
          api.getBlogs().catch(() => null)
        ]);

        if (heroData) {
          setHero(heroData);
        }
        if (clientData && Array.isArray(clientData)) {
          setTrustedClients(clientData);
        }
        if (srvData && Array.isArray(srvData) && srvData.length > 0) {
          setServices(srvData);
        }
        if (projData && Array.isArray(projData) && projData.length > 0) {
          setProjects(projData);
        }
        if (blogData && Array.isArray(blogData) && blogData.length > 0) {
          setBlogs(blogData);
        }
      } catch (err) {
        console.warn('Backend API connection pending, using default UI dataset:', err);
      }
    };

    loadBackendData();
  }, []);

  const handleOpenConsultation = (initialService?: string) => {
    if (initialService) {
      setPreselectedConsultService(initialService);
    }
    setConsultationOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col selection:bg-[#0052FF] selection:text-white">
      {/* Schema.org Structured Data */}
      <SeoStructuredData 
        metadata={DEFAULT_PAGE_METADATA} 
        services={services} 
        blogs={blogs} 
      />

      {/* Main Navbar */}
      <Navbar
        services={services}
        onSelectService={(srv) => setSelectedService(srv)}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={() => setAdminOpen(true)}
        activeSection="hero"
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {selectedService ? (
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onBookService={(srvTitle) => handleOpenConsultation(srvTitle)}
          />
        ) : (
          <>
            {/* 1. Hero Section */}
            <Hero
              hero={hero}
              clients={trustedClients}
              onBookConsultation={() => handleOpenConsultation()}
            />

            {/* 2. End-to-End Solutions 5-Card Grid */}
            <SolutionsGrid
              services={services}
              onSelectService={(srv) => setSelectedService(srv)}
              onExploreAll={() => handleOpenConsultation()}
            />

            {/* 3. Why Choose Ryzite Section */}
            <WhyChooseUs
              onStartConsultation={() => handleOpenConsultation()}
            />

            {/* 4. Featured Projects */}
            <FeaturedProjects
              projects={projects}
              onSelectProject={(proj) => setSelectedProject(proj)}
              onOpenConsultation={() => handleOpenConsultation()}
            />

            {/* 5. AEO & GEO Direct Answer Engine Knowledge Summary */}
            <AeoDirectAnswer />

            {/* 6. About Us Section */}
            <AboutSection
              onOpenConsultation={() => handleOpenConsultation()}
            />

            {/* 7. Frequently Asked Questions */}
            <FaqSection
              onOpenConsultation={() => handleOpenConsultation()}
            />

            {/* 8. Engineering Insights & Perspectives Blog */}
            <BlogSection
              blogs={blogs}
            />

            {/* 9. Final CTA Conversion Engine Banner */}
            <FinalCTA pageType="home" />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        services={services}
        onSelectService={(srv) => setSelectedService(srv)}
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Project Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Consultation Wizard Modal */}
      <ConsultationWizardModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        services={services}
        preselectedService={preselectedConsultService}
        onLeadSubmitted={() => {}}
      />

      {/* Admin CMS & CRM Dashboard */}
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
