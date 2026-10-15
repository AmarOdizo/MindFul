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
        color={focused ? '#059669' : '#64748B'}
      />
    </View>
  );
};

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.sansSemiBold,
          fontSize: 11,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: '#FAF9F6',
          borderTopColor: 'rgba(122, 154, 139, 0.15)',
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#1C2541',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          height: Platform.OS === 'android' ? 64 + (insets.bottom > 0 ? insets.bottom : 6) : 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'android' ? (insets.bottom > 0 ? insets.bottom + 4 : 8) : insets.bottom + 4,
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
    width: 50,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  iconWrapperFocused: {
    backgroundColor: '#E8F5EF',
  },
});
