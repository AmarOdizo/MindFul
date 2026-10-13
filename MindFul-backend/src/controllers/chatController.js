const { GoogleGenerativeAI } = require('@google/generative-ai');
const { supabase } = require('../config/supabase');

// Maya's empathetic offline fallback rule engine
const getEmpatheticFallback = (userText) => {
  const lower = (userText || '').toLowerCase();

  // Crisis detection
  if (lower.includes('suicide') || lower.includes('kill myself') || lower.includes('end it all') || lower.includes('self-harm') || lower.includes('hurt myself')) {
    return {
      text: "Please know that your life is deeply valuable, and you do not have to carry this immense pain alone. Immediate, compassionate support is available right now. Please reach out to the 988 Suicide & Crisis Lifeline (call or text 988) or text HOME to 741741 to speak with someone who cares.",
      hasAction: true,
      actionTitle: "CRISIS SUPPORT",
      actionSub: "Call or text 988 (Available 24/7, free and confidential)."
    };
  }

  if (lower.includes('sigh') || lower.includes('breath') || lower.includes('breathe')) {
    return {
      text: "Let's do this together right now. Take a deep double inhale through your nose — first deep, then a sharp top-off — and a long, gentle exhale out of your mouth. Notice how your chest softens.",
      hasAction: true,
      actionTitle: "GUIDED SIGH",
      actionSub: "Inhale deep (nose) + sip air + long slow exhale (mouth)."
    };
  }

  if (lower.includes('vent') || lower.includes('listen') || lower.includes('frustrated') || lower.includes('angry') || lower.includes('mad')) {
    return {
      text: "I'm listening with my whole presence. Please let it all out — whatever is feeling messy, unfair, or heavy right now. You don't have to filter your words or look for solutions here.",
      hasAction: true,
      actionTitle: "SAFE CONTAINER",
      actionSub: "Take your time. No fixing, just listening."
    };
  }

  if (lower.includes('stress') || lower.includes('anxi') || lower.includes('panic') || lower.includes('overwhelm') || lower.includes('deadline') || lower.includes('pressure') || lower.includes('tired') || lower.includes('exhaust')) {
    return {
      text: "It sounds like you've been carrying a tremendous weight today. Can you feel where you're holding that tension in your body? Let's take a pause together. Drop your shoulders, unclench your jaw, and remind yourself: you only have to handle this single moment.",
      hasAction: true,
      actionTitle: "BODY CHECK-IN",
      actionSub: "Drop shoulders, unclench jaw, and soften your brow."
    };
  }

  if (lower.includes('sad') || lower.includes('cry') || lower.includes('lonely') || lower.includes('hurt') || lower.includes('down') || lower.includes('hopeless')) {
    return {
      text: "I'm holding space for you, and it's okay to feel sad. You don't have to put on a brave face here. Allow yourself to feel this without judging yourself for it. You are safe, and you are not alone.",
      hasAction: false
    };
  }

  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('night') || lower.includes('awake') || lower.includes('bed')) {
    return {
      text: "Racing thoughts late in the day can feel so demanding. Let's give your mind permission to clock out for tonight. Nothing needs to be resolved before morning. Let's dim the lights and relax.",
      hasAction: true,
      actionTitle: "WIND DOWN",
      actionSub: "Inhale for 4s, hold for 7s, exhale slowly for 8s."
    };
  }

  if (lower.includes('thank') || lower.includes('better') || lower.includes('good') || lower.includes('great') || lower.includes('calm') || lower.includes('peace') || lower.includes('relief')) {
    return {
      text: "I'm so glad to share this moment of ease with you. Savoring small moments of calm rewires our nervous system to feel safe. Take a second to really soak in this feeling.",
      hasAction: false
    };
  }

  return {
    text: "I hear you, and thank you for trusting me with that. What feels like the kindest thing you could offer yourself in this exact moment?",
    hasAction: false
  };
};

exports.sendMessage = async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let replyText = null;
    let hasAction = false;
    let actionTitle = null;
    let actionSub = null;

    // Check crisis detection first
    const crisisCheck = getEmpatheticFallback(message);
    if (crisisCheck.actionTitle === "CRISIS SUPPORT") {
      replyText = crisisCheck.text;
      hasAction = true;
      actionTitle = crisisCheck.actionTitle;
      actionSub = crisisCheck.actionSub;
    } else if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are Maya, an empathetic, calm, and grounded AI wellness companion for the Mindful app.
Guidelines:
- Speak in warm, soothing, concise language (2 to 4 sentences).
- Never act like a clinical doctor or diagnose conditions.
- Validate the user's emotional experience first.
- If applicable, offer a gentle grounding exercise.
User message: "${message.trim()}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        replyText = response.text().trim();

        const fallback = getEmpatheticFallback(message);
        if (fallback.hasAction) {
          hasAction = true;
          actionTitle = fallback.actionTitle;
          actionSub = fallback.actionSub;
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to built-in empathetic engine:', geminiError.message);
      }
    }

    // Fallback if Gemini is not configured or failed
    if (!replyText) {
      const fallback = getEmpatheticFallback(message);
      replyText = fallback.text;
      hasAction = fallback.hasAction || false;
      actionTitle = fallback.actionTitle || null;
      actionSub = fallback.actionSub || null;
    }

    // Persist chat message in Supabase
    try {
      await supabase.from('chat_messages').insert([
        { user_id: userId, sender: 'user', text: message.trim() },
        { user_id: userId, sender: 'maya', text: replyText, action_title: actionTitle, action_sub: actionSub }
      ]);
    } catch (dbErr) {
      console.warn('Failed to save chat message in Supabase:', dbErr.message);
    }

    res.json({
      text: replyText,
      hasAction,
      actionTitle,
      actionSub
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    const fallback = getEmpatheticFallback(req.body ? req.body.message : '');
    res.json({
      text: fallback.text,
      hasAction: fallback.hasAction,
      actionTitle: fallback.actionTitle,
      actionSub: fallback.actionSub
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const limit = parseInt(req.query.limit) || 50;

    let query = supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: history, error } = await query;

    if (error) {
      console.error('Supabase error fetching chat history:', error);
      return res.status(500).json({ error: error.message || 'Failed to retrieve chat history' });
    }

    res.json({ data: history || [] });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};
