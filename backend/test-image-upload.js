import http from 'http';

function uploadTestImage() {
  return new Promise((resolve, reject) => {
    // 1x1 transparent PNG base64
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSU5EEAAAAElFTkSuQmCC';
    const payload = JSON.stringify({
      filename: 'test-client-logo.png',
      fileData: sampleBase64
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
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
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('--- TESTING LOCAL FILE UPLOADS ENDPOINT ---');
  const res = await uploadTestImage();
  console.log(`Status: ${res.status}`);
  console.log('Response:', JSON.stringify(res.body, null, 2));

  if (res.status === 200 && res.body?.success && res.body?.data?.url) {
    console.log('--- LOCAL DISK IMAGE UPLOAD VERIFIED SUCCESSFULLY! ---');
  } else {
    throw new Error('Upload test failed');
  }
}

run().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
