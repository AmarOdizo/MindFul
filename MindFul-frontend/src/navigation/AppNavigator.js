import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import MoodCheckinScreen from '../screens/MoodCheckinScreen';
import MeditationScreen from '../screens/MeditationScreen';
import CrisisSupportScreen from '../screens/CrisisSupportScreen';
import TabNavigator from './TabNavigator';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator();

// Deep linking configuration for Expo React Native
const linking = {
  prefixes: [
    'mindful://',
    'https://mindful-6vxe.onrender.com',
    'http://localhost:8081',
    'http://localhost:5000',
  ],
  config: {
    screens: {
      WelcomeScreen: 'welcome',
      Login: 'login',
      Register: 'register',
      VerifyEmail: {
        path: 'verify-email',
      },
      MainTabs: 'app',
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      <Stack.Navigator
        initialRouteName="WelcomeScreen"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: colors.surfaceBase,
          },
        }}
      >
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
        />
        <Stack.Screen 
          name="VerifyEmail" 
          component={VerifyEmailScreen} 
        />
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
        />
        <Stack.Screen 
          name="MoodCheckin" 
          component={MoodCheckinScreen} 
        />
        <Stack.Screen 
          name="Meditation" 
          component={MeditationScreen} 
        />
        <Stack.Screen 
          name="CrisisSupport" 
          component={CrisisSupportScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
