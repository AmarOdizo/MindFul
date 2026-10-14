const https = require('https');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
let apiKey = '';
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('GEMINI_API_KEY=')) {
    apiKey = trimmed.substring('GEMINI_API_KEY='.length).trim();
  }
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: '/v1beta/models?key=' + apiKey,
  method: 'GET',
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    try {
      const data = JSON.parse(body);
      if (data.models) {
        console.log('Available Models:');
        data.models.forEach(m => console.log(' - ' + m.name + ' (' + (m.supportedGenerationMethods || []).join(', ') + ')'));
      } else {
        console.log('Response:', body);
      }
    } catch (e) {
      console.log('Body:', body);
    }
  });
});

req.on('error', e => console.error('Error:', e.message));
req.end();
