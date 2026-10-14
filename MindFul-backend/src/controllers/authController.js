const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing user in Supabase
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase query error during registration:', checkError);
      return res.status(500).json({ error: checkError.message || 'Database error' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name: name.trim(),
          email: cleanEmail,
          password: hashedPassword
        }
      ])
      .select('id, name, email, created_at')
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      if (insertError.code === '42501' || (insertError.message && insertError.message.toLowerCase().includes('row-level security'))) {
        console.warn('💡 Tip: Supabase Row-Level Security blocked this operation. To fix:');
        console.warn('   1. In Supabase SQL Editor, run "ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;" (or run fix_rls.sql)');
        console.warn('   2. OR set SUPABASE_SERVICE_ROLE_KEY in MindFul-backend/.env\n');
      }
      return res.status(500).json({ error: insertError.message || 'Failed to create user account' });
    }

    const userPayload = { id: newUser.id, name: newUser.name, email: newUser.email };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Account created successfully',
      user: newUser,
      token
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

    // Query user from Supabase
    const { data: user, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (queryError) {
      console.error('Supabase login query error:', queryError);
      return res.status(500).json({ error: queryError.message || 'Database error during login' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userPayload = { id: user.id, name: user.name, email: user.email };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      message: 'Logged in successfully',
      user: { id: user.id, name: user.name, email: user.email, created_at: user.created_at },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
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
