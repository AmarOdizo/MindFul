const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { JWT_SECRET } = require('../middleware/auth');

const REDIRECT_URL = process.env.SUPABASE_REDIRECT_URL || 'mindful://verify-email';

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing user in public.users table
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase query error during registration:', checkError);
      return res.status(500).json({ error: checkError.message || 'Database error' });
    }

    // Attempt registration with Supabase Auth (built-in email confirmation)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: REDIRECT_URL,
      },
    });

    if (authError) {
      console.warn('Supabase auth.signUp error:', authError);
      if (
        authError.message &&
        (authError.message.toLowerCase().includes('already registered') ||
          authError.message.toLowerCase().includes('already in use'))
      ) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
      return res.status(400).json({ error: authError.message || 'Registration failed' });
    }

    // Check if identities array is empty (Supabase hides existing accounts by returning empty identities)
    if (authData?.user?.identities && authData.user.identities.length === 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password for public.users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = authData?.user?.id;
    const userRecord = {
      ...(userId ? { id: userId } : {}),
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    };

    // Insert user record into public.users
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userRecord])
      .select('id, name, email, created_at')
      .single();

    if (insertError) {
      console.error('Supabase insert error into public.users:', insertError);
      return res.status(500).json({ error: insertError.message || 'Failed to create user record' });
    }

    // When Supabase email confirmation is enabled, authData.session is null
    const requiresVerification = !authData.session;

    if (requiresVerification) {
      return res.status(201).json({
        message: 'Account created! Please check your email to verify your address before logging in.',
        requiresVerification: true,
        email: cleanEmail,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    }

    // Fallback if email confirmation is turned off in Supabase
    const userPayload = { id: newUser.id, name: newUser.name, email: newUser.email };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Account created successfully',
      user: newUser,
      token,
      requiresVerification: false,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. First verify credentials and confirmation status with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (authError) {
      console.warn('Supabase auth login check:', authError.code, authError.message);

      // Block unverified email
      if (
        authError.code === 'email_not_confirmed' ||
        (authError.message && authError.message.toLowerCase().includes('email not confirmed'))
      ) {
        return res.status(403).json({
          error: 'Please verify your email address before signing in. Check your inbox for the confirmation link.',
          code: 'EMAIL_NOT_VERIFIED',
          email: cleanEmail,
        });
      }

      // Check if this is a legacy account existing in public.users prior to Supabase Auth
      const { data: legacyUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (legacyUser) {
        const isLegacyMatch = await bcrypt.compare(password, legacyUser.password);
        if (isLegacyMatch) {
          // Attempt to sync user into Supabase Auth to initiate email confirmation
          try {
            const { data: syncAuth } = await supabase.auth.signUp({
              email: cleanEmail,
              password: password,
              options: {
                data: { name: legacyUser.name },
                emailRedirectTo: REDIRECT_URL,
              },
            });

            if (syncAuth?.user && !syncAuth.session) {
              return res.status(403).json({
                error: 'A verification link has been sent to your email. Please verify your email before signing in.',
                code: 'EMAIL_NOT_VERIFIED',
                email: cleanEmail,
              });
            }
          } catch (syncErr) {
            console.warn('Legacy sync check notice:', syncErr.message);
          }
        }
      }

      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Double check email_confirmed_at in Supabase user record
    if (authData?.user && !authData.user.email_confirmed_at) {
      return res.status(403).json({
        error: 'Please verify your email address before signing in. Check your inbox for the confirmation link.',
        code: 'EMAIL_NOT_VERIFIED',
        email: cleanEmail,
      });
    }

    // 2. Fetch or sync user profile in public.users table
    let { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!user) {
      // Sync from confirmed Supabase Auth user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const { data: createdUser } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name: authData.user.user_metadata?.name || cleanEmail.split('@')[0],
            email: cleanEmail,
            password: hashedPassword,
          },
        ])
        .select('id, name, email, created_at')
        .single();

      user = createdUser;
    }

    // Login successful
    const userPayload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Logged in successfully',
      user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
      options: {
        emailRedirectTo: REDIRECT_URL,
      },
    });

    if (error) {
      console.warn('Supabase resend error:', error.code, error.message);

      if (
        error.code === 'over_email_send_rate_limit' ||
        (error.message && error.message.toLowerCase().includes('rate limit'))
      ) {
        return res.status(429).json({
          error: 'Rate limit reached. Please wait a minute before requesting another verification email, or check your spam folder.',
          code: 'RATE_LIMIT_EXCEEDED',
        });
      }

      return res.status(400).json({
        error: error.message || 'Failed to resend verification email',
        code: error.code || 'RESEND_FAILED',
      });
    }

    res.json({
      message: 'Verification email resent successfully! Please check your inbox.',
      email: cleanEmail,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error while resending verification email' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { access_token, token_hash, type, code } = req.body;

    let verifiedUser = null;

    if (access_token) {
      // Token passed from deep link hash fragment (#access_token=...)
      const { data, error } = await supabase.auth.getUser(access_token);
      if (error || !data?.user) {
        return res.status(400).json({
          error: error?.message || 'Invalid or expired session token',
          code: 'INVALID_TOKEN',
        });
      }
      verifiedUser = data.user;
    } else if (token_hash) {
      // Token hash passed from deep link query param (?token_hash=...)
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type || 'email',
      });
      if (error || !data?.user) {
        const isExpired = error?.code === 'otp_expired' || (error?.message && error.message.toLowerCase().includes('expired'));
        return res.status(400).json({
          error: isExpired
            ? 'This verification link has expired. Please request a new one.'
            : (error?.message || 'Verification link is invalid'),
          code: isExpired ? 'OTP_EXPIRED' : (error?.code || 'INVALID_TOKEN'),
        });
      }
      verifiedUser = data.user;
    } else if (code) {
      // Authorization code passed from PKCE flow (?code=...)
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error || !data?.user) {
        return res.status(400).json({
          error: error?.message || 'Authorization code is invalid or has expired',
          code: 'INVALID_CODE',
        });
      }
      verifiedUser = data.user;
    } else {
      return res.status(400).json({ error: 'Verification token, code, or hash is required' });
    }

    // Lookup corresponding application user in public.users
    const { data: userRecord } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('email', verifiedUser.email.toLowerCase())
      .maybeSingle();

    const appUser = userRecord || {
      id: verifiedUser.id,
      name: verifiedUser.user_metadata?.name || verifiedUser.email.split('@')[0],
      email: verifiedUser.email,
      created_at: verifiedUser.created_at,
    };

    const token = jwt.sign(
      { id: appUser.id, name: appUser.name, email: appUser.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Email verified successfully! Welcome to your sanctuary.',
      verified: true,
      user: appUser,
      token,
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Internal server error during email verification' });
  }
};

