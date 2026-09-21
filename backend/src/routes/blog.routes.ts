import { Router } from 'express';
import { blogRepository } from '../repositories/blog.repository.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

export const blogRouter = Router();

// ===================================================
// PUBLIC BLOG ENDPOINTS
// ===================================================

/**
 * GET /api/blog
 * Fetch public published blog posts with filtering and pagination
 */
blogRouter.get('/api/blog', async (req, res) => {
  try {
    const { category, tag, author, type, intent, featured, searchQuery, limit, offset } = req.query;

    const data = await blogRepository.getPublicPosts({
      categorySlug: category as string,
      tagSlug: tag as string,
      authorSlug: author as string,
      postType: type as string,
      searchIntent: intent as string,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      searchQuery: searchQuery as string,
      limit: limit ? parseInt(limit as string, 10) : 10,
      offset: offset ? parseInt(offset as string, 10) : 0
    });

    res.json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('[PUBLIC BLOG POSTS ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/latest
 * Fetch top published posts for Homepage Latest Insights section
 */
blogRouter.get('/api/blog/latest', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;
    const data = await blogRepository.getLatestPosts(limit);
    res.json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('[PUBLIC BLOG LATEST ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/featured
 * Fetch featured posts for Blog Hero
 */
blogRouter.get('/api/blog/featured', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;
    const data = await blogRepository.getFeaturedPosts(limit);
    res.json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('[PUBLIC BLOG FEATURED ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/categories
 */
blogRouter.get('/api/blog/categories', async (req, res) => {
  try {
    const data = await blogRepository.getCategories();
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[PUBLIC BLOG CATEGORIES ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/tags
 */
blogRouter.get('/api/blog/tags', async (req, res) => {
  try {
    const data = await blogRepository.getTags();
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[PUBLIC BLOG TAGS ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/authors
 */
blogRouter.get('/api/blog/authors', async (req, res) => {
  try {
    const data = await blogRepository.getAuthors();
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[PUBLIC BLOG AUTHORS ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/category/:slug
 */
blogRouter.get('/api/blog/category/:slug', async (req, res) => {
  try {
    const category = await blogRepository.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    const postsResult = await blogRepository.getPublicPosts({ categorySlug: req.params.slug });
    res.json({
      success: true,
      data: {
        category,
        posts: postsResult.posts || [],
        totalCount: postsResult.totalCount || 0
      }
    });
  } catch (err: any) {
    console.error('[BLOG CATEGORY DETAIL ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/tag/:slug
 */
blogRouter.get('/api/blog/tag/:slug', async (req, res) => {
  try {
    const tag = await blogRepository.getTagBySlug(req.params.slug);
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    const postsResult = await blogRepository.getPublicPosts({ tagSlug: req.params.slug });
    res.json({
      success: true,
      data: {
        tag,
        posts: postsResult.posts || [],
        totalCount: postsResult.totalCount || 0
      }
    });
  } catch (err: any) {
    console.error('[BLOG TAG DETAIL ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/author/:slug
 */
blogRouter.get('/api/blog/author/:slug', async (req, res) => {
  try {
    const author = await blogRepository.getAuthorBySlug(req.params.slug);
    if (!author) {
      return res.status(404).json({ success: false, error: 'Author not found' });
    }
    const postsResult = await blogRepository.getPublicPosts({ authorSlug: req.params.slug });
    res.json({
      success: true,
      data: {
        author,
        posts: postsResult.posts || [],
        totalCount: postsResult.totalCount || 0
      }
    });
  } catch (err: any) {
    console.error('[BLOG AUTHOR DETAIL ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/blog/rss.xml
 * Dynamic RSS 2.0 XML Feed
 */
blogRouter.get('/api/blog/rss.xml', async (req, res) => {
  try {
    const xml = await blogRepository.generateRssFeed();
    res.set('Content-Type', 'text/xml');
    res.send(xml);
  } catch (err: any) {
    console.error('[BLOG RSS ERROR]', err);
    res.status(500).send('Error generating RSS feed');
  }
});

/**
 * GET /api/blog/:slug & GET /api/blog/slug/:slug
 * Single blog post detail with full relations, TOC, related articles
 */
const handleGetPostBySlug = async (req: any, res: any) => {
  try {
    const post = await blogRepository.getPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }
    res.json({
      success: true,
      data: post
    });
  } catch (err: any) {
    console.error('[GET BLOG POST BY SLUG ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

blogRouter.get('/api/blog/slug/:slug', handleGetPostBySlug);
blogRouter.get('/api/blog/:slug', handleGetPostBySlug);

/**
 * POST /api/blog/:id/view
 * Record page view count
 */
blogRouter.post('/api/blog/:id/view', async (req, res) => {
  try {
    await blogRepository.incrementPostViews(req.params.id);
    res.json({ success: true, message: 'View recorded' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/blog/search-log
 * Log user search query for search gap analysis
 */
blogRouter.post('/api/blog/search-log', async (req, res) => {
  try {
    const { query, resultsCount, intent } = req.body;
    if (query && typeof query === 'string') {
      await blogRepository.recordSearchQuery(query, resultsCount || 0, intent || 'INFORMATIONAL');
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===================================================
// ADMIN BLOG CMS ENDPOINTS
// ===================================================

/**
 * GET /api/admin/blog
 * Admin blog directory with KPI dashboard metrics
 */
blogRouter.get('/api/admin/blog', async (req, res) => {
  try {
    const { searchQuery, categoryId, status, postType } = req.query;
    const data = await blogRepository.getAdminPosts({
      searchQuery: searchQuery as string,
      categoryId: categoryId as string,
      status: status as string,
      postType: postType as string
    });

    res.json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('[ADMIN GET BLOG POSTS ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog
 * Create new blog post
 */
blogRouter.post('/api/admin/blog', async (req, res) => {
  try {
    const { title, excerpt, content } = req.body;
    if (!title || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title, excerpt, and content fields are required.'
      });
    }

    const data = await blogRepository.createPost(req.body);
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully.',
      data
    });
  } catch (err: any) {
    console.error('[ADMIN CREATE BLOG POST ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/blog/:id
 * Update blog post with version snapshot & 301 redirect creation on slug change
 */
blogRouter.put('/api/admin/blog/:id', async (req, res) => {
  try {
    const data = await blogRepository.updatePost(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Blog post updated successfully.',
      data
    });
  } catch (err: any) {
    console.error('[ADMIN UPDATE BLOG POST ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/blog/:id
 * Delete blog post and clean up associated Cloudinary images
 */
blogRouter.delete('/api/admin/blog/:id', async (req, res) => {
  try {
    const result = await blogRepository.deletePost(req.params.id);
    res.json({
      success: true,
      message: 'Blog post and associated Cloudinary media deleted successfully.',
      data: result
    });
  } catch (err: any) {
    console.error('[ADMIN DELETE BLOG POST ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/:id/publish
 */
blogRouter.post('/api/admin/blog/:id/publish', async (req, res) => {
  try {
    const data = await blogRepository.updatePost(req.params.id, { status: 'PUBLISHED' });
    res.json({ success: true, message: 'Blog post published.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/:id/unpublish
 */
blogRouter.post('/api/admin/blog/:id/unpublish', async (req, res) => {
  try {
    const data = await blogRepository.updatePost(req.params.id, { status: 'DRAFT' });
    res.json({ success: true, message: 'Blog post unpublished to draft.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/:id/archive
 */
blogRouter.post('/api/admin/blog/:id/archive', async (req, res) => {
  try {
    const data = await blogRepository.updatePost(req.params.id, { status: 'ARCHIVED' });
    res.json({ success: true, message: 'Blog post archived.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/:id/duplicate
 */
blogRouter.post('/api/admin/blog/:id/duplicate', async (req, res) => {
  try {
    const existing = await blogRepository.getPostBySlug(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Source blog post not found.' });
    }

    const data = await blogRepository.createPost({
      title: `[Copy] ${existing.title}`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      excerpt: existing.excerpt,
      content: existing.content,
      directAnswer: existing.directAnswer,
      keyTakeaways: existing.keyTakeaways,
      categoryId: existing.categoryId,
      authorId: existing.authorId,
      clusterId: existing.clusterId,
      status: 'DRAFT',
      postType: existing.postType,
      searchIntent: existing.searchIntent,
      targetKeyword: existing.targetKeyword,
      secondaryKeywords: existing.secondaryKeywords,
      featured: false,
      coverImageUrl: existing.coverImageUrl,
      coverImagePublicId: existing.coverImagePublicId,
      coverImageAlt: existing.coverImageAlt,
      tagIds: existing.tags?.map((t: any) => t.id),
      serviceIds: existing.services?.map((s: any) => s.id),
      projectIds: existing.projects?.map((p: any) => p.id),
      faqIds: existing.faqs?.map((f: any) => f.id)
    });

    res.json({ success: true, message: 'Blog post duplicated as draft.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/blog/:id/versions
 */
blogRouter.get('/api/admin/blog/:id/versions', async (req, res) => {
  try {
    const data = await blogRepository.getVersions(req.params.id);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/:id/restore
 */
blogRouter.post('/api/admin/blog/:id/restore', async (req, res) => {
  try {
    const { versionId } = req.body;
    if (!versionId) {
      return res.status(400).json({ success: false, error: 'versionId is required.' });
    }

    const data = await blogRepository.restoreVersion(req.params.id, versionId);
    res.json({ success: true, message: 'Blog post version restored.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/categories
 */
blogRouter.post('/api/admin/blog/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required.' });
    }

    const data = await blogRepository.saveCategory(req.body);
    res.json({ success: true, message: 'Blog category saved.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/blog/categories/:id
 */
blogRouter.delete('/api/admin/blog/categories/:id', async (req, res) => {
  try {
    const result = await blogRepository.deleteCategory(req.params.id);
    res.json({ success: true, message: 'Blog category deleted.', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/tags
 */
blogRouter.post('/api/admin/blog/tags', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Tag name is required.' });
    }

    const data = await blogRepository.saveTag(req.body);
    res.json({ success: true, message: 'Blog tag saved.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/blog/tags/:id
 */
blogRouter.delete('/api/admin/blog/tags/:id', async (req, res) => {
  try {
    const result = await blogRepository.deleteTag(req.params.id);
    res.json({ success: true, message: 'Blog tag deleted.', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/authors
 */
blogRouter.post('/api/admin/blog/authors', async (req, res) => {
  try {
    const { name, role } = req.body;
    if (!name || !role) {
      return res.status(400).json({ success: false, error: 'Author name and role are required.' });
    }

    const data = await blogRepository.saveAuthor(req.body);
    res.json({ success: true, message: 'Blog author saved.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/blog/authors/:id
 */
blogRouter.delete('/api/admin/blog/authors/:id', async (req, res) => {
  try {
    const result = await blogRepository.deleteAuthor(req.params.id);
    res.json({ success: true, message: 'Blog author deleted.', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/blog/search-logs
 */
blogRouter.get('/api/admin/blog/search-logs', async (req, res) => {
  try {
    const data = await blogRepository.getSearchLogs(50);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/blog/redirects
 */
blogRouter.get('/api/admin/blog/redirects', async (req, res) => {
  try {
    const data = await blogRepository.getRedirects();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/blog/upload-image
 * Dedicated Multer endpoint uploading blog images to Cloudinary ryzite/blog folder
 */
blogRouter.post('/api/admin/blog/upload-image', uploadMiddleware.single('image'), async (req, res) => {
  try {
    const targetFolder = (req.query.folder as string) || 'ryzite/blog';
    let fileBuffer: Buffer | null = null;
    let filename = `blog_${Date.now()}`;

    if (req.file) {
      fileBuffer = req.file.buffer;
      filename = `blog_${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}`;
    } else if (req.body.fileData) {
      const uploadRes = await cloudinaryService.uploadImage(req.body.fileData, {
        folder: targetFolder,
        filename
      });
      return res.json({ success: true, ...uploadRes });
    }

    if (!fileBuffer) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    const uploadRes = await cloudinaryService.uploadImage(fileBuffer, {
      folder: targetFolder,
      filename
    });

    res.json({
      success: true,
      url: uploadRes.url,
      public_id: uploadRes.public_id,
      width: uploadRes.width,
      height: uploadRes.height
    });
  } catch (err: any) {
    console.error('[BLOG IMAGE UPLOAD ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
