import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MoodCheckinScreen from '../screens/MoodCheckinScreen';
import MeditationScreen from '../screens/MeditationScreen';
import CrisisSupportScreen from '../screens/CrisisSupportScreen';
import TabNavigator from './TabNavigator';
import { colors, typography } from '../theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
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
