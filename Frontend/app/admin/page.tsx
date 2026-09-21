'use client';

import React, { useState } from 'react';
import { AdminDashboard } from '../../src/components/AdminDashboard';
import { INITIAL_SERVICES, INITIAL_PROJECTS, INITIAL_BLOGS } from '../../src/data/initialData';
import { ServiceItem, ProjectItem, BlogPost } from '../../src/types';

export default function AdminRoutePage() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased" suppressHydrationWarning>
      <AdminDashboard
        isOpen={true}
        onClose={() => { window.location.href = '/'; }}
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
