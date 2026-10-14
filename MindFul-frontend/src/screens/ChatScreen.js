import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';
import { chatApi } from '../services/api';

// -------------------------------------------------------------
// Empathetic companion response engine (Offline/Fallback)
// -------------------------------------------------------------
const generateMayaResponse = (userText) => {
  const lower = (userText || '').toLowerCase();

  // Crisis safety check
  if (lower.includes('suicide') || lower.includes('kill myself') || lower.includes('end it all') || lower.includes('self-harm') || lower.includes('hurt myself')) {
    return {
      text: "Please know that your life has immense worth and you do not have to carry this heavy darkness alone. Gentle, compassionate human support is available 24/7. Please tap Crisis Support below or dial 988 right now.",
      hasAction: true,
      actionTitle: "CRISIS SUPPORT (24/7)",
      actionSub: "Call or text 988. Free, confidential, and compassionate.",
      actionType: "crisis"
    };
  }

  if (lower.includes('sigh') || lower.includes('breath') || lower.includes('breathe') || lower.includes('calm')) {
    return {
      text: "Let's pause together right now. Take a double inhale through your nose — first deep, then a quick top-off — and a long, unhurried exhale out through your mouth. Notice the weight lifting from your collarbones.",
      hasAction: true,
      actionTitle: "GUIDED PHYSIOLOGICAL SIGH",
      actionSub: "Double inhale (nose) + long slow sigh (mouth).",
      actionType: "breathe"
    };
  }

  if (lower.includes('vent') || lower.includes('listen') || lower.includes('frustrated') || lower.includes('angry') || lower.includes('mad')) {
    return {
      text: "I am listening with my complete presence. You don't have to be polite, organized, or look for solutions here. Tell me what feels most unfair or overwhelming.",
      hasAction: true,
      actionTitle: "UNFILTERED CONTAINER",
      actionSub: "Take your time. No advice, just heartfelt listening.",
      actionType: "reflect"
    };
  }

  if (lower.includes('stress') || lower.includes('anxi') || lower.includes('panic') || lower.includes('overwhelm') || lower.includes('pressure') || lower.includes('work') || lower.includes('deadline')) {
    return {
      text: "It sounds like you've been carrying a tremendous weight today. Let's take a micro-pause together: drop your shoulders away from your ears, release your clenched jaw, and soften your eyes. You only have to handle this single breath.",
      hasAction: true,
      actionTitle: "BODY TENSION RELEASE",
      actionSub: "Unclench jaw, drop shoulders, soften belly.",
      actionType: "body"
    };
  }

  if (lower.includes('sad') || lower.includes('cry') || lower.includes('lonely') || lower.includes('hurt') || lower.includes('down') || lower.includes('heartbroken')) {
    return {
      text: "I am holding space for you. It is completely safe to feel tender and sad right now. You don't have to carry a brave face here. You are seen, worthy, and not alone in this moment.",
      hasAction: false
    };
  }

  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('night') || lower.includes('awake') || lower.includes('bed') || lower.includes('tired')) {
    return {
      text: "Late-night thoughts can feel so heavy and urgent. Give your mind permission to step off the clock. Nothing needs solving before sunrise. Let's let the world spin without you for a few hours.",
      hasAction: true,
      actionTitle: "EVENING WIND DOWN",
      actionSub: "Dim lights, 4-7-8 relaxing breathing rhythm.",
      actionType: "breathe"
    };
  }

  if (lower.includes('thank') || lower.includes('better') || lower.includes('peace') || lower.includes('good') || lower.includes('grateful')) {
    return {
      text: "I'm so honored to share this gentle moment of ease with you. Savoring small moments of peace actually rewires our nervous system for safety. Soak this feeling in deeply.",
      hasAction: false
    };
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      text: "Hello dear one. I am right here with you. How does your chest and spirit feel right now? There is no wrong answer.",
      hasAction: false
    };
  }

  const defaultReplies = [
    {
      text: "Thank you for sharing that with me. It takes real self-awareness to notice what you are experiencing. What is the kindest thing you could offer yourself right now?",
      hasAction: false
    },
    {
      text: "I hear you deeply. Let's take one mindful breath together right now before rushing into whatever is next.",
      hasAction: true,
      actionTitle: "MINDFUL PAUSE",
      actionSub: "One slow breath in... and one slow breath out.",
      actionType: "breathe"
    },
    {
      text: "I'm right here beside you. What feels like the heaviest part of this situation for you? We can untangle it together, one gentle thread at a time.",
      hasAction: false
    }
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
};

