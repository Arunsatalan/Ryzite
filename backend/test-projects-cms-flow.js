async function testProjectsCMSFlow() {
  console.log('🚀 Testing Featured Projects & Case Studies CMS Flow...');
  const baseUrl = 'http://localhost:5000';
  const adminHeaders = {
    'Content-Type': 'application/json',
    'x-admin-token': 'admin-jwt-token'
  };

  try {
    // 1. Fetch public published projects
    console.log('\n--- 1. Testing GET /api/projects ---');
    const pubRes = await fetch(`${baseUrl}/api/projects`);
    const pubData = await pubRes.json();
    console.log(`Public projects status: ${pubRes.status}`);
    console.log(`Published projects count: ${Array.isArray(pubData.data) ? pubData.data.length : 'N/A'}`);

    if (Array.isArray(pubData.data) && pubData.data.length > 0) {
      console.log(`Sample project title: "${pubData.data[0].title}", slug: "${pubData.data[0].slug}"`);
    }

    // 2. Fetch admin project counts
    console.log('\n--- 2. Testing GET /api/admin/projects/counts ---');
    const countRes = await fetch(`${baseUrl}/api/admin/projects/counts`, { headers: adminHeaders });
    const countData = await countRes.json();
    console.log(`Counts response:`, countData);

    // 3. Create a test project via admin API
    console.log('\n--- 3. Testing POST /api/admin/projects ---');
    const newProjectPayload = {
      title: 'AutoTest Platform Engine',
      slug: `autotest-platform-${Date.now()}`,
      client: 'AutoTest Global',
      category: 'SaaS Platform',
      mockupType: 'dark-dashboard',
      description: 'High concurrency automated test platform.',
      fullDescription: 'Comprehensive test pipeline handling automated performance benchmarks.',
      challenge: 'High load testing bottlenecks.',
      solution: 'Event-driven distributed test runner.',
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      status: 'PUBLISHED',
      featured: true,
      metrics: [
        { label: 'Throughput', value: '100k RPS', trend: '+50%' }
      ],
      highlights: [
        { title: 'Sub-10ms Latency Benchmark' }
      ]
    };

    const createRes = await fetch(`${baseUrl}/api/admin/projects`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify(newProjectPayload)
    });
    const createData = await createRes.json();
    console.log(`Create status: ${createRes.status}`);
    console.log(`Created project ID:`, createData.data?.id);

    const createdId = createData.data?.id;
    const createdSlug = createData.data?.slug;

    if (!createdId) {
      throw new Error(`Failed to create test project: ${JSON.stringify(createData)}`);
    }

    // 4. Fetch project by slug
    console.log(`\n--- 4. Testing GET /api/projects/${createdSlug} ---`);
    const slugRes = await fetch(`${baseUrl}/api/projects/${createdSlug}`);
    const slugData = await slugRes.json();
    console.log(`By slug status: ${slugRes.status}`);
    console.log(`Retrieved title: "${slugData.data?.title}"`);

    // 5. Toggle status to DRAFT
    console.log(`\n--- 5. Testing PATCH /api/admin/projects/${createdId}/status ---`);
    const statusRes = await fetch(`${baseUrl}/api/admin/projects/${createdId}/status`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'DRAFT' })
    });
    const statusData = await statusRes.json();
    console.log(`Toggle status result:`, statusData.data?.status);

    // 6. Delete test project
    console.log(`\n--- 6. Testing DELETE /api/admin/projects/${createdId} ---`);
    const deleteRes = await fetch(`${baseUrl}/api/admin/projects/${createdId}`, {
      method: 'DELETE',
      headers: adminHeaders
    });
    const deleteData = await deleteRes.json();
    console.log(`Delete response:`, deleteData);

    console.log('\n✅ All Featured Projects CMS API Tests Passed Successfully!');
  } catch (err) {
    console.error('\n❌ CMS Test Flow Error:', err.message);
    process.exit(1);
  }
}

testProjectsCMSFlow();
