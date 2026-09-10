import { prisma } from './prisma.js';

export const blogRepository = {
  async getAllPublished(limit?: number) {
    return prisma.blogPost.findMany({
      where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        category: true,
        readTime: true,
        publishedAt: true,
        aeoDirectAnswer: true,
        authorName: true,
        authorRef: {
          select: { name: true, role: true, avatarUrl: true }
        },
        tags: {
          select: { tag: { select: { name: true, slug: true } } }
        }
      }
    });
  },

  async getBySlug(slug: string) {
    return prisma.blogPost.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        category: true,
        readTime: true,
        publishedAt: true,
        aeoDirectAnswer: true,
        seoMetadata: {
          select: { metaTitle: true, metaDescription: true }
        },
        authorRef: {
          select: { name: true, role: true, avatarUrl: true }
        },
        tags: {
          select: { tag: { select: { name: true, slug: true } } }
        }
      }
    });
  },

  async createBlog(data: any) {
    return prisma.blogPost.create({ data });
  },

  async updateBlog(id: string, data: any) {
    return prisma.blogPost.update({
      where: { id },
      data
    });
  },

  async deleteBlog(id: string) {
    return prisma.blogPost.delete({
      where: { id }
    });
  }
};
