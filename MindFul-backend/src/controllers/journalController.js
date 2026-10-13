const { supabase } = require('../config/supabase');

exports.createEntry = async (req, res) => {
  try {
    const { title, content, prompt_id, mood_tag, category } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Journal content is required' });
    }

    const payload = {
      user_id: userId,
      title: title || 'Daily Reflection',
      content: content.trim(),
      prompt_id: prompt_id || null,
      mood_tag: mood_tag || null,
      category: category || 'Reflective'
    };

    const { data: createdEntry, error } = await supabase
      .from('journal_entries')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase error saving journal entry:', error);
      return res.status(500).json({ error: error.message || 'Failed to save journal entry' });
    }

    res.status(201).json({
      message: 'Journal entry saved successfully',
      data: createdEntry
    });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { search, category } = req.query;

    let query = supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (category && category !== 'All Entries') {
      query = query.eq('category', category);
    }

    if (search && search.trim() !== '') {
      query = query.or(`content.ilike.%${search.trim()}%,title.ilike.%${search.trim()}%`);
    }

    const { data: entries, error } = await query;

    if (error) {
      console.error('Supabase error fetching journal entries:', error);
      return res.status(500).json({ error: error.message || 'Failed to retrieve journal entries' });
    }

    res.json({ data: entries || [] });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ error: 'Failed to retrieve journal entries' });
  }
};

exports.getEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json({ data: entry });
  } catch (error) {
    console.error('Get entry by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve entry' });
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, mood_tag } = req.body;

    const { data: existing, error: findError } = await supabase
      .from('journal_entries')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (req.user && existing.user_id && existing.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to edit this entry' });
    }

    const updatePayload = {
      updated_at: new Date().toISOString()
    };
    if (title !== undefined) updatePayload.title = title;
    if (content !== undefined) updatePayload.content = content;
    if (category !== undefined) updatePayload.category = category;
    if (mood_tag !== undefined) updatePayload.mood_tag = mood_tag;

    const { data: updatedEntry, error: updateError } = await supabase
      .from('journal_entries')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    res.json({
      message: 'Journal entry updated',
      data: updatedEntry
    });
  } catch (error) {
    console.error('Update journal entry error:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: existing, error: findError } = await supabase
      .from('journal_entries')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (req.user && existing.user_id && existing.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this entry' });
    }

    const { error: deleteError } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json({ error: deleteError.message });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
};
