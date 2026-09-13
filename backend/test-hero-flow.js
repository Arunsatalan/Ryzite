const API_BASE = 'http://127.0.0.1:5000';

async function testHeroFlow() {
  console.log('🧪 Starting End-to-End Hero CMS & Database Verification Test...\n');

  try {
    // 1. Fetch initial Hero from API
    console.log('1. Testing GET /api/home/hero...');
    const resGet1 = await fetch(`${API_BASE}/api/home/hero`);
    const jsonGet1 = await resGet1.json();
    console.log('   Response Status:', resGet1.status);
    console.log('   Hero Heading Prefix:', jsonGet1.data?.headingPrefix);
    console.log('   Hero Heading Highlight:', jsonGet1.data?.headingHighlight);
    if (!jsonGet1.success || !jsonGet1.data) throw new Error('GET /api/home/hero failed!');
    console.log('   ✅ GET /api/home/hero PASS\n');

    // Store original hero data to restore later
    const originalHero = jsonGet1.data;

    // 2. Test PUT /api/home/hero with updated title
    console.log('2. Testing PUT /api/home/hero (Updating heading to test payload)...');
    const testPayload = {
      ...originalHero,
      headingPrefix: 'Ryzite Builds Products',
      headingHighlight: 'That Scale',
      headingSuffix: 'Every Day',
      badgeText: 'VERIFIED AUTOMATED TEST BADGE'
    };

    const resPut = await fetch(`${API_BASE}/api/home/hero`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    const jsonPut = await resPut.json();
    console.log('   Response Status:', resPut.status);
    console.log('   Updated Prefix:', jsonPut.data?.headingPrefix);
    if (!jsonPut.success || jsonPut.data?.headingPrefix !== 'Ryzite Builds Products') {
      throw new Error('PUT /api/home/hero failed to update database!');
    }
    console.log('   ✅ PUT /api/home/hero PASS\n');

    // 3. Verify PostgreSQL Persistence via second GET
    console.log('3. Verifying PostgreSQL persistence via GET /api/home/hero...');
    const resGet2 = await fetch(`${API_BASE}/api/home/hero`);
    const jsonGet2 = await resGet2.json();
    console.log('   Retrieved Prefix:', jsonGet2.data?.headingPrefix);
    console.log('   Retrieved Badge:', jsonGet2.data?.badgeText);
    if (jsonGet2.data?.headingPrefix !== 'Ryzite Builds Products') {
      throw new Error('PostgreSQL persistence verification failed!');
    }
    console.log('   ✅ PostgreSQL Persistence PASS\n');

    // 4. Restore original production Hero values
    console.log('4. Restoring production Hero values...');
    const resRestore = await fetch(`${API_BASE}/api/home/hero`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(originalHero)
    });
    const jsonRestore = await resRestore.json();
    if (jsonRestore.data?.headingPrefix !== originalHero.headingPrefix) {
      throw new Error('Failed to restore original production Hero configuration!');
    }
    console.log('   ✅ Production Hero Restored PASS\n');

    // 5. Test SEO Metadata API for Home Page
    console.log('5. Testing GET /api/seo?pageKey=home...');
    const resSeo = await fetch(`${API_BASE}/api/seo?pageKey=home`);
    const jsonSeo = await resSeo.json();
    console.log('   SEO Title:', jsonSeo.data?.title);
    console.log('   Canonical URL:', jsonSeo.data?.canonicalUrl);
    if (!jsonSeo.data?.title || !jsonSeo.data?.canonicalUrl) {
      throw new Error('Home SEO metadata verification failed!');
    }
    console.log('   ✅ Home SEO Endpoint PASS\n');

    console.log('🎉 ALL END-TO-END HERO & SEO TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ E2E TEST FAILED:', err.message);
    process.exit(1);
  }
}

testHeroFlow();
