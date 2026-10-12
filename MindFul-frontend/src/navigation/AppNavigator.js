import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import MoodCheckinScreen from '../screens/MoodCheckinScreen';
import MeditationScreen from '../screens/MeditationScreen';
import CrisisSupportScreen from '../screens/CrisisSupportScreen';
import TabNavigator from './TabNavigator';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="WelcomeScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surfaceBase, // Off-white alabaster
          },
          headerTitleStyle: {
            fontFamily: typography.fontFamily.serifMedium, // Newsreader
            fontSize: typography.sizes.headlineSm,
            color: colors.textMain,
          },
          headerTintColor: colors.primary, // Sage Green back arrows
          headerShadowVisible: false, // Flat surfaces, no aggressive drop shadows
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="WelcomeScreen" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MoodCheckin" 
          component={MoodCheckinScreen} 
          options={{ title: 'Daily Check-in' }} 
        />
        <Stack.Screen 
          name="Meditation" 
          component={MeditationScreen} 
          options={{ title: 'Breathe' }} 
        />
        <Stack.Screen 
          name="CrisisSupport" 
          component={CrisisSupportScreen} 
          options={{ title: 'Crisis Support', headerTintColor: colors.error }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
