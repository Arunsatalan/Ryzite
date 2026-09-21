import { prisma } from './prisma.js';
import { StatisticStatus } from '@prisma/client';
import { cloudinaryService } from '../services/cloudinary.service.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export class TeamRepository {
  /**
   * Initialize default seed leadership members if database table is empty.
   */
  static async seedInitialMembersIfEmpty() {
    const count = await prisma.technicalLeadershipTeamMember.count();
    if (count === 0) {
      const initialMembers = [
        {
          name: 'Alex Vance',
          slug: 'alex-vance-principal-solutions-architect',
          title: 'Principal Solutions Architect',
          shortBio: '12+ years building high-concurrency SaaS portals, AI vector pipelines, and distributed cloud systems.',
          longBio: 'Alex Vance leads Ryzite solution architecture practice, specializing in Next.js 16, multi-agent AI automation, and zero-downtime microservices.',
          profileImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
          profileImagePublicId: 'ryzite/team/team_seed_alex_vance',
          profileImageAlt: 'Alex Vance - Principal Solutions Architect at Ryzite',
          expertise: ['Distributed Systems', 'Cloud Architecture', 'AI Engineering', 'Backend Architecture'],
          technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
          linkedinUrl: 'https://linkedin.com/in/alex-vance',
          githubUrl: 'https://github.com/alex-vance',
          displayOrder: 1,
          status: StatisticStatus.PUBLISHED,
          isActive: true
        },
        {
          name: 'Sarah Chen',
          slug: 'sarah-chen-head-of-growth-aeo-architecture',
          title: 'Head of Growth & AEO Architecture',
          shortBio: 'Pioneer in Answer Engine Optimization (AEO) and structured data schemas for generative AI citations.',
          longBio: 'Sarah Chen leads technical SEO and AEO knowledge graph integrations, enabling Perplexity AI and ChatGPT to extract verified factual claims.',
          profileImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
          profileImagePublicId: 'ryzite/team/team_seed_sarah_chen',
          profileImageAlt: 'Sarah Chen - Head of Growth & AEO Architecture at Ryzite',
          expertise: ['Answer Engine Optimization', 'Structured Data Schema', 'Technical SEO', 'Entity Mapping'],
          technologies: ['JSON-LD', 'Next.js', 'Python', 'Schema.org'],
          linkedinUrl: 'https://linkedin.com/in/sarah-chen',
          githubUrl: 'https://github.com/sarah-chen',
          displayOrder: 2,
          status: StatisticStatus.PUBLISHED,
          isActive: true
        },
        {
          name: 'Liam Sterling',
          slug: 'liam-sterling-devops-infrastructure-lead',
          title: 'DevOps & Infrastructure Practice Lead',
          shortBio: 'Specialist in Kubernetes zero-downtime blue-green deployments, Terraform IaC, and SOC2 compliance.',
          longBio: 'Liam Sterling architects resilient cloud infrastructure with automated CI/CD deployment pipelines, load balancing, and automated monitoring.',
          profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
          profileImagePublicId: 'ryzite/team/team_seed_liam_sterling',
          profileImageAlt: 'Liam Sterling - DevOps & Infrastructure Lead at Ryzite',
          expertise: ['DevOps & CI/CD', 'Kubernetes Orchestration', 'Cloud Security & SOC2', 'Infrastructure as Code'],
          technologies: ['Kubernetes', 'Terraform', 'Docker', 'AWS', 'GCP'],
          linkedinUrl: 'https://linkedin.com/in/liam-sterling',
          githubUrl: 'https://github.com/liam-sterling',
          displayOrder: 3,
          status: StatisticStatus.PUBLISHED,
          isActive: true
        }
      ];

      await prisma.technicalLeadershipTeamMember.createMany({
        data: initialMembers
      });
    }
  }

  /**
   * Fetch only PUBLISHED & ACTIVE members for public frontend (/about).
   */
  static async getPublicTeamMembers() {
    await this.seedInitialMembersIfEmpty();
    return prisma.technicalLeadershipTeamMember.findMany({
      where: {
        status: StatisticStatus.PUBLISHED,
        isActive: true
      },
      orderBy: { displayOrder: 'asc' }
    });
  }

  /**
   * Fetch all members for Admin CMS.
   */
  static async getAdminTeamMembers() {
    await this.seedInitialMembersIfEmpty();
    return prisma.technicalLeadershipTeamMember.findMany({
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }]
    });
  }

  /**
   * Get single team member by ID.
   */
  static async getMemberById(id: string) {
    return prisma.technicalLeadershipTeamMember.findUnique({
      where: { id }
    });
  }

  /**
   * Create new team member.
   */
  static async createTeamMember(data: any) {
    const name = (data.name || '').trim();
    const title = (data.title || '').trim();
    const shortBio = (data.shortBio || '').trim();
    const profileImageUrl = (data.profileImageUrl || '').trim();
    const profileImagePublicId = (data.profileImagePublicId || '').trim();

    if (!name) throw new Error('Full Name is required.');
    if (!title) throw new Error('Professional Title is required.');
    if (!shortBio) throw new Error('Short Bio is required.');
    if (!profileImageUrl || !profileImagePublicId) throw new Error('Profile Image is required.');

    const baseSlug = slugify(name);
    const uniqueSuffix = Date.now().toString(36);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const count = await prisma.technicalLeadershipTeamMember.count();

    return prisma.technicalLeadershipTeamMember.create({
      data: {
        name,
        slug,
        title,
        shortBio,
        longBio: data.longBio || null,
        profileImageUrl,
        profileImagePublicId,
        profileImageAlt: data.profileImageAlt || `${name} - ${title} at Ryzite`,
        profileImageWidth: data.profileImageWidth || 600,
        profileImageHeight: data.profileImageHeight || 600,
        expertise: Array.isArray(data.expertise) ? data.expertise : [],
        technologies: Array.isArray(data.technologies) ? data.technologies : [],
        linkedinUrl: data.linkedinUrl || null,
        githubUrl: data.githubUrl || null,
        displayOrder: data.displayOrder ?? (count + 1),
        status: data.status || StatisticStatus.PUBLISHED,
        isActive: data.isActive ?? true,
        publishedAt: data.status === StatisticStatus.PUBLISHED ? new Date() : null
      }
    });
  }

  /**
   * Update existing team member with safe old profile image destruction.
   */
  static async updateTeamMember(id: string, data: any) {
    const existing = await prisma.technicalLeadershipTeamMember.findUnique({ where: { id } });
    if (!existing) throw new Error(`Team member with ID ${id} not found.`);

    const oldPublicId = existing.profileImagePublicId;
    const newPublicId = data.profileImagePublicId;

    const updated = await prisma.technicalLeadershipTeamMember.update({
      where: { id },
      data: {
        name: data.name ?? existing.name,
        title: data.title ?? existing.title,
        shortBio: data.shortBio ?? existing.shortBio,
        longBio: data.longBio !== undefined ? data.longBio : existing.longBio,
        profileImageUrl: data.profileImageUrl ?? existing.profileImageUrl,
        profileImagePublicId: data.profileImagePublicId ?? existing.profileImagePublicId,
        profileImageAlt: data.profileImageAlt ?? existing.profileImageAlt,
        profileImageWidth: data.profileImageWidth ?? existing.profileImageWidth,
        profileImageHeight: data.profileImageHeight ?? existing.profileImageHeight,
        expertise: Array.isArray(data.expertise) ? data.expertise : existing.expertise,
        technologies: Array.isArray(data.technologies) ? data.technologies : existing.technologies,
        linkedinUrl: data.linkedinUrl !== undefined ? data.linkedinUrl : existing.linkedinUrl,
        githubUrl: data.githubUrl !== undefined ? data.githubUrl : existing.githubUrl,
        displayOrder: data.displayOrder ?? existing.displayOrder,
        status: data.status ?? existing.status,
        isActive: data.isActive ?? existing.isActive,
        updatedAt: new Date()
      }
    });

    // If profile image was replaced, destroy old image on Cloudinary
    if (newPublicId && oldPublicId && newPublicId !== oldPublicId && !oldPublicId.startsWith('http')) {
      try {
        await cloudinaryService.deleteImage(oldPublicId);
        console.log(`[TEAM CMS] Deleted replaced old image from Cloudinary: ${oldPublicId}`);
      } catch (err: any) {
        console.warn(`[TEAM CMS] Warning: Failed to destroy old Cloudinary image ${oldPublicId}:`, err.message);
      }
    }

    return updated;
  }

  /**
   * Transactional Delete:
   * 1. Reads member.
   * 2. Calls Cloudinary destroy(public_id).
   * 3. Deletes DB record only if Cloudinary succeeds.
   * 4. Aborts & throws error if Cloudinary fails!
   */
  static async deleteTeamMember(id: string) {
    const member = await prisma.technicalLeadershipTeamMember.findUnique({ where: { id } });
    if (!member) throw new Error(`Team member with ID ${id} not found.`);

    const publicId = member.profileImagePublicId;

    // Step 1: Destroy image on Cloudinary if valid publicId exists
    if (publicId && !publicId.startsWith('http') && !publicId.startsWith('team_seed_')) {
      try {
        const cloudRes = await cloudinaryService.deleteImage(publicId);
        console.log(`[TEAM CMS DELETE] Cloudinary image destroyed: ${publicId}`, cloudRes);
      } catch (err: any) {
        console.error(`[TEAM CMS DELETE FAIL] Cloudinary image deletion failed for ${publicId}:`, err);
        throw new Error(`Profile image could not be removed from Cloudinary (${err.message}). Team member was not deleted.`);
      }
    }

    // Step 2: Delete PostgreSQL record
    return prisma.technicalLeadershipTeamMember.delete({
      where: { id }
    });
  }

  /**
   * Reorder team members list.
   */
  static async reorderMembers(items: { id: string; displayOrder: number }[]) {
    const updates = items.map(item =>
      prisma.technicalLeadershipTeamMember.update({
        where: { id: item.id },
        data: { displayOrder: item.displayOrder }
      })
    );
    await prisma.$transaction(updates);
    return this.getAdminTeamMembers();
  }
}
