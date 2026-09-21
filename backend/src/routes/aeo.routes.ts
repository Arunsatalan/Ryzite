import { Router } from 'express';
import { AeoRepository } from '../repositories/aeo.repository.js';

export const aeoRouter = Router();

// ==========================================
// ENTITY METADATA ENDPOINTS
// ==========================================

// GET /api/company/entity
aeoRouter.get('/entity', async (req, res) => {
  try {
    const entity = await AeoRepository.getCompanyEntity();
    res.json({ success: true, data: entity });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/company/entity
aeoRouter.put('/entity', async (req, res) => {
  try {
    const entity = await AeoRepository.updateCompanyEntity(req.body);
    res.json({ success: true, data: entity });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// COMPANY FACTS ENDPOINTS
// ==========================================

// GET /api/company/facts (admin view / filtered)
aeoRouter.get('/facts', async (req, res) => {
  try {
    const { verifiedStatus, category, claimType, status, search } = req.query as any;
    const facts = await AeoRepository.getFacts({
      verifiedStatus,
      category,
      claimType,
      status,
      search
    });
    res.json({ success: true, data: facts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/company-facts (public machine-readable & AEO Direct Answer endpoint)
aeoRouter.get('/public-facts', async (req, res) => {
  try {
    const entity = await AeoRepository.getCompanyEntity();
    const facts = await AeoRepository.getPublishedVerifiedFacts();
    const faqs = await AeoRepository.getFaqs('PUBLISHED' as any);
    const expertise = await AeoRepository.getExpertise(true);
    const health = await AeoRepository.calculateAeoHealthScore();

    // Construct standard Schema.org JSON-LD
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': entity.entityType || 'Organization',
          '@id': entity.entityId,
          'name': entity.tradingName,
          'legalName': entity.legalName,
          'url': entity.canonicalUrl,
          'logo': entity.logoUrl,
          'email': entity.email,
          'telephone': entity.phone,
          'description': entity.shortDescription,
          'foundingDate': `${entity.foundedYear}-01-01`,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': entity.headquarters,
            'addressCountry': entity.primaryCountry
          },
          'sameAs': entity.sameAs || [],
          'knowsAbout': expertise.map(e => e.topic)
        },
        {
          '@type': 'FAQPage',
          'mainEntity': faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.shortAnswer
            }
          }))
        }
      ]
    };

    res.json({
      success: true,
      meta: {
        entity: entity.tradingName,
        legalName: entity.legalName,
        canonicalUrl: entity.canonicalUrl,
        verifiedFactsCount: facts.length,
        aeoHealthScore: health.score,
        aeoGrade: health.grade,
        lastUpdated: new Date().toISOString()
      },
      entity,
      facts,
      faqs,
      expertise,
      jsonLd
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/company/facts
aeoRouter.post('/facts', async (req, res) => {
  try {
    const fact = await AeoRepository.createFact(req.body);
    res.status(201).json({ success: true, data: fact });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/company/facts/:id
aeoRouter.put('/facts/:id', async (req, res) => {
  try {
    const fact = await AeoRepository.updateFact(req.params.id, req.body);
    res.json({ success: true, data: fact });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/company/facts/:id
aeoRouter.delete('/facts/:id', async (req, res) => {
  try {
    await AeoRepository.deleteFact(req.params.id);
    res.json({ success: true, message: 'Fact deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/company/facts/:id
aeoRouter.get('/facts/:id', async (req, res) => {
  try {
    const fact = await AeoRepository.getFactById(req.params.id);
    if (!fact) return res.status(404).json({ success: false, error: 'Fact not found' });
    res.json({ success: true, data: fact });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// COMPANY FAQS ENDPOINTS
// ==========================================

// GET /api/company/faqs
aeoRouter.get('/faqs', async (req, res) => {
  try {
    const faqs = await AeoRepository.getFaqs();
    res.json({ success: true, data: faqs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/company/faqs
aeoRouter.post('/faqs', async (req, res) => {
  try {
    const faq = await AeoRepository.createFaq(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/company/faqs/:id
aeoRouter.put('/faqs/:id', async (req, res) => {
  try {
    const faq = await AeoRepository.updateFaq(req.params.id, req.body);
    res.json({ success: true, data: faq });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/company/faqs/:id
aeoRouter.delete('/faqs/:id', async (req, res) => {
  try {
    await AeoRepository.deleteFaq(req.params.id);
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// EXPERTISE ENDPOINTS
// ==========================================

// GET /api/company/expertise
aeoRouter.get('/expertise', async (req, res) => {
  try {
    const expertise = await AeoRepository.getExpertise();
    res.json({ success: true, data: expertise });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/company/expertise
aeoRouter.post('/expertise', async (req, res) => {
  try {
    const item = await AeoRepository.createExpertise(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/company/expertise/:id
aeoRouter.put('/expertise/:id', async (req, res) => {
  try {
    const item = await AeoRepository.updateExpertise(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/company/expertise/:id
aeoRouter.delete('/expertise/:id', async (req, res) => {
  try {
    await AeoRepository.deleteExpertise(req.params.id);
    res.json({ success: true, message: 'Expertise deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// EVIDENCE ENDPOINTS
// ==========================================

// POST /api/company/evidence
aeoRouter.post('/evidence', async (req, res) => {
  try {
    const evidence = await AeoRepository.addEvidence(req.body);
    res.status(201).json({ success: true, data: evidence });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/company/evidence/:id
aeoRouter.delete('/evidence/:id', async (req, res) => {
  try {
    await AeoRepository.deleteEvidence(req.params.id);
    res.json({ success: true, message: 'Evidence deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// SEO & AEO HEALTH + AUDIT ENDPOINTS
// ==========================================

// GET /api/seo/health
aeoRouter.get('/seo/health', async (req, res) => {
  try {
    const health = await AeoRepository.calculateAeoHealthScore();
    res.json({ success: true, data: health });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/seo/audit
aeoRouter.post('/seo/audit', async (req, res) => {
  try {
    const issues = await AeoRepository.runSeoAudit();
    const health = await AeoRepository.calculateAeoHealthScore();
    res.json({ success: true, issues, health });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/seo/issues
aeoRouter.get('/seo/issues', async (req, res) => {
  try {
    const issues = await AeoRepository.getAuditIssues();
    res.json({ success: true, data: issues });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
