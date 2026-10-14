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
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';
import { chatApi } from '../services/api';

// Intelligent & Empathetic Fallback Response Engine
const generateGeminiFallback = (userText) => {
  const lower = (userText || '').toLowerCase();

  if (
    lower.includes('suicide') ||
    lower.includes('kill myself') ||
    lower.includes('end it all') ||
    lower.includes('self-harm') ||
    lower.includes('hurt myself')
  ) {
    return "Please know that your life is deeply precious and you do not have to carry this darkness alone. Compassionate human support is available 24/7. Please dial or text 988 right now.";
  }

  if (lower.includes('who are you') || lower.includes('what are you')) {
    return "I am Gemini, your intelligent AI companion in the MindFul app. You can ask me anything — from science, coding, and general knowledge, to meditation, mental health, and daily advice!";
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm Gemini. How can I help you today? Feel free to ask me any question or share what is on your mind.";
  }

  return "I hear your question clearly. As Gemini, I'm here to explore this with you. Please feel free to elaborate or ask any specific aspect you'd like to dive into!";
};

// Versatile Quick Prompt Suggestions
const QUICK_PROMPTS = [
  { id: '1', emoji: '✨', label: 'What is mindfulness?', text: 'What is mindfulness and how can it help in daily life?' },
  { id: '2', emoji: '🌿', label: 'Overcome anxiety', text: 'Give me 3 scientifically proven ways to quickly calm an anxious mind.' },
  { id: '3', emoji: '💡', label: 'Tell me a calming fact', text: 'Tell me a fascinating, calming scientific fact about the human brain or universe.' },
  { id: '4', emoji: '📝', label: 'Organize my day', text: 'Help me prioritize and structure a peaceful, productive day.' },
];

