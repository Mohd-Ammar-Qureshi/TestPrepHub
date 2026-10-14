import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';
import AnswerReviewScreen from '../screens/AnswerReviewScreen';
import AttemptHistoryScreen from '../screens/AttemptHistoryScreen';
import CategorySelectionScreen from '../screens/CategorySelectionScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import StudentDetailsScreen from '../screens/StudentDetailsScreen';
import TakeTestScreen from '../screens/TakeTestScreen';
import TestResultScreen from '../screens/TestResultScreen';
import TestSeriesDetailsScreen from '../screens/TestSeriesDetailsScreen';
import {useTheme} from '../theme';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SPLASH_DURATION_MS = 1500;

export function RootNavigator() {
  const {theme, isReady: themeReady} = useTheme();
  const {student, isReady: authReady} = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  // Show the splash until the saved theme and session are loaded.
  const showSplash = !themeReady || !authReady || !minTimeElapsed;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: theme.colors.background},
      }}>
      {showSplash ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : student && student.categories.length === 0 ? (
        // New students must pick categories before anything else.
        <Stack.Group>
          <Stack.Screen
            name="CategorySetup"
            component={CategorySelectionScreen}
          />
        </Stack.Group>
      ) : student ? (
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="TestSeriesDetails"
            component={TestSeriesDetailsScreen}
          />
          <Stack.Screen
            name="TakeTest"
            component={TakeTestScreen}
            options={{gestureEnabled: false}}
          />
          <Stack.Screen name="TestResult" component={TestResultScreen} />
          <Stack.Screen name="AnswerReview" component={AnswerReviewScreen} />
          <Stack.Screen
            name="AttemptHistory"
            component={AttemptHistoryScreen}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen
            name="StudentDetails"
            component={StudentDetailsScreen}
          />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen
            name="CategorySelection"
            component={CategorySelectionScreen}
            initialParams={{mode: 'edit'}}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
