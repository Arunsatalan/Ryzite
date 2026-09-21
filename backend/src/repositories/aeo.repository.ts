import { prisma } from './prisma.js';
import { FactVerifiedStatus, FactCategory, ClaimType, AuditSeverity, StatisticStatus } from '@prisma/client';

export class AeoRepository {
  /**
   * Get or create the single CompanyEntity record.
   */
  static async getCompanyEntity() {
    let entity = await prisma.companyEntity.findFirst();
    if (!entity) {
      entity = await prisma.companyEntity.create({
        data: {
          entityId: 'https://ryzite.com/#organization',
          entityType: 'Organization',
          legalName: 'Ryzite Global Software Inc.',
          tradingName: 'Ryzite',
          shortDescription: 'Ryzite is a modern software engineering and digital marketing agency delivering custom AI solutions, cloud architecture, and full-stack web applications.',
          longDescription: 'Ryzite is an enterprise-grade digital software development & growth marketing agency. We specialize in building scalable web and mobile applications, high-throughput cloud microservices, and AI-driven workflow tools for companies globally.',
          companyType: 'Software Development Agency',
          industry: 'Software Engineering & AI',
          foundedYear: 2022,
          canonicalUrl: 'https://ryzite.com/',
          email: 'contact@ryzite.com',
          phone: '+1 (415) 890-5521',
          primaryCountry: 'USA',
          headquarters: 'San Francisco, CA',
          serviceAreas: ['United States', 'Global', 'North America', 'Europe'],
          languages: ['English'],
          sameAs: [
            'https://github.com/ryzite',
            'https://linkedin.com/company/ryzite',
            'https://twitter.com/ryzite'
          ]
        }
      });
    }
    return entity;
  }

