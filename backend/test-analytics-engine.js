import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:5000';
const ADMIN_TOKEN = 'demo-admin-token';

async function runAnalyticsEndToEndTest() {
  console.log('🧪 Starting Web Analytics & Conversion Intelligence End-to-End Test Suite...\n');

  try {
    const testVisitorId = 'v_e2e_test_' + Date.now();
    const testSessionId = 's_e2e_test_' + Date.now();

    // ==========================================
    // STEP 1: Ingest First-Party Events
    // ==========================================
    console.log('1️⃣ Ingesting First-Party Analytics Events (PageViews, Entity Views, CTAs)...');

    const eventsToIngest = [
      {
        eventName: 'PAGE_VIEW',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/',
        pagePath: '/',
        pageTitle: 'Home | Ryzite',
        deviceType: 'desktop',
        referrer: 'https://google.com',
        referrerHost: 'google.com',
        utmSource: 'google',
        utmMedium: 'organic'
      },
      {
        eventName: 'SERVICE_VIEW',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/services/ai-automation-solutions',
        pagePath: '/services/ai-automation-solutions',
        entityType: 'service',
        entityId: 'ai-automation-solutions',
        deviceType: 'desktop'
      },
      {
        eventName: 'PORTFOLIO_VIEW',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/portfolio/enterprise-saas-platform',
        pagePath: '/portfolio/enterprise-saas-platform',
        entityType: 'portfolio',
        entityId: 'enterprise-saas-platform',
        deviceType: 'desktop'
      },
      {
        eventName: 'BLOG_VIEW',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/blog/ai-first-architecture-2026',
        pagePath: '/blog/ai-first-architecture-2026',
        entityType: 'blog',
        entityId: 'ai-first-architecture-2026',
        deviceType: 'desktop'
      },
      {
        eventName: 'CTA_VIEW',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/',
        pagePath: '/',
        ctaId: 'default-fallback-cta'
      },
      {
        eventName: 'CTA_CLICK',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/',
        pagePath: '/',
        ctaId: 'default-fallback-cta'
      },
      {
        eventName: 'CONTACT_START',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/#contact',
        pagePath: '/#contact'
      },
      {
        eventName: 'OUTBOUND_CLICK',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/',
        pagePath: '/',
        metadata: { targetUrl: 'https://clutch.co/profile/ryzite' }
      },
      {
        eventName: 'DOWNLOAD',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/case-studies',
        pagePath: '/case-studies',
        metadata: { fileUrl: '/downloads/ryzite-case-study.pdf' }
      },
      {
        eventName: '404',
        visitorId: testVisitorId,
        sessionId: testSessionId,
        pageUrl: 'http://localhost:3000/broken-test-link',
        pagePath: '/broken-test-link',
        referrer: 'https://google.com'
      }
    ];

    for (const evt of eventsToIngest) {
      const res = await fetch(`${API_BASE}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evt)
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(`Failed to ingest event ${evt.eventName}: ${json.error}`);
      }
    }
    console.log('   Event Ingestion Status: ✅ SUCCESS (10 events tracked)');

    // ==========================================
    // STEP 2: Ingest RUM Web Vital Metric
    // ==========================================
    console.log('\n2️⃣ Ingesting Real User Web Vital Measurement (LCP)...');
    const vitalRes = await fetch(`${API_BASE}/api/analytics/vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metricName: 'LCP',
        value: 1250,
        rating: 'GOOD',
        pagePath: '/',
        deviceType: 'desktop',
        visitorId: testVisitorId
      })
    });
    const vitalJson = await vitalRes.json();
    if (!vitalJson.success) {
      throw new Error(`Failed to ingest Web Vital: ${vitalJson.error}`);
    }
    console.log('   Web Vital Status: ✅ SUCCESS');

    // ==========================================
    // STEP 3: Verify Admin Overview & Realtime APIs
    // ==========================================
    console.log('\n3️⃣ Querying Admin Overview & Realtime Analytics Endpoints...');
    const headers = { Authorization: `Bearer ${ADMIN_TOKEN}` };

    const [ovRes, rtRes, pgRes, acqRes, ctaRes, vitRes, errRes] = await Promise.all([
      fetch(`${API_BASE}/api/admin/analytics/overview`, { headers }),
      fetch(`${API_BASE}/api/admin/analytics/realtime`, { headers }),
      fetch(`${API_BASE}/api/admin/analytics/pages`, { headers }),
      fetch(`${API_BASE}/api/admin/analytics/acquisition`, { headers }),
      fetch(`${API_BASE}/api/admin/analytics/ctas`, { headers }),
      fetch(`${API_BASE}/api/admin/analytics/web-vitals`, { headers }),
      fetch(`${API_BASE}/api/admin/analytics/404`, { headers })
    ]);

    const [ovJson, rtJson, pgJson, acqJson, ctaJson, vitJson, errJson] = await Promise.all([
      ovRes.json(), rtRes.json(), pgRes.json(), acqRes.json(), ctaRes.json(), vitRes.json(), errRes.json()
    ]);

    console.log(`   Overview Source Label: "${ovJson.data?.source}"`);
    console.log(`   Total PageViews: ${ovJson.data?.kpis?.pageViews?.value}`);
    console.log(`   Unique Visitors: ${ovJson.data?.kpis?.uniqueVisitors?.value}`);
    console.log(`   Realtime Active Visitors: ${rtJson.data?.activeVisitors}`);
    console.log(`   Web Vitals Samples: ${vitJson.data?.totalSamples}`);

    if (!ovJson.success || !rtJson.success || !vitJson.success) {
      throw new Error('❌ Admin endpoints failed to return analytics metrics.');
    }
    console.log('   Admin Analytics Querying: ✅ PASSED');

    // ==========================================
    // STEP 4: Test Disconnected GA4 & Search Console Status
    // ==========================================
    console.log('\n4️⃣ Testing Unconfigured GA4 & Search Console Status Representation...');
    const ga4Res = await fetch(`${API_BASE}/api/admin/analytics/integrations/ga4/sync`, { method: 'POST', headers });
    const gscRes = await fetch(`${API_BASE}/api/admin/analytics/integrations/gsc/sync`, { method: 'POST', headers });

    const ga4Json = await ga4Res.json();
    const gscJson = await gscRes.json();

    console.log(`   GA4 Response: "${ga4Json.status || ga4Json.message}"`);
    console.log(`   Search Console Response: "${gscJson.status || gscJson.message}"`);

    if (ga4Json.status !== 'GA4 Not Connected' || gscJson.status !== 'Search Console Not Connected') {
      throw new Error('❌ Integration status failed to represent disconnected state.');
    }
    console.log('   Integration Status Representation: ✅ PASSED (No fabricated data)');

    // ==========================================
    // STEP 5: Test CSV Export
    // ==========================================
    console.log('\n5️⃣ Testing Analytics CSV Data Export...');
    const csvRes = await fetch(`${API_BASE}/api/admin/analytics/export`, { headers });
    const csvText = await csvRes.text();

    console.log(`   CSV Header: "${csvText.split('\n')[0]}"`);
    if (!csvText.startsWith('Occurred At,Event Name,Page Path')) {
      throw new Error('❌ CSV Export output header mismatch.');
    }
    console.log('   CSV Data Export: ✅ PASSED');

    // ==========================================
    // STEP 6: Clean Up Test Records
    // ==========================================
    console.log('\n6️⃣ Cleaning Up Analytics Test Event Records...');
    await prisma.analyticsEvent.deleteMany({
      where: { visitorId: testVisitorId }
    });
    await prisma.webVitalMetric.deleteMany({
      where: { visitorId: testVisitorId }
    });
    await prisma.brokenUrl404.deleteMany({
      where: { url: '/broken-test-link' }
    });
    console.log('   Cleanup: ✅ COMPLETED');

    console.log('\n🎉 ALL WEB ANALYTICS SYSTEM END-TO-END TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('\n❌ END-TO-END TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAnalyticsEndToEndTest();
