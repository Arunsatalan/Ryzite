import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:5000';
const ADMIN_TOKEN = 'demo-admin-token';

async function runEndToEndTest() {
  console.log('🧪 Starting End-to-End Final CTA Data Flow Verification Test Suite...\n');

  try {
    // 1. Fetch current global active CTA from DB
    const currentCta = await prisma.finalCta.findFirst({
      where: { isActive: true }
    });

    if (!currentCta) {
      throw new Error('No active CTA found in PostgreSQL database.');
    }

    const targetCtaId = currentCta.id;
    console.log(`📌 Found Target CTA in PostgreSQL (ID: ${targetCtaId})`);
    console.log(`   Original Headline: "${currentCta.headline}"`);

    // ==========================================
    // TEST A: Admin Update
    // ==========================================
    console.log('\n--- TEST A: Admin Update API (`PUT /api/admin/final-ctas/:id`) ---');
    const updatePayload = {
      name: 'E2E Test CTA',
      headline: 'TEST CTA 2026',
      highlightedText: 'CTA 2026',
      description: 'TEST DESCRIPTION 2026',
      primaryLabel: 'TEST BUTTON',
      primaryActionType: 'CONTACT_FORM',
      primaryActionUrl: '/#contact',
      isActive: true,
      isGlobal: true,
      status: 'ACTIVE',
      pageTarget: 'GLOBAL'
    };

    const updateRes = await fetch(`${API_BASE}/api/admin/final-ctas/${targetCtaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(updatePayload)
    });

    const updateJson = await updateRes.json();
    if (!updateJson.success) {
      throw new Error(`Admin Update failed: ${updateJson.error}`);
    }
    console.log('✅ Admin Save Response: SUCCESS');

    // ==========================================
    // TEST B: PostgreSQL Direct Verification
    // ==========================================
    console.log('\n--- TEST B: Direct PostgreSQL Database Query ---');
    const dbCta = await prisma.finalCta.findUnique({
      where: { id: targetCtaId }
    });

    console.log(`   PostgreSQL Headline: "${dbCta?.headline}"`);
    console.log(`   PostgreSQL Description: "${dbCta?.description}"`);
    console.log(`   PostgreSQL Primary Button: "${dbCta?.primaryLabel}"`);

    if (
      dbCta?.headline !== 'TEST CTA 2026' ||
      dbCta?.description !== 'TEST DESCRIPTION 2026' ||
      dbCta?.primaryLabel !== 'TEST BUTTON'
    ) {
      throw new Error('❌ TEST B FAILED: PostgreSQL values do not match update payload!');
    }
    console.log('✅ TEST B PASSED: PostgreSQL is updated as the Single Source of Truth!');

    // ==========================================
    // TEST C: Public GET API Verification
    // ==========================================
    console.log('\n--- TEST C: Public GET Endpoint (`GET /api/final-cta?page=home`) ---');
    const getRes = await fetch(`${API_BASE}/api/final-cta?page=home&_t=${Date.now()}`);
    const getJson = await getRes.json();

    if (!getJson.success || !getJson.data) {
      throw new Error('❌ GET /api/final-cta failed to return data.');
    }

    console.log(`   GET API Headline: "${getJson.data.headline}"`);
    console.log(`   GET API Description: "${getJson.data.description}"`);
    console.log(`   GET API Primary Button: "${getJson.data.primaryLabel}"`);
    console.log(`   GET API Source: "${getJson.data.source}"`);

    if (
      getJson.data.headline !== 'TEST CTA 2026' ||
      getJson.data.description !== 'TEST DESCRIPTION 2026' ||
      getJson.data.primaryLabel !== 'TEST BUTTON'
    ) {
      throw new Error('❌ TEST C FAILED: GET API returned stale or mismatching content!');
    }
    console.log('✅ TEST C PASSED: GET API returned updated PostgreSQL values dynamically!');

    // ==========================================
    // TEST D & E: Restore Production Copy
    // ==========================================
    console.log('\n--- TEST D & E: Restore Production Copy & Verify ---');
    const restorePayload = {
      name: currentCta.name,
      eyebrow: currentCta.eyebrow || "READY TO BUILD WHAT'S NEXT?",
      headline: "Let's Turn Your Next Big Idea Into Reality.",
      highlightedText: "Next Big Idea",
      description: "From AI-powered automation and custom software to cloud infrastructure and digital products, we help ambitious businesses design, build, and scale reliable technology.",
      supportingText: "Tell us what you're building. We'll help you figure out the right technical path.",
      primaryLabel: "Start a Project",
      primaryActionType: "CONTACT_FORM",
      primaryActionUrl: "/#contact",
      secondaryLabel: "Explore Our Work",
      secondaryActionType: "PORTFOLIO_PAGE",
      secondaryActionUrl: "/portfolio",
      isActive: true,
      isGlobal: true,
      status: 'ACTIVE',
      pageTarget: 'GLOBAL'
    };

    await fetch(`${API_BASE}/api/admin/final-ctas/${targetCtaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(restorePayload)
    });

    const verifyRestored = await fetch(`${API_BASE}/api/final-cta?page=home&_t=${Date.now()}`);
    const verifyRestoredJson = await verifyRestored.json();

    console.log(`   Restored Headline: "${verifyRestoredJson.data.headline}"`);
    if (verifyRestoredJson.data.headline !== "Let's Turn Your Next Big Idea Into Reality.") {
      throw new Error('❌ Restore failed to revert headline to production copy.');
    }
    console.log('✅ TEST D & E PASSED: Successfully restored production content!');

    // ==========================================
    // TEST F: Analytics Click & Lead Attribution
    // ==========================================
    console.log('\n--- TEST F: Analytics Click & Lead Attribution ---');
    const clickRes = await fetch(`${API_BASE}/api/analytics/cta/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ctaId: targetCtaId,
        actionType: 'primary',
        pageType: 'home'
      })
    });
    const clickJson = await clickRes.json();

    if (!clickJson.success || clickJson.data.ctaId !== targetCtaId) {
      throw new Error('❌ Analytics click event failed or recorded wrong ctaId.');
    }
    console.log(`   Analytics Event CTA ID: "${clickJson.data.ctaId}"`);
    console.log('✅ TEST F PASSED: Analytics click event attributed correctly to database CTA ID!');

    console.log('\n🎉 ALL END-TO-END CTA INTEGRATION TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runEndToEndTest();