// Quick prompt starters
const QUICK_PROMPTS = [
  { id: '1', emoji: '🌬️', label: 'Need a 2-min calming sigh', text: "Let's do a quick physiological sigh breathwork together." },
  { id: '2', emoji: '🌧️', label: 'Feeling overwhelmed', text: "I'm feeling very overwhelmed with everything on my plate today." },
  { id: '3', emoji: '🛋️', label: 'I just need to vent', text: "I really just need to vent for a moment without fixing anything yet." },
  { id: '4', emoji: '💤', label: 'Can’t sleep, racing mind', text: "My mind won't stop racing tonight. Help me relax and sleep." },
  { id: '5', emoji: '🌿', label: 'Quick grounding exercise', text: "Could you guide me through a 5-4-3-2-1 grounding exercise?" },
  { id: '6', emoji: '💭', label: 'Reframe negative thinking', text: "I'm caught in a spiral of negative thoughts. How can I reframe this?" },
];

export default function ChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'maya',
      text: "Hello. I’m Maya, your companion for moments of stress, reflection, and quiet presence. Whatever you're navigating today, this is a judgment-free space.",
      time: 'Just now',
      hasAction: true,
      actionTitle: "WELCOME CHECK-IN",
      actionSub: "Take a gentle breath and share what’s alive in you.",
      actionType: "breathe"
    }
  ]);

  // Audio / Mic recording simulation state
  const [isListening, setIsListening] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showBreathModal, setShowBreathModal] = useState(false);

  // Breathing animation states for In-Chat modal
  const breathAnim = useRef(new Animated.Value(1)).current;
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [breathCount, setBreathCount] = useState(4);

  // Load chat history from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      try {
        const res = await chatApi.getChatHistory(25);
        if (isMounted && res && res.data && res.data.length > 0) {
          const formatted = res.data.map(m => ({
            id: m.id || Math.random().toString(),
            sender: m.sender,
            text: m.text,
            time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : formatTime(),
            hasAction: !!m.action_title,
            actionTitle: m.action_title,
            actionSub: m.action_sub,
            actionType: (m.action_title || '').toLowerCase().includes('crisis') ? 'crisis' : 'breathe'
          }));
          setMessages(formatted);
        }
      } catch (err) {
        // Retain welcome message
      }
    }
    loadHistory();
    return () => { isMounted = false; };
  }, []);

  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleSend = async (overrideText) => {
    const textToSend = (overrideText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: formatTime()
    };
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const historyContext = currentMessages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const response = await chatApi.sendMessage(textToSend, historyContext);
      const botReply = response?.reply || response?.text;

      if (response && botReply) {
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'maya',
            text: botReply,
            time: formatTime(),
            hasAction: response.hasAction !== undefined ? response.hasAction : !!response.actionTitle,
            actionTitle: response.actionTitle,
            actionSub: response.actionSub,
            actionType: (response.actionTitle || '').toLowerCase().includes('crisis') ? 'crisis' : 'breathe'
          }
        ]);
      } else {
        throw new Error('No reply received');
      }
    } catch (err) {
      // Seamless empathetic local fallback
      const mayaReply = generateMayaResponse(textToSend);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'maya',
          text: mayaReply.text,
          time: formatTime(),
          hasAction: mayaReply.hasAction,
          actionTitle: mayaReply.actionTitle,
          actionSub: mayaReply.actionSub,
          actionType: mayaReply.actionType || 'breathe'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mic toggle with realistic speech-to-text simulation
  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate listening for 2.5 seconds then transcribe an authentic prompt
      setTimeout(() => {
        setIsListening(false);
        const voicePrompts = [
          "I'm feeling a bit anxious about my workload right now.",
          "I had a stressful morning and need to center myself.",
          "Can we do a short grounding exercise together?",
          "I'm feeling really grateful today and wanted to reflect on it."
        ];
        const randomVoice = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
        setInputText(randomVoice);
      }, 2400);
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      "Start Fresh?",
      "Clear current messages and begin a fresh, peaceful conversation with Maya?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start Fresh",
          style: "destructive",
          onPress: () => {
            setMessages([
              {
                id: 'fresh-' + Date.now(),
                sender: 'maya',
                text: "The slate is clear. Take a deep, gentle breath. What would you like to explore today?",
                time: formatTime(),
                hasAction: false
              }
            ]);
            setShowOptionsModal(false);
          }
        }
      ]
    );
  };

  const handleCopyText = (text) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {}
    Alert.alert("Insight Saved", "Take a moment to absorb this mindful reflection.");
  };

  // Handle action button inside Maya's bubble
  const handleActionPress = (actionType) => {
    if (actionType === 'crisis') {
      navigation.navigate('CrisisSupport');
    } else if (actionType === 'breathe') {
      startBreathingSession();
    } else {
      navigation.navigate('Meditation');
    }
  };

  // In-chat guided breathing animation
  const startBreathingSession = () => {
    setShowBreathModal(true);
    setBreathPhase('Inhale');
    setBreathCount(4);

    Animated.sequence([
      Animated.timing(breathAnim, { toValue: 1.6, duration: 4000, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(breathAnim, { toValue: 1.0, duration: 6000, useNativeDriver: true }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ========================================================= */}
      {/* 1. ELEVATED MODERN HEADER                                 */}
      {/* ========================================================= */}
      <View style={styles.header}>
        <View style={styles.headerCompanionRow}>
          {/* Avatar with Live Emerald Glow */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop' }}
              style={styles.avatarImage}
            />
            <View style={styles.statusGlowRing} />
            <View style={styles.activeDot} />
          </View>

          {/* Name & Empathetic Status */}
          <View style={styles.companionMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.companionName}>Maya</Text>
              <View style={styles.badgeSpark}>
                <Ionicons name="sparkles" size={10} color={colors.primary} />
                <Text style={styles.badgeSparkText}>AI Companion</Text>
              </View>
            </View>
            <Text style={styles.companionStatus}>
              <Text style={{ color: '#10B981' }}>●</Text> Attentive · Safe & Private
            </Text>
          </View>

          {/* Header Action Buttons */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.crisisBtn}
              onPress={() => navigation.navigate('CrisisSupport')}
              activeOpacity={0.7}
            >
              <Ionicons name="shield-outline" size={13} color="#E11D48" />
              <Text style={styles.crisisBtnText}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionsBtn}
              onPress={() => setShowOptionsModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMain} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ========================================================= */}
      {/* 2. CHAT SCROLL AREA                                       */}
      {/* ========================================================= */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Calming Disclaimer Chip */}
          <View style={styles.safetyBanner}>
            <Ionicons name="leaf-outline" size={14} color={colors.primary} />
            <Text style={styles.safetyText}>
              Maya offers empathetic emotional support and mindful exercises, not clinical diagnoses.
            </Text>
          </View>

          {/* Messages List */}
          {messages.map((msg, index) => {
            const isMaya = msg.sender === 'maya';
            return (
              <View
                key={msg.id || index}
                style={[
                  styles.messageRow,
                  isMaya ? styles.messageRowLeft : styles.messageRowRight
                ]}
              >
                {/* Maya Small Avatar */}
                {isMaya && (
                  <View style={styles.msgAvatarWrapper}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }}
                      style={styles.msgAvatar}
                    />
                  </View>
                )}

                <View style={[styles.bubbleWrapper, isMaya ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]}>
                  {/* Bubble Content */}
                  <View style={[styles.bubble, isMaya ? styles.bubbleMaya : styles.bubbleUser]}>
                    <Text style={[styles.bubbleText, isMaya ? styles.bubbleTextMaya : styles.bubbleTextUser]}>
                      {msg.text}
                    </Text>

                    {/* Interactive Action Card Inside Maya Message */}
                    {isMaya && msg.hasAction && (
                      <View style={styles.actionCard}>
                        <View style={styles.actionHeader}>
                          <View style={[styles.actionIconBox, msg.actionType === 'crisis' && { backgroundColor: '#FEE2E2' }]}>
                            <Ionicons
                              name={
                                msg.actionType === 'crisis' ? 'medical' :
                                msg.actionType === 'body' ? 'fitness-outline' :
                                msg.actionType === 'reflect' ? 'heart' : 'color-filter-outline'
                              }
                              size={16}
                              color={msg.actionType === 'crisis' ? '#EF4444' : colors.primary}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.actionTag, msg.actionType === 'crisis' && { color: '#DC2626' }]}>
                              {msg.actionTitle || "MINDFUL EXERCISE"}
                            </Text>
                            <Text style={styles.actionDesc}>{msg.actionSub}</Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={[styles.actionCtaBtn, msg.actionType === 'crisis' && { backgroundColor: '#EF4444' }]}
                          onPress={() => handleActionPress(msg.actionType)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.actionCtaText}>
                            {msg.actionType === 'crisis' ? 'Access Crisis Resources' : 'Try Guided Breathwork'}
                          </Text>
                          <Ionicons
                            name="arrow-forward"
                            size={14}
                            color="#FFFFFF"
                            style={{ marginLeft: 6 }}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* Message Meta / Timestamp */}
                  <View style={styles.msgMetaRow}>
                    {isMaya ? (
                      <>
                        <Text style={styles.metaTime}>{msg.time}</Text>
                        <TouchableOpacity onPress={() => handleCopyText(msg.text)} style={styles.copyBtn}>
                          <Ionicons name="copy-outline" size={11} color={colors.textMuted} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text style={styles.metaTime}>{msg.time}</Text>
                        <Ionicons name="checkmark-done" size={13} color={colors.primary} style={{ marginLeft: 4 }} />
                      </>
                    )}
                  </View>
                </View>
              </View>
            );
          })}

          {/* Typing / Reflecting Indicator */}
          {isLoading && (
            <View style={[styles.messageRow, styles.messageRowLeft]}>
              <View style={styles.msgAvatarWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }}
                  style={styles.msgAvatar}
                />
              </View>
              <View style={styles.typingBubble}>
                <View style={styles.typingWaveRow}>
                  <View style={[styles.typingDot, { backgroundColor: colors.primary }]} />
                  <View style={[styles.typingDot, { backgroundColor: colors.secondary }]} />
                  <View style={[styles.typingDot, { backgroundColor: colors.tertiary }]} />
                </View>
                <Text style={styles.typingText}>Maya is reflecting with care...</Text>
              </View>
            </View>
          )}

          {/* Listening Audio Banner when mic is active */}
          {isListening && (
            <View style={styles.listeningCard}>
              <ActivityIndicator size="small" color="#EF4444" />
              <Text style={styles.listeningText}>Listening... speak softly from the heart</Text>
              <TouchableOpacity onPress={() => setIsListening(false)} style={styles.stopListeningBtn}>
                <Ionicons name="close-circle" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ========================================================= */}
        {/* 3. QUICK CONVERSATION STARTERS (HORIZONTAL CAROUSEL)      */}
        {/* ========================================================= */}
        <View style={styles.suggestionsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {QUICK_PROMPTS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestionChip}
                onPress={() => handleSend(item.text)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
                <Text style={styles.suggestionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ========================================================= */}
        {/* 4. PREMIUM INPUT DOCK                                     */}
        {/* ========================================================= */}
        <View style={styles.inputDock}>
          <View style={styles.inputContainer}>
            {/* Quick Action Breathing Shortcut */}
            <TouchableOpacity
              style={styles.shortcutBtn}
              onPress={startBreathingSession}
              activeOpacity={0.7}
            >
              <Ionicons name="color-filter-outline" size={20} color={colors.primary} />
            </TouchableOpacity>

            {/* Input Field */}
            <TextInput
              style={styles.textInput}
              placeholder="Share what is on your mind..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
              editable={!isLoading}
            />

            {/* Mic Button */}
            <TouchableOpacity
              style={[styles.micBtn, isListening && styles.micBtnActive]}
              onPress={handleMicToggle}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isListening ? "mic" : "mic-outline"}
                size={20}
                color={isListening ? "#FFFFFF" : colors.textMuted}
              />
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity
              style={[
                styles.sendBtn,
                inputText.trim().length > 0 ? styles.sendBtnActive : styles.sendBtnDisabled,
                isLoading && { opacity: 0.5 }
              ]}
              onPress={() => handleSend()}
              disabled={isLoading || inputText.trim().length === 0}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-up"
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {/* Privacy Footnote */}
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={11} color={colors.textMuted} />
            <Text style={styles.privacyText}>
              Encrypted & confidential · Maya is an AI, not a doctor
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ========================================================= */}
      {/* 5. IN-CHAT GUIDED SIGH BREATHWORK MODAL                   */}
      {/* ========================================================= */}
      <Modal
        visible={showBreathModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBreathModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.breathCard}>
            <View style={styles.breathHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="leaf" size={18} color={colors.primary} />
                <Text style={styles.breathTitle}> 2-Minute Grounding</Text>
              </View>
              <TouchableOpacity onPress={() => setShowBreathModal(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.breathSubtitle}>
              Two deep nasal inhales, one slow soothing mouth sigh.
            </Text>

            {/* Pulsing Breathing Circle */}
            <View style={styles.breathCircleArea}>
              <Animated.View
                style={[
                  styles.breathCircleOuter,
                  { transform: [{ scale: breathAnim }] }
                ]}
              >
                <View style={styles.breathCircleInner}>
                  <Text style={styles.breathPhaseText}>{breathPhase}</Text>
                  <Text style={styles.breathInstruction}>
                    {breathPhase === 'Inhale' ? 'Fill lungs fully + top off' : 'Long slow sigh out'}
                  </Text>
                </View>
              </Animated.View>
            </View>

            <View style={styles.breathActions}>
              <TouchableOpacity
                style={styles.breathDoneBtn}
                onPress={() => {
                  setShowBreathModal(false);
                  handleSend("Thank you Maya, that breathing exercise helped ground me.");
                }}
              >
                <Text style={styles.breathDoneText}>I Feel Centered</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.breathFullBtn}
                onPress={() => {
                  setShowBreathModal(false);
                  navigation.navigate('Meditation');
                }}
              >
                <Text style={styles.breathFullText}>Open Full Breathwork Studio</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* 6. OPTIONS & SESSION SETTINGS MODAL                       */}
      {/* ========================================================= */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={styles.optionsSheet}>
            <View style={styles.optionsHandle} />
            <Text style={styles.optionsHeader}>Conversation Options</Text>

            <TouchableOpacity style={styles.optionItem} onPress={handleClearChat}>
              <View style={[styles.optionIconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="refresh" size={18} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionLabel, { color: '#EF4444' }]}>Start Fresh Chat</Text>
                <Text style={styles.optionSub}>Reset conversation history and begin a new session</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsModal(false);
                navigation.navigate('Meditation');
              }}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="fitness" size={18} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionLabel}>Breathwork Studio</Text>
                <Text style={styles.optionSub}>Practice vagus nerve & box breathing exercises</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsModal(false);
                navigation.navigate('CrisisSupport');
              }}
            >
              <View style={[styles.optionIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="medical" size={18} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionLabel}>Immediate Crisis Resources</Text>
                <Text style={styles.optionSub}>Hotlines, SMS helplines, and human support 24/7</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCloseBtn}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.optionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// =============================================================