exports.getVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      email: cleanEmail,
      exists: true,
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({ error: 'Failed to retrieve verification status' });
  }
};

exports.handleWebCallback = (req, res) => {
  // Graceful browser landing page for desktop verification or redirect testing
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MindFul • Email Verification</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #FAF9F6;
      color: #1C2541;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    .card {
      background: #FFFFFF;
      max-width: 440px;
      width: 100%;
      border-radius: 24px;
      padding: 36px 28px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      border: 1px solid rgba(122, 154, 139, 0.2);
      text-align: center;
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 32px;
      background: #ECFDF5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px auto;
      font-size: 30px;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 8px 0;
      color: #065F46;
    }
    p {
      color: #5C677D;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 24px 0;
    }
    .btn {
      display: inline-block;
      width: 100%;
      background: #059669;
      color: #FFFFFF;
      text-decoration: none;
      padding: 14px 20px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      box-sizing: border-box;
      transition: background 0.2s ease;
    }
    .btn:hover {
      background: #047857;
    }
    .subtext {
      margin-top: 16px;
      font-size: 12px;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🌿</div>
    <h1>Email Verified!</h1>
    <p>Your MindFul sanctuary email has been successfully confirmed. You can now return to the app on your mobile device to sign in.</p>
    <a id="open-app-btn" href="mindful://verify-email" class="btn">Open MindFul App</a>
    <p class="subtext">If the app does not open automatically, tap the button above.</p>
  </div>
  <script>
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const appUrl = 'mindful://verify-email' + (hash || search);
    document.getElementById('open-app-btn').href = appUrl;
    // Attempt automatic forward on mobile devices
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setTimeout(() => {
        window.location.href = appUrl;
      }, 500);
    }
  </script>
</body>
</html>`;
  res.send(html);
};

exports.getProfile = async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', req.user.id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch summary stats
    const { count: moodCount } = await supabase
      .from('mood_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    const { count: journalCount } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    res.json({
      user,
      stats: {
        totalCheckins: moodCount || 0,
        totalJournals: journalCount || 0
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq('id', req.user.id)
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
