const https = require('https');
const fs = require('fs');
const path = require('path');

// Read .env manually to avoid any dotenv issues
const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('SUPABASE_URL=')) {
    supabaseUrl = trimmed.split('=')[1].trim();
  }
  if (trimmed.startsWith('SUPABASE_KEY=')) {
    supabaseKey = trimmed.split('=')[1].trim();
  }
});

console.log('Testing Supabase Host:', supabaseUrl);

const tables = ['users', 'mood_logs', 'journal_entries', 'chat_messages'];

const urlModule = require('url');

function checkTable(tableName) {
  return new Promise(function(resolve) {
    var parsedUrl;
    if (typeof URL !== 'undefined') {
      parsedUrl = new URL(supabaseUrl + '/rest/v1/' + tableName + '?select=*&limit=1');
    } else {
      parsedUrl = urlModule.parse(supabaseUrl + '/rest/v1/' + tableName + '?select=*&limit=1');
    }
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: (parsedUrl.pathname || '') + (parsedUrl.search || ''),
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          table: tableName,
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        table: tableName,
        error: err.message
      });
    });

    req.end();
  });
}

function runAll() {
  var p = Promise.resolve();
  var results = [];
  tables.forEach(function(t) {
    p = p.then(function() {
      return checkTable(t).then(function(res) {
        results.push(res);
      });
    });
  });

  p.then(function() {
    console.log('\n=== SUPABASE TABLE CHECK RESULTS ===');
    results.forEach(function(r) {
      if (r.error) {
        console.log('❌ ' + r.table + ': Network Error (' + r.error + ')');
      } else if (r.statusCode === 200) {
        console.log('✅ ' + r.table + ': Created & Accessible (HTTP 200 OK)');
      } else {
        console.log('⚠️ ' + r.table + ': HTTP ' + r.statusCode + ' - ' + r.data);
      }
    });
    console.log('====================================\n');
  });
}

runAll();
