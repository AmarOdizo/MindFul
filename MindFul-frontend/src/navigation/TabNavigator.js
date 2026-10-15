import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import JournalScreen from '../screens/JournalScreen';
import ChatScreen from '../screens/ChatScreen';
import MeditationScreen from '../screens/MeditationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, routeName }) => {
  let iconName = 'alert-circle';
  if (routeName === 'Home') iconName = focused ? 'home' : 'home-outline';
  else if (routeName === 'Chat') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
  else if (routeName === 'Activities') iconName = focused ? 'leaf' : 'leaf-outline';
  else if (routeName === 'Journal') iconName = focused ? 'book' : 'book-outline';
  else if (routeName === 'Profile') iconName = focused ? 'person' : 'person-outline';

  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperFocused]}>
      <Ionicons
        name={iconName}
        size={21}
        color={focused ? colors.primary : colors.textMuted}
      />
    </View>
  );
};

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 6 : 10);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.sansSemiBold,
          fontSize: 11,
          marginTop: 1,
          letterSpacing: 0.1,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'rgba(100, 116, 139, 0.1)',
          borderTopWidth: 1,
          elevation: 6,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          height: 58 + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} routeName={route.name} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarLabel: 'Companion' }}
      />
      <Tab.Screen name="Activities" component={MeditationScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconWrapperFocused: {
    backgroundColor: colors.primaryLight,
  },
});
