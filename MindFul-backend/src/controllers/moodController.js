const { supabase } = require('../config/supabase');

exports.logMood = async (req, res) => {
  try {
    const { mood_id, mood_label, intensity, tags, reflection } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!mood_id || !mood_label) {
      return res.status(400).json({ error: 'mood_id and mood_label are required' });
    }

    const validTags = Array.isArray(tags) ? tags : [];
    const validIntensity = intensity !== undefined ? Number(intensity) : 5;

    const payload = {
      user_id: userId,
      mood_id,
      mood_label,
      intensity: validIntensity,
      tags: validTags,
      reflection: reflection || ''
    };

    const { data: createdLog, error } = await supabase
      .from('mood_logs')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase error saving mood log:', error);
      return res.status(500).json({ error: error.message || 'Failed to record mood check-in' });
    }

    res.status(201).json({
      message: 'Mood check-in recorded successfully',
      data: createdLog
    });
  } catch (error) {
    console.error('Log mood error:', error);
    res.status(500).json({ error: 'Failed to record mood check-in' });
  }
};

exports.getMoodHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = parseInt(req.query.limit) || 30;

    let query = supabase
      .from('mood_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: rows, error } = await query;

    if (error) {
      console.error('Supabase error fetching mood history:', error);
      return res.status(500).json({ error: error.message || 'Failed to retrieve mood history' });
    }

    res.json({ data: rows || [] });
  } catch (error) {
    console.error('Get mood history error:', error);
    res.status(500).json({ error: 'Failed to retrieve mood history' });
  }
};

exports.getMoodStats = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    let query = supabase
      .from('mood_logs')
      .select('mood_id, intensity, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('Supabase error calculating mood stats:', error);
      return res.status(500).json({ error: error.message || 'Failed to calculate mood stats' });
    }

    if (!logs || logs.length === 0) {
      return res.json({
        totalLogs: 0,
        averageIntensity: 0,
        distribution: {}
      });
    }

    const totalLogs = logs.length;
    const totalIntensity = logs.reduce((sum, item) => sum + (item.intensity || 5), 0);
    const averageIntensity = (totalIntensity / totalLogs).toFixed(1);

    const distribution = {};
    logs.forEach(log => {
      distribution[log.mood_id] = (distribution[log.mood_id] || 0) + 1;
    });

    res.json({
      totalLogs,
      averageIntensity: Number(averageIntensity),
      distribution
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Failed to calculate mood stats' });
  }
};
