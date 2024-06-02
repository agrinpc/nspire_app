import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from 'pages/login/Login'
import LoginPage from 'pages/login/LoginPage'
import PasswordReset from 'pages/login/PasswordReset'
import RegisterPage from 'pages/login/RegisterPage'
import Onboarding from 'pages/onboarding/Onboarding'
import React from 'react'

export type LoginStackParamList = {
  Onboarding: undefined
  Login: undefined
  LoginPage: undefined
  RegisterPage: undefined
  PasswordReset: undefined
}
const LoginStack = createNativeStackNavigator<LoginStackParamList>()
const LoginNavigation = () => (
  <LoginStack.Navigator initialRouteName="Onboarding">
    <LoginStack.Screen
      name="Onboarding"
      component={Onboarding}
      options={{ headerShown: false }}
    />
    <LoginStack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <LoginStack.Screen
      name="LoginPage"
      component={LoginPage}
      options={{ headerShown: false }}
    />
    <LoginStack.Screen
      name="RegisterPage"
      component={RegisterPage}
      options={{ headerShown: false }}
    />
    <LoginStack.Screen
      name="PasswordReset"
      component={PasswordReset}
      options={{ headerShown: false }}
    />
  </LoginStack.Navigator>
)

export default LoginNavigation