// MODERN MINDFUL STYLESHEET
// =============================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surfaceBase,
  },

  /* --- 1. HEADER --- */
  header: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 154, 139, 0.12)',
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  headerCompanionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  statusGlowRing: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  companionMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companionName: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 20,
    color: colors.textMain,
    letterSpacing: 0.2,
  },
  badgeSpark: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(122, 154, 139, 0.14)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
    gap: 3,
  },
  badgeSparkText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 10.5,
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  companionStatus: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  crisisBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 4,
  },
  crisisBtnText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11.5,
    color: '#E11D48',
  },
  optionsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  /* --- 2. CHAT SCROLL AREA --- */
  scrollContent: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(122, 154, 139, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: spacing.md,
    gap: 8,
  },
  safetyText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11.5,
    color: colors.textMuted,
    lineHeight: 16,
  },

  /* --- MESSAGE BUBBLES --- */
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    maxWidth: '92%',
  },
  messageRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageRowRight: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  msgAvatarWrapper: {
    marginRight: 8,
    marginTop: 2,
  },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  bubbleWrapper: {
    flexShrink: 1,
  },
  bubble: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
  },
  bubbleMaya: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.16)',
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextMaya: {
    color: colors.textMain,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  msgMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  metaTime: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
  },
  copyBtn: {
    marginLeft: 8,
    padding: 2,
  },

  /* --- ACTION CARD INSIDE MAYA MESSAGE --- */
  actionCard: {
    backgroundColor: '#F8FAF9',
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.22)',
    borderRadius: radius.md,
    padding: 12,
    marginTop: 10,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(122, 154, 139, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTag: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 11,
    color: colors.primaryDark,
    letterSpacing: 0.6,
  },
  actionDesc: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12.5,
    color: colors.textMain,
    marginTop: 2,
    lineHeight: 17,
  },
  actionCtaBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  actionCtaText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },

  /* --- TYPING & AUDIO STATES --- */
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.16)',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  typingWaveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typingText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  listeningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
    gap: 8,
  },
  listeningText: {
    flex: 1,
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#DC2626',
  },
  stopListeningBtn: {
    padding: 2,
  },

  /* --- 3. QUICK SUGGESTIONS CAROUSEL --- */
  suggestionsContainer: {
    paddingVertical: 6,
    backgroundColor: colors.surfaceBase,
  },
  suggestionsScroll: {
    paddingHorizontal: spacing.gutter,
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    gap: 6,
  },
  suggestionEmoji: {
    fontSize: 14,
  },
  suggestionLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: colors.textMain,
  },

  /* --- 4. INPUT DOCK --- */
  inputDock: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(122, 154, 139, 0.12)',
    paddingHorizontal: spacing.gutter,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 18 : 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.20)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  shortcutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 38,
    maxHeight: 110,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 14.5,
    color: colors.textMain,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBtnActive: {
    backgroundColor: '#EF4444',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendBtnActive: {
    backgroundColor: colors.primary,
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  privacyText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
  },

  /* --- 5. IN-CHAT BREATHING MODAL --- */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 37, 65, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.gutter,
  },
  breathCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  breathHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breathTitle: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 19,
    color: colors.textMain,
  },
  breathSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  breathCircleArea: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  breathCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(122, 154, 139, 0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  breathPhaseText: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 16,
    color: '#FFFFFF',
  },
  breathInstruction: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 9.5,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 2,
  },
  breathActions: {
    width: '100%',
    marginTop: 24,
    gap: 10,
  },
  breathDoneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  breathDoneText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  breathFullBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  breathFullText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: colors.primaryDark,
    textDecorationLine: 'underline',
  },

  /* --- 6. OPTIONS SHEET --- */
  optionsSheet: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: 'auto',
    marginBottom: 20,
  },
  optionsHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  optionsHeader: {
    fontFamily: typography.fontFamily.serifMedium,
    fontSize: 18,
    color: colors.textMain,
    marginBottom: 14,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 14,
    color: colors.textMain,
  },
  optionSub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  optionCloseBtn: {
    marginTop: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionCloseText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 14,
    color: colors.textMuted,
  },
});
