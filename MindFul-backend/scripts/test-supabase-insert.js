const https = require('https');

const data = JSON.stringify({
  name: 'Test User',
  email: 'test' + Date.now() + '@example.com',
  password: 'hashedpassword'
});

const req = https.request({
  hostname: 'ihjnxqewzcupshivqqnu.supabase.co',
  port: 443,
  path: '/rest/v1/users',
  method: 'POST',
  headers: {
    'apikey': 'sb_publishable_1FaEFOz5MdUkCnF3qUttEQ_Q0QwBcSF',
    'Authorization': 'Bearer sb_publishable_1FaEFOz5MdUkCnF3qUttEQ_Q0QwBcSF',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', console.error);
req.write(data);
req.end();
