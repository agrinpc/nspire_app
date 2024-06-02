import React from 'react'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useI18n } from 'translations'
import { LoginStackParamList } from 'navigation/LoginNavigation/LoginNavigation'
import LoginAndRegisterBase from './LoginAndRegisterBase'

type RegisterPageProps = NativeStackScreenProps<
  LoginStackParamList,
  'RegisterPage'
>

const RegisterPage = ({}: RegisterPageProps) => {
  const i18n = useI18n()
  return (
    <LoginAndRegisterBase
      title={i18n['registerPage.title']}
      loginButtonText={i18n['register']}
      isRegister={true}
    />
  )
}

export default RegisterPage
