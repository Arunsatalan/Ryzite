'use client';

import React, { useState } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { INITIAL_SERVICES, INITIAL_PROJECTS, INITIAL_BLOGS } from '@/data/initialData';
import { ServiceItem, ProjectItem, BlogPost } from '@/types';

export default function AdminProjectsRoutePage() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <AdminDashboard
        isOpen={true}
        initialTab="projects"
        onClose={() => { window.location.href = '/portfolio'; }}
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
