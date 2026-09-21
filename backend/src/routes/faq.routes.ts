import { Router } from 'express';
import { faqRepository } from '../repositories/faq.repository.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

export const faqRouter = Router();

// ===================================================
// PUBLIC FAQ ENDPOINTS
// ===================================================

/**
 * GET /api/faqs
 * Fetch public published FAQs with optional filtering
 */
faqRouter.get('/api/faqs', async (req, res) => {
  try {
    const { category, serviceId, projectId, featured, searchQuery, faqType, limit, offset } = req.query;

    const data = await faqRepository.getPublicFaqs({
      categorySlug: category as string,
      serviceId: serviceId as string,
      projectId: projectId as string,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      searchQuery: searchQuery as string,
      faqType: faqType as string,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0
    });

    res.json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('[PUBLIC FAQs ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/faqs/categories
 * Fetch public active FAQ categories
 */
faqRouter.get('/api/faqs/categories', async (req, res) => {
  try {
    const data = await faqRepository.getCategories();
    res.json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('[PUBLIC FAQ CATEGORIES ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/faqs/search
 * Instant FAQ search with query logging
 */
faqRouter.get('/api/faqs/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.json({ success: true, data: [] });
    }

    const data = await faqRepository.getPublicFaqs({ searchQuery: q });
    res.json({
      success: true,
      query: q,
      count: data.length,
      data
    });
  } catch (err: any) {
    console.error('[PUBLIC FAQ SEARCH ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/faqs/:slug & GET /api/faqs/slug/:slug
 * Single standalone FAQ details by slug
 */
const handleGetFaqBySlug = async (req: any, res: any) => {
  try {
    const data = await faqRepository.getFaqBySlug(req.params.slug);
    if (!data) {
      return res.status(404).json({ success: false, error: 'FAQ item not found' });
    }

    res.json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('[GET FAQ BY SLUG ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

faqRouter.get('/api/faqs/slug/:slug', handleGetFaqBySlug);
faqRouter.get('/api/faqs/:slug', handleGetFaqBySlug);

/**
 * POST /api/faqs/:id/feedback
 * Record helpful / not helpful feedback vote
 */
faqRouter.post('/api/faqs/:id/feedback', async (req, res) => {
  try {
    const { helpful, type, sessionId } = req.body;
    let isHelpful: boolean;

    if (typeof helpful === 'boolean') {
      isHelpful = helpful;
    } else if (type === 'helpful') {
      isHelpful = true;
    } else if (type === 'unhelpful' || type === 'not_helpful') {
      isHelpful = false;
    } else {
      return res.status(400).json({ success: false, error: 'Valid feedback parameter (helpful: boolean or type: "helpful" | "unhelpful") is required.' });
    }

    const result = await faqRepository.submitFeedback(req.params.id, sessionId || 'anon', isHelpful);
    res.json({
      success: true,
      message: 'Feedback recorded successfully.',
      data: result
    });
  } catch (err: any) {
    console.error('[FAQ FEEDBACK SUBMIT ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===================================================
// ADMIN FAQ CMS ENDPOINTS
// ===================================================

/**
 * GET /api/admin/faqs
 * Admin FAQ directory & KPI dashboard metrics
 */
faqRouter.get('/api/admin/faqs', async (req, res) => {
  try {
    const data = await faqRepository.getAdminFaqs();
    res.json({
      success: true,
      data
    });
  } catch (err: any) {
    console.error('[ADMIN GET FAQs ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs
 * Create new FAQ item
 */
faqRouter.post('/api/admin/faqs', async (req, res) => {
  try {
    const { question, shortAnswer, answerContent } = req.body;
    if (!question || !shortAnswer || !answerContent) {
      return res.status(400).json({
        success: false,
        error: 'Question, shortAnswer, and answerContent fields are required.'
      });
    }

    const data = await faqRepository.createFaq(req.body);
    res.status(201).json({
      success: true,
      message: 'FAQ item created successfully.',
      data
    });
  } catch (err: any) {
    console.error('[ADMIN CREATE FAQ ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/admin/faqs/:id
 * Update FAQ item with version snapshot & safe image replacement
 */
faqRouter.put('/api/admin/faqs/:id', async (req, res) => {
  try {
    const data = await faqRepository.updateFaq(req.params.id, req.body);
    res.json({
      success: true,
      message: 'FAQ item updated successfully.',
      data
    });
  } catch (err: any) {
    console.error('[ADMIN UPDATE FAQ ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/faqs/:id
 * Safe transactional delete with Cloudinary asset cleanup
 */
faqRouter.delete('/api/admin/faqs/:id', async (req, res) => {
  try {
    const result = await faqRepository.deleteFaq(req.params.id);
    res.json({
      success: true,
      message: 'FAQ item and associated Cloudinary media deleted successfully.',
      data: result
    });
  } catch (err: any) {
    console.error('[ADMIN DELETE FAQ ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs/:id/publish
 */
faqRouter.post('/api/admin/faqs/:id/publish', async (req, res) => {
  try {
    const data = await faqRepository.updateFaq(req.params.id, { status: 'PUBLISHED' });
    res.json({ success: true, message: 'FAQ published.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs/:id/unpublish
 */
faqRouter.post('/api/admin/faqs/:id/unpublish', async (req, res) => {
  try {
    const data = await faqRepository.updateFaq(req.params.id, { status: 'DRAFT' });
    res.json({ success: true, message: 'FAQ unpublished to draft.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs/:id/archive
 */
faqRouter.post('/api/admin/faqs/:id/archive', async (req, res) => {
  try {
    const data = await faqRepository.updateFaq(req.params.id, { status: 'ARCHIVED' });
    res.json({ success: true, message: 'FAQ archived.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs/:id/duplicate
 */
faqRouter.post('/api/admin/faqs/:id/duplicate', async (req, res) => {
  try {
    const existing = await faqRepository.getFaqBySlug(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Source FAQ not found.' });
    }

    const data = await faqRepository.createFaq({
      question: `[Copy] ${existing.question}`,
      shortAnswer: existing.shortAnswer,
      answerContent: existing.answerContent,
      categoryId: existing.categoryId,
      faqType: existing.faqType,
      status: 'DRAFT',
      featured: false,
      isGlobal: existing.isGlobal,
      indexable: existing.indexable,
      serviceIds: existing.services?.map((s: any) => s.id),
      projectIds: existing.projects?.map((p: any) => p.id)
    });

    res.json({ success: true, message: 'FAQ duplicated as draft.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/admin/faqs/:id/versions
 */
faqRouter.get('/api/admin/faqs/:id/versions', async (req, res) => {
  try {
    const data = await faqRepository.getVersions(req.params.id);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs/:id/restore
 */
faqRouter.post('/api/admin/faqs/:id/restore', async (req, res) => {
  try {
    const { versionId } = req.body;
    if (!versionId) {
      return res.status(400).json({ success: false, error: 'versionId is required.' });
    }

    const data = await faqRepository.restoreVersion(req.params.id, versionId);
    res.json({ success: true, message: 'FAQ version restored.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs/check-duplicates
 */
faqRouter.post('/api/admin/faqs/check-duplicates', async (req, res) => {
  try {
    const { question } = req.body;
    const matches = await faqRepository.checkDuplicates(question);
    res.json({ success: true, matches });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs/categories
 * Save category (create or update)
 */
faqRouter.post('/api/admin/faqs/categories', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required.' });
    }

    const data = await faqRepository.saveCategory(req.body);
    res.json({ success: true, message: 'FAQ category saved.', data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * DELETE /api/admin/faqs/categories/:id
 */
faqRouter.delete('/api/admin/faqs/categories/:id', async (req, res) => {
  try {
    const result = await faqRepository.deleteCategory(req.params.id);
    res.json({ success: true, message: 'FAQ category deleted.', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/admin/faqs/upload-image
 * Dedicated Multer endpoint uploading FAQ image to Cloudinary ryzite/faq folder
 */
faqRouter.post('/api/admin/faqs/upload-image', uploadMiddleware.single('image'), async (req, res) => {
  try {
    let fileBuffer: Buffer | null = null;
    let filename = `faq_${Date.now()}`;

    if (req.file) {
      fileBuffer = req.file.buffer;
      filename = `faq_${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}`;
    } else if (req.body.fileData) {
      const uploadRes = await cloudinaryService.uploadImage(req.body.fileData, {
        folder: 'ryzite/faq',
        filename
      });
      return res.json({ success: true, ...uploadRes });
    }

    if (!fileBuffer) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    const uploadRes = await cloudinaryService.uploadImage(fileBuffer, {
      folder: 'ryzite/faq',
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
    console.error('[FAQ IMAGE UPLOAD ERROR]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
