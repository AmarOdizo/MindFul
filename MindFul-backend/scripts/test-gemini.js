var https = require('https');
var fs = require('fs');
var path = require('path');

var envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
var apiKey = '';
envContent.split('\n').forEach(function(line) {
  var trimmed = line.trim();
  if (trimmed.indexOf('GEMINI_API_KEY=') === 0) {
    apiKey = trimmed.substring('GEMINI_API_KEY='.length).trim();
  }
});

console.log('Testing Gemini API key:', apiKey);

var postData = JSON.stringify({
  contents: [{ parts: [{ text: "Hello, reply with one word." }] }]
});

var options = {
  hostname: 'generativelanguage.googleapis.com',
  port: 443,
  path: '/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Sending request to Google Generative Language API...');
var req = https.request(options, function(res) {
  var body = '';
  res.on('data', function(chunk) { body += chunk; });
  res.on('end', function() {
    console.log('HTTP Status:', res.statusCode);
    console.log('Response Body:', body);
  });
});

req.on('error', function(e) {
  console.error('Request error:', e.message);
});

req.write(postData);
req.end();
