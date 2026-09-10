'use client';

import React, { useState } from 'react';
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
import { ServiceItem, ProjectItem, BlogPost } from '../types';

export default function HomePageClient() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [preselectedConsultService, setPreselectedConsultService] = useState<string>('');
  const [adminOpen, setAdminOpen] = useState(false);

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

            {/* 9. Dual-Tone Liquid Call-to-Action Banner */}
            <LeadGenBanner
              onOpenConsultation={() => handleOpenConsultation()}
            />
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
