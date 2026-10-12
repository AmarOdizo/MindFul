import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import JournalScreen from '../screens/JournalScreen';
import ChatScreen from '../screens/ChatScreen';
import MeditationScreen from '../screens/MeditationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, typography } from '../theme';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

const TabIcon = ({ focused, label }) => {
  let iconName = 'alert-circle';
  if (label === 'Home') iconName = focused ? 'home' : 'home-outline';
  else if (label === 'Chat') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
  else if (label === 'Activities') iconName = focused ? 'leaf' : 'leaf-outline';
  else if (label === 'Journal') iconName = focused ? 'book' : 'book-outline';
  else if (label === 'Profile') iconName = focused ? 'person' : 'person-outline';

  return <Ionicons name={iconName} size={26} color={focused ? colors.primary : colors.textMuted} />;
};

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary, // #7A9A8B
        tabBarInactiveTintColor: colors.textMuted, // #5C677D
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.sansSemiBold,
          fontSize: 10,
          marginTop: -5,
        },
        tabBarStyle: {
          backgroundColor: 'rgba(250, 249, 246, 0.95)',
          borderTopColor: 'transparent',
          elevation: 0,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
        },
        tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={route.name} />,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: 'Companion' }} />
      <Tab.Screen name="Activities" component={MeditationScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 9999, // Pill indicator for active items
    marginTop: 4,
  },
  iconContainerFocused: {
    backgroundColor: '#E8F0EC', // Pill indicator background from design
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  dotFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  dotUnfocused: {
    borderColor: colors.textMuted,
    backgroundColor: 'transparent',
  }
});
