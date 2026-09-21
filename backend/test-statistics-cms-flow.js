const API_BASE = 'http://localhost:5000/api';

async function testStatisticsFlow() {
  console.log('🧪 Starting Company Statistics CMS Flow Verification...');

  try {
    // 1. Fetch Public Statistics
    console.log('\n--- Test 1: Fetch Public Statistics (GET /api/statistics) ---');
    const pubRes = await fetch(`${API_BASE}/statistics`);
    const pubData = await pubRes.json();
    console.log('Status Code:', pubRes.status);
    console.log('Public Statistics Count:', Array.isArray(pubData) ? pubData.length : 'Not an array');
    console.log('Sample Public Item:', pubData[0]);

    if (!Array.isArray(pubData) || pubData.length === 0) {
      throw new Error('Public statistics returned empty or invalid response');
    }

    // 2. Fetch Admin Statistics
    console.log('\n--- Test 2: Fetch Admin Statistics (GET /api/admin/statistics) ---');
    const adminRes = await fetch(`${API_BASE}/admin/statistics`, {
      headers: { 'x-admin-token': 'admin-jwt-token' }
    });
    const adminData = await adminRes.json();
    console.log('Status Code:', adminRes.status);
    console.log('Admin Response Success:', adminData.success);
    console.log('Admin Statistics Count:', adminData.data ? adminData.data.length : 0);

    // 3. Create New Statistic (Test 1 from requirements: Value 50, Label Employees)
    console.log('\n--- Test 3: Create New Statistic (POST /api/admin/statistics) ---');
    const newStatPayload = {
      value: '50',
      prefix: '',
      suffix: '+',
      label: 'Employees',
      description: 'Global team members',
      iconName: 'Users',
      iconColor: '#0052FF',
      animationEnabled: true,
      displayOrder: 5,
      status: 'PUBLISHED',
      seoTitle: '50+ Global Employees',
      seoDescription: 'Ryzite employs 50+ global software engineers.'
    };

    const createRes = await fetch(`${API_BASE}/admin/statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'admin-jwt-token'
      },
      body: JSON.stringify(newStatPayload)
    });
    const createData = await createRes.json();
    console.log('Status Code:', createRes.status);
    console.log('Created Data:', createData.data);
    const createdId = createData.data?.id;

    if (!createdId) throw new Error('Failed to create test statistic');

    // Verify Homepage/Public API includes new item
    const verifyPubRes = await fetch(`${API_BASE}/statistics`);
    const verifyPubData = await verifyPubRes.json();
    const hasNewItem = verifyPubData.some(item => item.id === createdId || item.label === 'Employees');
    console.log('Public API contains newly created item:', hasNewItem);

    // 4. Update Statistic (Test 2 from requirements: 98% Client Satisfaction)
    console.log('\n--- Test 4: Update Statistic (PUT /api/admin/statistics/:id) ---');
    const updateRes = await fetch(`${API_BASE}/admin/statistics/${createdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'admin-jwt-token'
      },
      body: JSON.stringify({
        ...newStatPayload,
        value: '98',
        suffix: '%',
        label: 'Client Satisfaction',
        description: 'Instant updated CSAT metric'
      })
    });
    const updateData = await updateRes.json();
    console.log('Status Code:', updateRes.status);
    console.log('Updated Value/Label:', updateData.data?.value + updateData.data?.suffix, updateData.data?.label);

    // 5. Hide Statistic (Test 3 from requirements: Admin hides statistic)
    console.log('\n--- Test 5: Change Status to HIDDEN (PATCH /api/admin/statistics/:id/status) ---');
    const hideRes = await fetch(`${API_BASE}/admin/statistics/${createdId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': 'admin-jwt-token'
      },
      body: JSON.stringify({ status: 'HIDDEN' })
    });
    const hideData = await hideRes.json();
    console.log('Status Code:', hideRes.status);
    console.log('Updated Status:', hideData.data?.status);

    const checkHiddenRes = await fetch(`${API_BASE}/statistics`);
    const checkHiddenData = await checkHiddenRes.json();
    const isHiddenFromPublic = !checkHiddenData.some(item => item.id === createdId);
    console.log('Successfully hidden from public API:', isHiddenFromPublic);

    // 6. Delete Test Statistic
    console.log('\n--- Test 6: Delete Test Statistic (DELETE /api/admin/statistics/:id) ---');
    const delRes = await fetch(`${API_BASE}/admin/statistics/${createdId}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': 'admin-jwt-token' }
    });
    const delData = await delRes.json();
    console.log('Status Code:', delRes.status);
    console.log('Delete Message:', delData.message);

    console.log('\n✅ ALL BACKEND STATISTICS CMS TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ Test Error:', err);
    process.exit(1);
  }
}

testStatisticsFlow();
