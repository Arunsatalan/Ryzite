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
  console.log('--- STARTING TRUSTED CLIENTS API INTEGRATION TEST ---');

  // 1. GET Public trusted clients
  const publicRes = await request('GET', '/api/trusted-clients');
  const publicData = publicRes.body?.data || [];
  console.log(`1. GET /api/trusted-clients => Status: ${publicRes.status}, Count: ${publicData.length}`);
  if (publicRes.status !== 200 || !Array.isArray(publicData)) {
    throw new Error('Public GET failed');
  }

  // 2. GET Admin trusted clients
  const adminRes = await request('GET', '/api/trusted-clients/admin');
  const adminData = adminRes.body?.data || [];
  console.log(`2. GET /api/trusted-clients/admin => Status: ${adminRes.status}, Count: ${adminData.length}`);
  if (adminRes.status !== 200 || !Array.isArray(adminData)) {
    throw new Error('Admin GET failed');
  }

  // 3. POST Create new trusted client
  const createPayload = {
    name: 'Quantum Horizon Labs',
    companyName: 'Quantum Horizon Labs LLC',
    logoUrl: '/clients/quantum.svg',
    logoAltText: 'Quantum Horizon Labs company logo',
    websiteUrl: 'https://quantumhorizon.io',
    caseStudySlug: 'quantum-cloud-transformation',
    featured: true,
    enabled: true
  };
  const createRes = await request('POST', '/api/trusted-clients', createPayload);
  const createdClient = createRes.body?.data;
  console.log(`3. POST /api/trusted-clients => Status: ${createRes.status}, Created ID: ${createdClient?.id}`);
  if (createRes.status !== 201 || !createdClient?.id) {
    throw new Error('POST create failed');
  }
  const createdId = createdClient.id;

  // 4. PUT Update trusted client
  const updatePayload = {
    ...createPayload,
    name: 'Quantum Horizon AI Systems',
    featured: false
  };
  const updateRes = await request('PUT', `/api/trusted-clients/${createdId}`, updatePayload);
  const updatedClient = updateRes.body?.data;
  console.log(`4. PUT /api/trusted-clients/${createdId} => Status: ${updateRes.status}, Updated Name: ${updatedClient?.name}`);
  if (updateRes.status !== 200 || updatedClient?.name !== 'Quantum Horizon AI Systems') {
    throw new Error('PUT update failed');
  }

  // 5. PATCH Reorder trusted clients
  const reorderPayload = { orderedIds: [createdId, ...adminData.map(c => c.id)] };
  const reorderRes = await request('PATCH', '/api/trusted-clients/reorder', reorderPayload);
  console.log(`5. PATCH /api/trusted-clients/reorder => Status: ${reorderRes.status}, Success: ${reorderRes.body?.success}`);
  if (reorderRes.status !== 200) {
    throw new Error('PATCH reorder failed');
  }

  // 6. DELETE trusted client
  const deleteRes = await request('DELETE', `/api/trusted-clients/${createdId}`);
  console.log(`6. DELETE /api/trusted-clients/${createdId} => Status: ${deleteRes.status}`);
  if (deleteRes.status !== 200 && deleteRes.status !== 204) {
    throw new Error('DELETE failed');
  }

  console.log('--- ALL TRUSTED CLIENTS API INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
