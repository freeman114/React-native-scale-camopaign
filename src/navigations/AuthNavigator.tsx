import React from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { stackScreenOptions } from './NavigationHelper';
import NavigationNames from './NavigationNames';
import HomePageTabNavigator from './HomePageTabNavigator';
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import { createStackNavigator } from '@react-navigation/stack';
import { StorageTokenKey } from '../api';
import { useAsync } from '../hooks/useAsync';
import { SurveyCompletedScreen, SurveyScreen } from '../screens';
import { useLocalization } from '../localization';

const Stack = createStackNavigator();

async function getToken () {
  return await AsyncStorage.getItem(StorageTokenKey);
}

export const AuthTabStack = () => {
  const { pending, value: token } = useAsync(getToken);
  const { getString } = useLocalization();

  if (pending) {
    return null;
  }

  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        ...stackScreenOptions,
        headerShown: false,
      }}
      initialRouteName={token ? NavigationNames.HomePageTabScreen : NavigationNames.LoginScreen}
    >
      <Stack.Screen
        name={NavigationNames.LoginScreen}
        component={LoginScreen}
      />
      <Stack.Screen
        name={NavigationNames.RegisterScreen}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={NavigationNames.ForgotPasswordScreen}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name={NavigationNames.HomePageTabScreen}
        component={HomePageTabNavigator}
      />
      <Stack.Screen
        name={NavigationNames.SurveyScreen}
        component={SurveyScreen}
        options={{
          title: getString("Survey"),
          headerShown: true
        }}
      />
      <Stack.Screen
        name={NavigationNames.SurveyCompletedScreen}
        component={SurveyCompletedScreen}
      />
    </Stack.Navigator>
  );
};