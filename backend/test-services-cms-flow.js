import http from 'http';

function request(method, path, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING SERVICES CMS & IMAGE UPLOAD API INTEGRATION TEST ---');

  // 1. GET Public active services
  const publicRes = await request('GET', '/api/services');
  const publicData = publicRes.body?.data || [];
  console.log(`1. GET /api/services => Status: ${publicRes.status}, Active Services Count: ${publicData.length}`);
  if (publicRes.status !== 200 || !Array.isArray(publicData)) {
    throw new Error('Public GET /api/services failed');
  }

  // 2. GET Admin services
  const adminRes = await request('GET', '/api/services/admin');
  const adminData = adminRes.body?.data || [];
  console.log(`2. GET /api/services/admin => Status: ${adminRes.status}, Admin Services Count: ${adminData.length}`);
  if (adminRes.status !== 200 || !Array.isArray(adminData)) {
    throw new Error('Admin GET /api/services/admin failed');
  }

  // 3. POST Service Image Upload
  const sampleBase64 = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v3AgAA=';
  const uploadPayload = {
    filename: 'ai-automation-test.webp',
    fileData: sampleBase64
  };
  const uploadRes = await request('POST', '/api/upload/service-image', uploadPayload);
  const uploadedImageData = uploadRes.body?.data;
  console.log(`3. POST /api/upload/service-image => Status: ${uploadRes.status}, Image URL: ${uploadedImageData?.url}`);
  if (uploadRes.status !== 200 || !uploadedImageData?.url || !uploadedImageData.url.includes('/uploads/services/')) {
    throw new Error('POST /api/upload/service-image failed');
  }

  // 4. POST Create New Service
  const createPayload = {
    title: 'Autonomous LLM Agent Development',
    slug: 'autonomous-llm-agent-development',
    category: 'ai-automation',
    startingPrice: '$18,500',
    timeline: '4 - 8 Weeks',
    iconName: 'Cpu',
    shortDescription: 'Bespoke multi-agent LLM systems with autonomous web browsing & tool execution.',
    fullDescription: 'Enterprise multi-agent LLM systems engineered with LangChain, LlamaIndex, and custom tool integrations.',
    imageUrl: uploadedImageData.url,
    imageAlt: 'Autonomous LLM Agent Architecture',
    seoTitle: 'Autonomous LLM Agent Development | Ryzite AI',
    seoDescription: 'Build enterprise LLM agents with tool calling and RAG vector store indexing.',
    seoKeywords: 'LLM agents, AI automation, autonomous bots',
    active: true,
    featured: true
  };

  const createRes = await request('POST', '/api/services', createPayload);
  const createdService = createRes.body?.data;
  console.log(`4. POST /api/services => Status: ${createRes.status}, Created ID: ${createdService?.id}`);
  if (createRes.status !== 201 || !createdService?.id) {
    throw new Error('POST /api/services failed');
  }
  const createdId = createdService.id;

  // 5. PUT Update Service
  const updatePayload = {
    ...createPayload,
    title: 'Enterprise LLM Agent & RAG Engineering',
    startingPrice: '$20,000'
  };
  const updateRes = await request('PUT', `/api/services/${createdId}`, updatePayload);
  const updatedService = updateRes.body?.data;
  console.log(`5. PUT /api/services/${createdId} => Status: ${updateRes.status}, Updated Title: ${updatedService?.title}`);
  if (updateRes.status !== 200 || updatedService?.title !== 'Enterprise LLM Agent & RAG Engineering') {
    throw new Error('PUT /api/services/:id failed');
  }

  // 6. PATCH Reorder Services
  const reorderPayload = { orderedIds: [createdId, ...adminData.map(s => s.id)] };
  const reorderRes = await request('PATCH', '/api/services/reorder', reorderPayload);
  console.log(`6. PATCH /api/services/reorder => Status: ${reorderRes.status}, Success: ${Array.isArray(reorderRes.body?.data)}`);
  if (reorderRes.status !== 200) {
    throw new Error('PATCH /api/services/reorder failed');
  }

  // 7. DELETE Test Service
  const deleteRes = await request('DELETE', `/api/services/${createdId}`);
  console.log(`7. DELETE /api/services/${createdId} => Status: ${deleteRes.status}`);
  if (deleteRes.status !== 200 && deleteRes.status !== 204) {
    throw new Error('DELETE /api/services/:id failed');
  }

  console.log('--- ALL SERVICES CMS INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('SERVICES CMS TEST FAILED:', err);
  process.exit(1);
});