export default function ChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const scrollViewRef = useRef();

  const [messages, setMessages] = useState([
    {
      id: 'welcome-gemini',
      sender: 'maya',
      text: "Hello! I am Gemini, your AI companion. You can ask me anything — general questions, life advice, explanations, or ways to relax. How can I help you today?",
      time: 'Just now',
    },
  ]);

  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Open Chat History Modal (like Gemini conversation drawer)
  const openHistoryModal = async () => {
    setShowHistoryModal(true);
    setIsLoadingHistory(true);
    try {
      const res = await chatApi.getChatHistory(100);
      if (res && res.data) {
        setHistoryList(res.data);
      }
    } catch (e) {
      console.warn('Could not load chat history:', e.message);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Start a fresh new chat session
  const handleNewChat = () => {
    setMessages([
      {
        id: 'fresh-' + Date.now(),
        sender: 'maya',
        text: "New conversation started. What would you like to ask or explore?",
        time: formatTime(),
      },
    ]);
  };

  // Load an entire past session or past conversation thread
  const handleLoadPastMessage = (item) => {
    setShowHistoryModal(false);
    // Find all messages around that item or load full history
    chatApi.getChatHistory(40).then((res) => {
      if (res && res.data && res.data.length > 0) {
        const formatted = res.data.map((m) => ({
          id: m.id || Math.random().toString(),
          sender: m.sender,
          text: m.text,
          time: m.created_at
            ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : formatTime(),
        }));
        setMessages(formatted);
      }
    }).catch(() => {});
  };

  // Clear all saved history from backend
  const handleClearAllHistory = () => {
    Alert.alert(
      "Clear All History?",
      "Are you sure you want to permanently delete all previous chat history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await chatApi.clearChatHistory();
              setHistoryList([]);
              setShowHistoryModal(false);
              handleNewChat();
            } catch (e) {
              console.warn('Failed to clear history:', e.message);
            }
          },
        },
      ]
    );
  };

  // Send message to live Gemini AI
  const handleSend = async (overrideText) => {
    const textToSend = (overrideText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: formatTime(),
    };
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const historyContext = currentMessages.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const response = await chatApi.sendMessage(textToSend, historyContext);
      const botReply = response?.reply || response?.text;

      if (response && botReply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'maya',
            text: botReply,
            time: formatTime(),
          },
        ]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (err) {
      const fallbackReply = generateGeminiFallback(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'maya',
          text: fallbackReply,
          time: formatTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter user prompts for clean history list
  const userHistoryQueries = historyList.filter((m) => m.sender === 'user');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. Clean Header with History & New Chat Buttons */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrapper}>
            <View style={styles.geminiLogoCircle}>
              <Ionicons name="sparkles" size={16} color="#059669" />
            </View>
            <View style={styles.activeDot} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Gemini AI</Text>
            <Text style={styles.headerSubtitle}>Ask anything · Fast & intelligent</Text>
          </View>
        </View>

        {/* Action Buttons: History Button + New Chat Button */}
        <View style={styles.headerActions}>
          {/* History Button (Beside New Chat) */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={openHistoryModal}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="time-outline" size={19} color={colors.textMain} />
          </TouchableOpacity>

          {/* New Chat Button */}
          <TouchableOpacity
            style={[styles.headerIconBtn, styles.newChatBtn]}
            onPress={handleNewChat}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="create-outline" size={18} color="#059669" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Messages List */}
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
          {messages.map((msg, index) => {
            const isMaya = msg.sender === 'maya';
            return (
              <View
                key={msg.id || index}
                style={[
                  styles.messageRow,
                  isMaya ? styles.messageRowLeft : styles.messageRowRight,
                ]}
              >
                {isMaya && (
                  <View style={styles.msgAvatarBox}>
                    <Ionicons name="sparkles" size={13} color="#059669" />
                  </View>
                )}

                <View style={[styles.bubbleWrapper, isMaya ? styles.bubbleWrapperLeft : styles.bubbleWrapperRight]}>
                  <View style={[styles.bubble, isMaya ? styles.bubbleMaya : styles.bubbleUser]}>
                    <Text style={[styles.bubbleText, isMaya ? styles.bubbleTextMaya : styles.bubbleTextUser]}>
                      {msg.text}
                    </Text>
                  </View>
                  <Text style={[styles.msgTime, isMaya ? styles.msgTimeLeft : styles.msgTimeRight]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Clean Typing Indicator */}
          {isLoading && (
            <View style={[styles.messageRow, styles.messageRowLeft]}>
              <View style={styles.msgAvatarBox}>
                <Ionicons name="sparkles" size={13} color="#059669" />
              </View>
              <View style={styles.typingBubble}>
                <View style={styles.typingDotRow}>
                  <View style={[styles.typingDot, { backgroundColor: '#10B981' }]} />
                  <View style={[styles.typingDot, { backgroundColor: '#34D399' }]} />
                  <View style={[styles.typingDot, { backgroundColor: '#A7F3D0' }]} />
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 10 }} />
        </ScrollView>

        {/* 3. Helpful Suggestion Chips */}
        {messages.length <= 2 && (
          <View style={styles.promptsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.promptsScroll}
            >
              {QUICK_PROMPTS.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.promptChip}
                  onPress={() => handleSend(p.text)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.promptEmoji}>{p.emoji}</Text>
                  <Text style={styles.promptLabel}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 4. Ergonomic Input Bar */}
        <View style={styles.inputArea}>
          <View style={styles.inputPill}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask Gemini anything..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1500}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[
                styles.sendBtn,
                inputText.trim().length > 0 ? styles.sendBtnActive : styles.sendBtnDisabled,
              ]}
              onPress={() => handleSend()}
              disabled={isLoading || inputText.trim().length === 0}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-up" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* 5. Gemini-Style Chat History Modal */}
      <Modal
        visible={showHistoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.historySheet}>
            {/* Modal Header */}
            <View style={styles.historyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <Ionicons name="time" size={18} color="#059669" />
                <Text style={styles.historyTitle}>Chat History</Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowHistoryModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* + New Chat Button inside History */}
            <TouchableOpacity
              style={styles.historyNewChatBtn}
              onPress={() => {
                setShowHistoryModal(false);
                handleNewChat();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={18} color="#059669" />
              <Text style={styles.historyNewChatText}>Start a New Chat</Text>
            </TouchableOpacity>

            {/* History List */}
            {isLoadingHistory ? (
              <View style={styles.historyLoadingBox}>
                <ActivityIndicator size="small" color="#059669" />
                <Text style={styles.historyLoadingText}>Loading past questions...</Text>
              </View>
            ) : userHistoryQueries.length === 0 ? (
              <View style={styles.emptyHistoryBox}>
                <Ionicons name="chatbubbles-outline" size={32} color="#CBD5E1" />
                <Text style={styles.emptyHistoryText}>No chat history found</Text>
                <Text style={styles.emptyHistorySub}>Your questions and chats will be saved here.</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.historyScrollView}
                showsVerticalScrollIndicator={false}
              >
                {userHistoryQueries.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id || idx}
                    style={styles.historyItemCard}
                    onPress={() => handleLoadPastMessage(item)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyItemQuery} numberOfLines={1}>
                        {item.text}
                      </Text>
                      <Text style={styles.historyItemTime}>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'Previous session'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={15} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Modal Bottom Actions */}
            <View style={styles.historyFooter}>
              {userHistoryQueries.length > 0 && (
                <TouchableOpacity
                  style={styles.clearHistoryBtn}
                  onPress={handleClearAllHistory}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={15} color="#EF4444" />
                  <Text style={styles.clearHistoryText}>Clear All History</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },

  /* 1. Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: '#FAF9F6',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(122, 154, 139, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  geminiLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FAF9F6',
  },
  headerTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 15,
    color: colors.textMain,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },

  /* 2. Messages List */
  scrollContent: {
    paddingHorizontal: spacing.gutter,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  msgAvatarBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bubbleWrapper: {
    maxWidth: '82%',
  },
  bubbleWrapperLeft: {
    alignItems: 'flex-start',
  },
  bubbleWrapperRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  bubbleMaya: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.16)',
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: '#059669',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13.5,
    lineHeight: 19.5,
  },
  bubbleTextMaya: {
    color: '#1E293B',
  },
  bubbleTextUser: {
    color: '#FFFFFF',
  },
  msgTime: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 3,
  },
  msgTimeLeft: {
    marginLeft: 4,
  },
  msgTimeRight: {
    marginRight: 4,
  },

  /* Typing Bubble */
  typingBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderBottomLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.16)',
  },
  typingDotRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    height: 12,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  /* 3. Quick Prompts */
  promptsContainer: {
    paddingVertical: 6,
    backgroundColor: '#FAF9F6',
  },
  promptsScroll: {
    paddingHorizontal: spacing.gutter,
    gap: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.18)',
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
  },
  promptEmoji: {
    fontSize: 12,
  },
  promptLabel: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: '#334155',
  },

  /* 4. Input Bar */
  inputArea: {
    paddingHorizontal: spacing.gutter,
    paddingTop: 4,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    backgroundColor: '#FAF9F6',
  },
  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(122, 154, 139, 0.22)',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
    shadowColor: '#1C2541',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 13,
    color: colors.textMain,
    maxHeight: 90,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  sendBtnActive: {
    backgroundColor: '#059669',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },

  /* 5. Gemini-Style Chat History Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  historySheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.gutter,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    maxHeight: '80%',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historyTitle: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 15,
    color: colors.textMain,
  },
  historyNewChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    gap: 6,
    marginVertical: 12,
  },
  historyNewChatText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#059669',
  },
  historyScrollView: {
    maxHeight: 320,
  },
  historyItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyItemQuery: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12.5,
    color: '#1E293B',
    marginBottom: 2,
  },
  historyItemTime: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 10,
    color: '#94A3B8',
  },
  historyLoadingBox: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 8,
  },
  historyLoadingText: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyHistoryBox: {
    paddingVertical: 36,
    alignItems: 'center',
    gap: 6,
  },
  emptyHistoryText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 13,
    color: colors.textMain,
  },
  emptyHistorySub: {
    fontFamily: typography.fontFamily.sansRegular,
    fontSize: 11,
    color: colors.textMuted,
  },
  historyFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
  },
  clearHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearHistoryText: {
    fontFamily: typography.fontFamily.sansSemiBold,
    fontSize: 12,
    color: '#EF4444',
  },
});
