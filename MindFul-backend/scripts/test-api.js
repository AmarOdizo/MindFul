const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let respData = '';
      res.on('data', chunk => respData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(respData || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, raw: respData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname: 'localhost',
      port: 5000,
      path: path
    }, (res) => {
      let respData = '';
      res.on('data', chunk => respData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(respData || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, raw: respData });
        }
      });
    });
    req.on('error', reject);
  });
}

async function run() {
  console.log('--- 1. Testing Register POST API ---');
  const regRes = await post('/api/auth/register', {
    name: 'Elena Gilbert',
    email: 'elena' + Date.now() + '@example.com',
    password: 'password123'
  });
  console.log('Register Response:', regRes);
}

run().catch(console.error);
