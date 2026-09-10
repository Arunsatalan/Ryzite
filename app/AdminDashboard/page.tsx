'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '../../src/components/AdminDashboard';
import { INITIAL_SERVICES, INITIAL_PROJECTS, INITIAL_BLOGS } from '../../src/data/initialData';
import { ServiceItem, ProjectItem, BlogPost } from '../../src/types';

export default function AdminPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);

  return (
    <div className="min-h-screen bg-white">
      <AdminDashboard
        isOpen={true}
        onClose={() => router.push('/')}
        services={services}
        projects={projects}
        blogs={blogs}
        onUpdateServices={setServices}
        onUpdateProjects={setProjects}
        onUpdateBlogs={setBlogs}
      />
    </div>
  );
}