  /**
   * Update the single CompanyEntity record.
   */
  static async updateCompanyEntity(data: Partial<any>) {
    const existing = await this.getCompanyEntity();
    return prisma.companyEntity.update({
      where: { id: existing.id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Get facts with optional filtering.
   */
  static async getFacts(params?: {
    verifiedStatus?: FactVerifiedStatus;
    category?: FactCategory;
    claimType?: ClaimType;
    status?: StatisticStatus;
    search?: string;
  }) {
    const where: any = {};
    if (params?.verifiedStatus) where.verifiedStatus = params.verifiedStatus;
    if (params?.category) where.category = params.category;
    if (params?.claimType) where.claimType = params.claimType;
    if (params?.status) where.status = params.status;
    if (params?.search) {
      where.OR = [
        { question: { contains: params.search, mode: 'insensitive' } },
        { shortAnswer: { contains: params.search, mode: 'insensitive' } },
        { detailedAnswer: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    return prisma.companyFact.findMany({
      where,
      include: {
        evidence: true,
        versions: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: [{ priority: 'desc' }, { displayOrder: 'asc' }, { updatedAt: 'desc' }]
    });
  }

  /**
   * Get strictly PUBLISHED & VERIFIED facts for public / AEO APIs and search engines.
   */
  static async getPublishedVerifiedFacts(category?: FactCategory) {
    const where: any = {
      status: StatisticStatus.PUBLISHED,
      verifiedStatus: FactVerifiedStatus.VERIFIED
    };
    if (category) where.category = category;

    return prisma.companyFact.findMany({
      where,
      include: {
        evidence: {
          where: { status: FactVerifiedStatus.VERIFIED }
        }
      },
      orderBy: [{ priority: 'desc' }, { displayOrder: 'asc' }]
    });
  }

  /**
   * Get single fact by ID.
   */
  static async getFactById(id: string) {
    return prisma.companyFact.findUnique({
      where: { id },
      include: {
        evidence: true,
        versions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  /**
   * Create a new fact.
   */
  static async createFact(data: any) {
    const fact = await prisma.companyFact.create({
      data: {
        category: data.category || FactCategory.COMPANY,
        claimType: data.claimType || ClaimType.FACTUAL,
        question: data.question,
        shortAnswer: data.shortAnswer,
        detailedAnswer: data.detailedAnswer || data.shortAnswer,
        sourceUrl: data.sourceUrl || null,
        sourceType: data.sourceType || 'Official Website',
        evidenceNote: data.evidenceNote || null,
        verifiedStatus: data.verifiedStatus || FactVerifiedStatus.VERIFIED,
        verifiedBy: data.verifiedBy || 'Managing Architect',
        verifiedAt: data.verifiedStatus === FactVerifiedStatus.VERIFIED ? new Date() : null,
        status: data.status || StatisticStatus.PUBLISHED,
        priority: data.priority ?? 1,
        displayOrder: data.displayOrder ?? 0
      }
    });

    // Create initial version
    await prisma.companyFactVersion.create({
      data: {
        factId: fact.id,
        oldValue: {},
        newValue: fact as any,
        changedBy: data.verifiedBy || 'Admin System',
        reason: 'Initial fact creation'
      }
    });

    return fact;
  }

  /**
   * Update existing fact with auto versioning.
   */
  static async updateFact(id: string, data: any) {
    const oldFact = await prisma.companyFact.findUnique({ where: { id } });
    if (!oldFact) throw new Error(`Fact with ID ${id} not found`);

    const updatedFact = await prisma.companyFact.update({
      where: { id },
      data: {
        ...data,
        verifiedAt: data.verifiedStatus === FactVerifiedStatus.VERIFIED ? new Date() : oldFact.verifiedAt,
        updatedAt: new Date()
      }
    });

    // Version track changes
    await prisma.companyFactVersion.create({
      data: {
        factId: id,
        oldValue: oldFact as any,
        newValue: updatedFact as any,
        changedBy: data.changedBy || 'Admin User',
        reason: data.changeReason || 'Updated fact details'
      }
    });

    return updatedFact;
  }

  /**
   * Delete fact.
   */
  static async deleteFact(id: string) {
    return prisma.companyFact.delete({ where: { id } });
  }

  /**
   * FAQs management
   */
  static async getFaqs(status?: StatisticStatus) {
    return prisma.companyFaq.findMany({
      where: status ? { status } : undefined,
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }]
    });
  }

  static async createFaq(data: any) {
    return prisma.companyFaq.create({
      data: {
        question: data.question,
        shortAnswer: data.shortAnswer,
        detailedAnswer: data.detailedAnswer || data.shortAnswer,
        relatedServiceId: data.relatedServiceId || null,
        relatedPage: data.relatedPage || null,
        evidenceUrl: data.evidenceUrl || null,
        status: data.status || StatisticStatus.PUBLISHED,
        displayOrder: data.displayOrder ?? 0
      }
    });
  }

  static async updateFaq(id: string, data: any) {
    return prisma.companyFaq.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  static async deleteFaq(id: string) {
    return prisma.companyFaq.delete({ where: { id } });
  }

  /**
   * Expertise topics management
   */
  static async getExpertise(activeOnly: boolean = false) {
    return prisma.companyExpertise.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ priority: 'desc' }, { displayOrder: 'asc' }]
    });
  }

  static async createExpertise(data: any) {
    return prisma.companyExpertise.create({
      data: {
        topic: data.topic,
        description: data.description,
        priority: data.priority ?? 1,
        active: data.active ?? true,
        displayOrder: data.displayOrder ?? 0,
        relatedServices: data.relatedServices || [],
        relatedProjects: data.relatedProjects || []
      }
    });
  }

  static async updateExpertise(id: string, data: any) {
    return prisma.companyExpertise.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  static async deleteExpertise(id: string) {
    return prisma.companyExpertise.delete({ where: { id } });
  }

  /**
   * Evidence management
   */
  static async addEvidence(data: any) {
    return prisma.companyEvidence.create({
      data: {
        factId: data.factId || null,
        evidenceUrl: data.evidenceUrl,
        evidenceType: data.evidenceType || 'Official Website',
        description: data.description || null,
        status: data.status || FactVerifiedStatus.VERIFIED
      }
    });
  }

  static async deleteEvidence(id: string) {
    return prisma.companyEvidence.delete({ where: { id } });
  }

  /**
   * Calculate Real Dynamic AEO Health Score (0 - 100) from actual database completeness.
   */
  static async calculateAeoHealthScore() {
    const entity = await this.getCompanyEntity();
    const facts = await prisma.companyFact.findMany({ include: { evidence: true, versions: true } });
    const faqs = await prisma.companyFaq.findMany();
    const expertise = await prisma.companyExpertise.findMany();
    const auditIssues = await prisma.seoAuditIssue.findMany({ where: { status: 'OPEN' } });

    let score = 0;
    const breakdown = {
      entityIdentity: 0, // Max 20
      factCompleteness: 0, // Max 20
      evidenceCitations: 0, // Max 15
      structuredSchema: 0, // Max 15
      contentStructure: 0, // Max 10
      internalLinking: 0, // Max 5
      freshness: 0, // Max 5
      consistency: 0, // Max 10
    };

    // 1. Entity Identity (Max 20)
    if (entity.legalName && entity.legalName.trim().length > 3) breakdown.entityIdentity += 4;
    if (entity.tradingName && entity.tradingName.trim().length > 1) breakdown.entityIdentity += 3;
    if (entity.shortDescription && entity.shortDescription.length > 30) breakdown.entityIdentity += 4;
    if (entity.sameAs && Array.isArray(entity.sameAs) && entity.sameAs.length >= 2) breakdown.entityIdentity += 5;
    if (entity.email && entity.headquarters && entity.canonicalUrl) breakdown.entityIdentity += 4;

    // 2. Fact Completeness (Max 20)
    const totalFacts = facts.length;
    const verifiedFacts = facts.filter(f => f.verifiedStatus === FactVerifiedStatus.VERIFIED);
    if (totalFacts > 0) {
      const verifiedRatio = verifiedFacts.length / totalFacts;
      breakdown.factCompleteness += Math.round(verifiedRatio * 10);

      const completeAnswers = facts.filter(f => f.shortAnswer && f.shortAnswer.length >= 10 && f.detailedAnswer);
      breakdown.factCompleteness += Math.round((completeAnswers.length / totalFacts) * 5);

      const categoriesCount = new Set(facts.map(f => f.category)).size;
      if (categoriesCount >= 4) breakdown.factCompleteness += 5;
      else if (categoriesCount >= 2) breakdown.factCompleteness += 3;
    }

    // 3. Evidence & Citations (Max 15)
    if (totalFacts > 0) {
      const factsWithEvidence = facts.filter(f => f.sourceUrl || f.evidenceNote || (f.evidence && f.evidence.length > 0));
      breakdown.evidenceCitations = Math.round((factsWithEvidence.length / totalFacts) * 15);
    }

    // 4. Structured Schema (Max 15)
    if (entity && verifiedFacts.length >= 5 && faqs.length >= 3) breakdown.structuredSchema = 15;
    else if (entity && verifiedFacts.length >= 2) breakdown.structuredSchema = 10;
    else breakdown.structuredSchema = 5;

    // 5. Content Structure (Max 10)
    if (faqs.length >= 3) {
      const directFaqs = faqs.filter(f => f.shortAnswer && f.shortAnswer.length <= 300);
      breakdown.contentStructure = Math.min(10, Math.round((directFaqs.length / faqs.length) * 10));
    }

    // 6. Internal Linking & Expertise Mapping (Max 5)
    if (expertise.length >= 3) breakdown.internalLinking = 5;
    else if (expertise.length >= 1) breakdown.internalLinking = 3;

    // 7. Freshness & Versioning (Max 5)
    const versionedFacts = facts.filter(f => f.versions && f.versions.length > 0);
    if (totalFacts > 0 && versionedFacts.length > 0) {
      breakdown.freshness = Math.min(5, Math.ceil((versionedFacts.length / totalFacts) * 5));
    }

    // 8. Consistency & Discrepancy Prevention (Max 10)
    const requiresReviewFacts = facts.filter(f => f.verifiedStatus === FactVerifiedStatus.REQUIRES_REVIEW || f.verifiedStatus === FactVerifiedStatus.EXPIRED);
    const criticalIssues = auditIssues.filter(i => i.severity === AuditSeverity.CRITICAL);
    let consistencyPoints = 10;
    if (requiresReviewFacts.length > 0) consistencyPoints -= requiresReviewFacts.length * 3;
    if (criticalIssues.length > 0) consistencyPoints -= criticalIssues.length * 2;
    breakdown.consistency = Math.max(0, consistencyPoints);

    // Sum overall score
    score = breakdown.entityIdentity +
      breakdown.factCompleteness +
      breakdown.evidenceCitations +
      breakdown.structuredSchema +
      breakdown.contentStructure +
      breakdown.internalLinking +
      breakdown.freshness +
      breakdown.consistency;

    score = Math.min(100, Math.max(0, score));

    let grade = 'F';
    if (score >= 90) grade = 'A+';
    else if (score >= 80) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 50) grade = 'D';

    return {
      score,
      grade,
      breakdown,
      totals: {
        totalFacts,
        verifiedFacts: verifiedFacts.length,
        unverifiedFacts: facts.filter(f => f.verifiedStatus === FactVerifiedStatus.UNVERIFIED).length,
        requiresReviewFacts: requiresReviewFacts.length,
        totalFaqs: faqs.length,
        totalExpertise: expertise.length,
        openAuditIssues: auditIssues.length
      },
      lastEvaluatedAt: new Date().toISOString()
    };
  }

  /**
   * Run dynamic SEO / AEO audit across DB state.
   */
  static async runSeoAudit() {
    // Clear open issues
    await prisma.seoAuditIssue.deleteMany({ where: { status: 'OPEN' } });

    const entity = await this.getCompanyEntity();
    const facts = await prisma.companyFact.findMany({ include: { evidence: true } });
    const faqs = await prisma.companyFaq.findMany();
    const newIssues: any[] = [];

    // Check Entity identity completeness
    if (!entity.sameAs || entity.sameAs.length === 0) {
      newIssues.push({
        severity: AuditSeverity.WARNING,
        category: 'Entity Identity',
        issue: 'No authoritative social or directory links (sameAs) configured for Organization.',
        recommendation: 'Add GitHub, LinkedIn, Crunchbase, or Twitter URLs to Entity SameAs links to establish knowledge graph authority.',
        pageRoute: '/company-facts'
      });
    }

    if (!entity.phone || !entity.email) {
      newIssues.push({
        severity: AuditSeverity.INFO,
        category: 'Entity Contact',
        issue: 'Official phone or primary email missing from entity metadata.',
        recommendation: 'Specify direct phone and contact email for machine-verified contact schemas.',
        pageRoute: '/company-facts'
      });
    }

    // Check Unverified or Disputed Facts
    const unverified = facts.filter(f => f.verifiedStatus === FactVerifiedStatus.UNVERIFIED);
    if (unverified.length > 0) {
      newIssues.push({
        severity: AuditSeverity.WARNING,
        category: 'Fact Verification',
        issue: `${unverified.length} company fact(s) are listed as UNVERIFIED.`,
        recommendation: 'Verify claim evidence or attach source documentation before publishing to public JSON-LD endpoints.',
        pageRoute: '/admin'
      });
    }

    const reviewNeeded = facts.filter(f => f.verifiedStatus === FactVerifiedStatus.REQUIRES_REVIEW);
    if (reviewNeeded.length > 0) {
      newIssues.push({
        severity: AuditSeverity.CRITICAL,
        category: 'Entity Discrepancy',
        issue: `${reviewNeeded.length} company fact(s) marked as REQUIRES_REVIEW in database.`,
        recommendation: 'Resolve contradictory metrics or re-verify evidence immediately.',
        pageRoute: '/admin'
      });
    }

    // Check Evidence Links
    const missingSource = facts.filter(f => !f.sourceUrl && (!f.evidence || f.evidence.length === 0));
    if (missingSource.length > 0) {
      newIssues.push({
        severity: AuditSeverity.INFO,
        category: 'Evidence Citations',
        issue: `${missingSource.length} fact(s) lack explicit external or internal source URL citations.`,
        recommendation: 'Add sourceUrl or evidence links to strengthen AEO claim trust scores.',
        pageRoute: '/admin'
      });
    }

    // Check FAQs count
    if (faqs.length < 3) {
      newIssues.push({
        severity: AuditSeverity.WARNING,
        category: 'Structured Answers',
        issue: 'Less than 3 Answer Engine FAQs published.',
        recommendation: 'Publish at least 5 concise FAQ items for automatic Google FAQPage schema inclusion.',
        pageRoute: '/company-facts'
      });
    }

    if (newIssues.length > 0) {
      await prisma.seoAuditIssue.createMany({ data: newIssues });
    }

    return prisma.seoAuditIssue.findMany({ orderBy: { createdAt: 'desc' } });
  }

  /**
   * Get all SEO audit issues.
   */
  static async getAuditIssues() {
    return prisma.seoAuditIssue.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
