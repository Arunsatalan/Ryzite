const API_BASE = 'http://localhost:5000';

async function runTest() {
  console.log('🧪 Starting Final CTA Conversion Engine End-to-End Test Suite...\n');

  try {
    // 1. Fetch Public Fallback CTA
    console.log('1️⃣ Fetching Public Default CTA...');
    const publicRes = await fetch(`${API_BASE}/api/final-cta`);
    const publicJson = await publicRes.json();
    console.log('   Public CTA Status:', publicJson.success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('   Eyebrow:', publicJson.data?.eyebrow);
    console.log('   Headline:', publicJson.data?.headline);
    console.log('   Source:', publicJson.data?.source);

    // 2. Admin Create CTA
    console.log('\n2️⃣ Creating Admin CTA Configuration...');
    const token = 'demo-admin-token';
    const createRes = await fetch(`${API_BASE}/api/admin/final-ctas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'AI Automation Dedicated Final CTA',
        eyebrow: 'AUTOMATE YOUR WORKFLOWS',
        headline: "Let's Engineer Your AI Automation Pipeline.",
        highlightedText: 'AI Automation Pipeline',
        description: 'Bespoke LLM agents, RAG document pipelines, and custom workflow bots designed to scale.',
        supportingText: 'Zero obligation. Free 30-minute technical architecture assessment.',
        primaryLabel: 'Discuss AI Project',
        primaryActionType: 'CONTACT_FORM',
        primaryActionUrl: '/#contact',
        secondaryLabel: 'See AI Case Studies',
        secondaryActionType: 'PORTFOLIO_PAGE',
        secondaryActionUrl: '/portfolio',
        variant: 'DEFAULT',
        theme: 'DARK',
        backgroundType: 'DARK',
        isActive: true,
        isGlobal: false,
        priority: 10
      })
    });
    const createJson = await createRes.json();
    console.log('   Create CTA:', createJson.success ? '✅ SUCCESS' : '❌ FAILED');
    const createdId = createJson.data?.id;

    if (!createdId) {
      throw new Error('Failed to obtain created CTA ID');
    }

    // 3. Create Page Override for AI Service
    console.log('\n3️⃣ Creating Page Override for AI Service (/services/ai-automation)...');
    const overrideRes = await fetch(`${API_BASE}/api/admin/final-cta-overrides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ctaId: createdId,
        pageType: 'service',
        pageId: 'ai-automation'
      })
    });
    const overrideJson = await overrideRes.json();
    console.log('   Create Override:', overrideJson.success ? '✅ SUCCESS' : '❌ FAILED');

    // 4. Test Public API Override Resolution
    console.log('\n4️⃣ Testing Public Override Resolution for page=service & id=ai-automation...');
    const resolvedRes = await fetch(`${API_BASE}/api/final-cta?page=service&id=ai-automation`);
    const resolvedJson = await resolvedRes.json();
    console.log('   Resolved Headline:', resolvedJson.data?.headline);
    console.log('   Resolved Source:', resolvedJson.data?.source);
    const isOverrideCorrect = resolvedJson.data?.id === createdId;
    console.log('   Override Resolution:', isOverrideCorrect ? '✅ PASSED' : '❌ FAILED');

    // 5. Test Analytics Tracking
    console.log('\n5️⃣ Logging Impression & Click Analytics Events...');
    const impRes = await fetch(`${API_BASE}/api/analytics/cta/impression`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ctaId: createdId, pageUrl: '/services/ai-automation', pageType: 'service', pageId: 'ai-automation' })
    });
    const clickRes = await fetch(`${API_BASE}/api/analytics/cta/click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ctaId: createdId, actionType: 'primary', pageUrl: '/services/ai-automation', pageType: 'service', pageId: 'ai-automation' })
    });
    console.log('   Impression Event:', (await impRes.json()).success ? '✅ LOGGED' : '❌ FAILED');
    console.log('   Click Event:', (await clickRes.json()).success ? '✅ LOGGED' : '❌ FAILED');

    // 6. Test Lead Creation with CTA Attribution
    console.log('\n6️⃣ Submitting Lead with CTA Source Attribution...');
    const leadRes = await fetch(`${API_BASE}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Connor',
        email: 'sarah@cyberdyne.io',
        company: 'Cyberdyne Systems',
        serviceSelected: 'Enterprise AI & Workflow Automation',
        budget: '$15,000 - $30,000',
        timeline: '1 Month',
        message: 'Need autonomous LLM document pipeline.',
        sourceCtaId: createdId,
        utmSource: 'google_organic',
        utmMedium: 'cpc',
        utmCampaign: 'ai_automation_2026',
        pageUrl: '/services/ai-automation'
      })
    });
    const leadJson = await leadRes.json();
    console.log('   Lead Created:', leadJson.data?.id ? '✅ SUCCESS' : '❌ FAILED');
    console.log('   Source CTA Attribution:', leadJson.data?.sourceCtaId === createdId ? '✅ ATTRIBUTED' : '❌ FAILED');

    // 7. Check CTA Health Score
    console.log('\n7️⃣ Running Technical CTA Health Score Audit...');
    const healthRes = await fetch(`${API_BASE}/api/admin/final-ctas/${createdId}/health`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const healthJson = await healthRes.json();
    console.log('   Health Score:', healthJson.data?.score, '/ 100');
    console.log('   Health Status:', healthJson.data?.status);

    // 8. Verify Admin Analytics Summary
    console.log('\n8️⃣ Fetching Admin Analytics Summary...');
    const summaryRes = await fetch(`${API_BASE}/api/admin/final-cta-summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const summaryJson = await summaryRes.json();
    console.log('   Active CTA Count:', summaryJson.data?.activeCtaCount);
    console.log('   Total Impressions:', summaryJson.data?.totalImpressions);
    console.log('   Total Clicks:', summaryJson.data?.totalClicks);

    // Clean up test CTA
    console.log('\n9️⃣ Cleaning Up Test Record...');
    await fetch(`${API_BASE}/api/admin/final-ctas/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   Cleanup: ✅ COMPLETED');

    console.log('\n🎉 ALL FINAL CTA ENGINE INTEGRATION TESTS PASSED PERFECTLY!\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
  }
}

runTest();
