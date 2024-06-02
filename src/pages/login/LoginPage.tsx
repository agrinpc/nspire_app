import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LoginStackParamList } from 'navigation/LoginNavigation/LoginNavigation'
import React from 'react'
import { useI18n } from 'translations'
import LoginAndRegisterBase from './LoginAndRegisterBase'

type LoginPageProps = NativeStackScreenProps<LoginStackParamList, 'LoginPage'>

const LoginPage = ({ navigation }: LoginPageProps) => {
  const i18n = useI18n()
  return (
    <LoginAndRegisterBase
      title={i18n['loginPage.title']}
      loginButtonText={i18n['login']}
      goToResetPassword={() => navigation.navigate('PasswordReset')}
    />
  )
}

export default LoginPage
