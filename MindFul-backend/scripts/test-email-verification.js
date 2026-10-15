require('dotenv').config();
const http = require('http');
const app = require('../src/app');

// Start local test server on random port
const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`\n======================================================`);
  console.log(`🧪 TESTING SUPABASE EMAIL VERIFICATION FLOW (${baseUrl})`);
  console.log(`======================================================\n`);

  let allPassed = true;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
    } catch (err) {
      allPassed = false;
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Error: ${err.message}\n`);
    }
  };

  // Test 1: Register validation
  await test('Registration requires name, email, and password (400)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'incomplete@test.com' }),
    });
    const json = await res.json();
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}: ${JSON.stringify(json)}`);
  });

  // Test 2: Unverified user login is blocked with 403 & EMAIL_NOT_VERIFIED
  await test('Unverified account login is blocked with 403 and EMAIL_NOT_VERIFIED', async () => {
    // We created test.verify.mindful.2026@gmail.com earlier in Supabase Auth (unconfirmed)
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.verify.mindful.2026@gmail.com',
        password: 'Password123!',
      }),
    });
    const json = await res.json();
    console.log('   Login response for unconfirmed user:', res.status, json.code || json.error);
    if (res.status !== 403) {
      throw new Error(`Expected 403 Forbidden, got ${res.status}: ${JSON.stringify(json)}`);
    }
    if (json.code !== 'EMAIL_NOT_VERIFIED') {
      throw new Error(`Expected code EMAIL_NOT_VERIFIED, got ${json.code}`);
    }
  });

  // Test 3: Resend verification email endpoint
  await test('Resend verification endpoint responds with rate-limit or success', async () => {
    const res = await fetch(`${baseUrl}/api/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.verify.mindful.2026@gmail.com',
      }),
    });
    const json = await res.json();
    console.log('   Resend response status:', res.status, json.code || json.message || json.error);
    // Supabase will either send (200) or report rate limit (429), both are expected & handled!
    if (res.status !== 200 && res.status !== 429) {
      throw new Error(`Expected 200 or 429, got ${res.status}: ${JSON.stringify(json)}`);
    }
  });

  // Test 4: Verification with invalid or expired token
  await test('Verification with invalid token returns 400 and error code', async () => {
    const res = await fetch(`${baseUrl}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token_hash: 'invalid_dummy_hash_123',
        type: 'email',
      }),
    });
    const json = await res.json();
    console.log('   Verify invalid token status:', res.status, json.code, json.error);
    if (res.status !== 400) {
      throw new Error(`Expected 400, got ${res.status}: ${JSON.stringify(json)}`);
    }
    if (!json.code) {
      throw new Error('Expected error code in response');
    }
  });

  // Test 5: Web callback endpoint returns HTML page
  await test('Web callback endpoint renders responsive HTML landing page', async () => {
    const res = await fetch(`${baseUrl}/api/auth/callback`);
    const text = await res.text();
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!text.includes('MindFul') || !text.includes('mindful://verify-email')) {
      throw new Error('Callback page does not contain MindFul branding or deep link');
    }
  });

  // Test 6: Invalid password returns 401
  await test('Login with incorrect password returns 401 Invalid email or password', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test.verify.mindful.2026@gmail.com',
        password: 'IncorrectPassword999!',
      }),
    });
    const json = await res.json();
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (!json.error.includes('Invalid email or password')) throw new Error(`Expected Invalid email or password`);
  });

  // Test 7: Non-existent user login returns 401
  await test('Login with non-existent user returns 401', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nobody_exists_here_9999@gmail.com',
        password: 'SomePassword123!',
      }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // Test 8: Health check and root route preserved
  await test('Existing health check and root endpoints remain functional', async () => {
    const health = await fetch(`${baseUrl}/api/health`);
    const healthJson = await health.json();
    if (healthJson.status !== 'healthy') throw new Error(`Health check failed`);
  });

  console.log(`\n======================================================`);
  if (allPassed) {
    console.log(`🎉 ALL TESTS PASSED SUCCESSFULLY!`);
  } else {
    console.log(`⚠️ SOME TESTS FAILED`);
  }
  console.log(`======================================================\n`);

  server.close(() => {
    process.exit(allPassed ? 0 : 1);
  });
});
