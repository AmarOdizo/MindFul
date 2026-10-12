import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../theme';

// Empathetic companion response engine
const generateMayaResponse = (userText) => {
  const lower = userText.toLowerCase();

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

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      text: "Hello Elena. It's lovely to connect with you. How is your inner state feeling right now? Remember you can share anything without judgment.",
      hasAction: false
    };
  }

  const defaultReplies = [
    {
      text: "Thank you for sharing that with me. It takes awareness to notice how you're feeling. What is the kindest thing you could offer yourself right now?",
      hasAction: false
    },
    {
      text: "I hear you deeply. Let's take one mindful breath together right now before rushing into whatever is next.",
      hasAction: true,
      actionTitle: "MINDFUL PAUSE",
      actionSub: "One slow breath in... and one slow breath out."
    },
    {
      text: "I'm here with you. What feels like the heaviest part of this situation for you right now? We can explore it together one gentle step at a time.",
      hasAction: false
    }
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
};

export default function ChatScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef();
  
  const [messages, setMessages] = useState([
    {
      id: '1', sender: 'maya', text: 'Hello Elena. I’m glad you reached out today. How is your heart feeling after this afternoon’s busy schedule? Remember there’s no pressure to have it all figured out.', time: '2:14 PM',
    }
  ]);
  const [showMemory, setShowMemory] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);

  const formatTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    
    const textToSend = inputText.trim();
    const userMessage = { id: Date.now().toString(), sender: 'user', text: textToSend, time: formatTime() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Natural simulated AI companion response
    setTimeout(() => {
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
        }
      ]);
      setIsLoading(false);
    }, 700);
  };

  const handleQuickReply = (text) => {
    setInputText(text);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header Panel */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerBrand}>MINDFUL AI</Text>
          <Text style={styles.headerTitle}>Ai Companion</Text>
        </View>
        
        <View style={styles.companionCard}>
          <View style={styles.companionInfo}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }} 
                style={styles.avatar}
              />
              <View style={styles.statusDot} />
            </View>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.companionName}>Maya</Text>
                <Text style={styles.companionRole}> · Companion</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
                <Ionicons name="heart" size={12} color={colors.primary} />
                <Text style={styles.companionStatusText}> Listening with care</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.memoryBtn} onPress={() => setShowMemory(!showMemory)}>
              <Ionicons name="git-network-outline" size={16} color={colors.primary} />
              <Text style={styles.memoryBtnText}>4 notes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sosBtn} onPress={() => navigation.navigate('CrisisSupport')}>
              <Ionicons name="medical" size={14} color={colors.error} />
              <Text style={styles.sosBtnText}>Crisis Help</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {showMemory && (
          <View style={styles.memoryDrawer}>
            <Ionicons name="planet" size={18} color={colors.primary} />
            <Text style={styles.memoryDrawerText}>Active context: <Text style={{fontFamily: typography.fontFamily.sansSemiBold, color: colors.textMain}}>Elena's product deadline</Text></Text>
            <Text style={styles.memoryDrawerPrivate}>Private</Text>
          </View>
        )}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.chatScroll} 
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({animated: true})}
        >
          
          <View style={styles.introBanner}>
            <View style={styles.introIcon}><Ionicons name="chevron-back" size={16} color={colors.textInverse} /></View>
            <Text style={styles.introText}>
              <Text style={{fontFamily: typography.fontFamily.sansSemiBold, color: colors.textMain}}>Maya is an empathetic AI wellness companion. </Text>
              Maya is not a human doctor or therapist, but a safe space to reflect, decompress, and practice coping strategies.
            </Text>
          </View>

          {messages.map(msg => {
            const isMaya = msg.sender === 'maya';
            return (
              <View key={msg.id} style={[styles.messageWrapper, isMaya ? styles.messageWrapperLeft : styles.messageWrapperRight]}>
                <View style={[styles.messageMeta, isMaya ? {justifyContent: 'flex-start'} : {justifyContent: 'flex-end'}]}>
                  <Text style={styles.metaName}>{isMaya ? 'Maya' : msg.time}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={[styles.metaTime, !isMaya && {color: colors.textMain, fontFamily: typography.fontFamily.sansSemiBold}]}>{isMaya ? msg.time : 'You'}</Text>
                </View>
                
                <View style={[styles.messageBubble, isMaya ? styles.bubbleLeft : styles.bubbleRight, msg.isError && styles.bubbleError]}>
                  <Text style={[styles.messageText, isMaya ? styles.messageTextLeft : styles.messageTextRight, msg.isError && {color: colors.error}]}>{msg.text}</Text>
                  
                  {msg.hasAction && (
                    <View style={styles.actionCard}>
                      <View style={styles.actionIcon}><Ionicons name="color-filter-outline" size={20} color={colors.primary} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.actionTitle}>{msg.actionTitle || "SUGGESTED PAUSE"}</Text>
                        <Text style={styles.actionSub}>{msg.actionSub || "Drop your shoulders and release your jaw."}</Text>
                      </View>
                    </View>
                  )}
                </View>
                
                {isMaya && !msg.isError && <Text style={styles.msgFooterText}>Delivered with gentle presence</Text>}
                {!isMaya && <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}><Ionicons name="checkmark-done" size={14} color={colors.primary} /><Text style={styles.msgFooterTextPrimary}> Read</Text></View>}
              </View>
            );
          })}

          {isLoading && (
            <View style={[styles.messageWrapper, styles.messageWrapperLeft]}>
              <View style={[styles.messageBubble, styles.bubbleLeft, { paddingHorizontal: 20, paddingVertical: 12 }]}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            </View>
          )}

          <View style={styles.suggestedContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
              <Ionicons name="sparkles" size={14} color={colors.primary} />
              <Text style={styles.suggestedTitle}> Suggested ways to proceed:</Text>
            </View>
            <View style={styles.chipsRow}>
              <TouchableOpacity style={styles.quickChip} onPress={() => handleQuickReply("Let's do the guided 2-min physiological sigh together.")}>
                <Text style={styles.quickChipEmoji}>🌬️</Text><Text style={styles.quickChipText}>Guided 2-Min Sigh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickChip} onPress={() => handleQuickReply("I really just need to vent for a moment without fixing anything yet.")}>
                <Text style={styles.quickChipEmoji}>📝</Text><Text style={styles.quickChipText}>Let me vent for a moment</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>

        <View style={styles.inputDock}>
          <View style={styles.inputRow}>
            <TouchableOpacity 
              style={[styles.micBtn, isMicActive && {backgroundColor: colors.errorContainer}]} 
              onPress={() => setIsMicActive(!isMicActive)}
            >
              <Ionicons name="mic" size={22} color={isMicActive ? colors.error : colors.textMuted} />
            </TouchableOpacity>
            <TextInput 
              style={styles.textInput}
              placeholder="Share what's on your mind..."
              placeholderTextColor={colors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={!isLoading}
            />
            <TouchableOpacity style={[styles.sendBtn, isLoading && {opacity: 0.5}]} onPress={handleSend} disabled={isLoading}>
              <Ionicons name="send" size={18} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
          <View style={styles.privacyNote}>
            <Ionicons name="lock-closed" size={12} color={colors.tertiary} />
            <Text style={styles.privacyText}>Empathetic AI · Privacy protected · <Text style={{color: colors.error, textDecorationLine: 'underline'}}>Crisis support always accessible</Text></Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceBase },
  header: { paddingHorizontal: spacing.gutter, paddingTop: spacing.sm, paddingBottom: spacing.sm, zIndex: 10 },
  headerTop: { marginBottom: spacing.md },
  headerBrand: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.primary, letterSpacing: 1 },
  headerTitle: { fontFamily: typography.fontFamily.serifMedium, fontSize: typography.sizes.headlineLg, color: colors.textMain },
  companionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: spacing.md, borderRadius: radius.lg, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  companionInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: { position: 'relative', marginRight: spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#c8ead9' },
  statusDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, borderWidth: 2, borderColor: '#FFF' },
  companionName: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.bodyLg, color: colors.textMain },
  companionRole: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.textMuted },
  companionStatusText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.primary },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  memoryBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F3FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  memoryBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.textMain, marginLeft: 4 },
  sosBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.errorContainer, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.pill },
  sosBtnText: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.onErrorContainer, marginLeft: 4 },
  memoryDrawer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F3FF', padding: spacing.sm, borderRadius: radius.md, marginTop: spacing.xs },
  memoryDrawerText: { flex: 1, fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted, marginLeft: 6 },
  memoryDrawerPrivate: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.primary },
  
  chatScroll: { paddingHorizontal: spacing.gutter, paddingBottom: spacing.xl },
  introBanner: { flexDirection: 'row', backgroundColor: '#F2F3FF', padding: spacing.md, borderRadius: radius.lg, marginVertical: spacing.md },
  introIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#c8ead9', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm, marginTop: 2 },
  introText: { flex: 1, fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodySm, color: colors.textMuted, lineHeight: 20 },
  
  messageWrapper: { maxWidth: '92%', marginBottom: spacing.lg },
  messageWrapperLeft: { alignSelf: 'flex-start' },
  messageWrapperRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  messageMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, paddingHorizontal: 4 },
  metaName: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.textMuted },
  metaDot: { fontSize: 12, color: colors.textMuted, marginHorizontal: 4 },
  metaTime: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted },
  
  messageBubble: { padding: spacing.md, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  bubbleLeft: { backgroundColor: '#edd8fe', borderTopLeftRadius: 4, borderTopRightRadius: radius.xl, borderBottomRightRadius: radius.xl, borderBottomLeftRadius: radius.xl },
  bubbleRight: { backgroundColor: colors.primary, borderTopLeftRadius: radius.xl, borderTopRightRadius: 4, borderBottomRightRadius: radius.xl, borderBottomLeftRadius: radius.xl },
  bubbleError: { backgroundColor: '#FFE4E6', borderColor: colors.error, borderWidth: 1 },
  
  messageText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodyMd, lineHeight: 24 },
  messageTextLeft: { color: '#111a36' },
  messageTextRight: { color: colors.textInverse },
  
  actionCard: { flexDirection: 'row', backgroundColor: '#F2F3FF', padding: spacing.sm, borderRadius: radius.md, marginTop: spacing.md, alignItems: 'center' },
  actionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#c8ead9', justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  actionTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.primary, letterSpacing: 0.5 },
  actionSub: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.bodySm, color: colors.textMain },
  
  msgFooterText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted, marginTop: 4, paddingHorizontal: 4 },
  msgFooterTextPrimary: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.primary },
  
  suggestedContainer: { marginTop: spacing.md, marginBottom: spacing.xl },
  suggestedTitle: { fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelSm, color: colors.textMuted },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F3FF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1, borderColor: 'transparent' },
  quickChipEmoji: { fontSize: 16, marginRight: 6 },
  quickChipText: { flexShrink: 1, fontFamily: typography.fontFamily.sansSemiBold, fontSize: typography.sizes.labelMd, color: colors.textMain },
  
  inputDock: { paddingHorizontal: spacing.gutter, paddingTop: spacing.sm, paddingBottom: spacing.lg, backgroundColor: 'rgba(250, 248, 255, 0.95)' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: radius.xl, padding: 6, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  micBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  textInput: { flex: 1, maxHeight: 100, minHeight: 40, paddingHorizontal: spacing.sm, fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.bodyMd, color: colors.textMain },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  privacyNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.sm },
  privacyText: { fontFamily: typography.fontFamily.sansRegular, fontSize: typography.sizes.labelSm, color: colors.textMuted, marginLeft: 4 }
});
