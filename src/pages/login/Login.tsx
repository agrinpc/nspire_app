import React, { useState } from 'react'
import { Platform } from 'react-native'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { Snackbar } from 'react-native-paper'
import { useI18n } from 'translations'
import { FontAwesome } from '@expo/vector-icons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useAuth } from 'hooks/firebaseAuth'
import { LoginStackParamList } from 'navigation/LoginNavigation/LoginNavigation'
import { LoginButton, LoginButtonType } from 'components/buttons'
import LogoHeader from 'components/headers/LogoHeader'
import { default as TextDivider } from 'components/TextDivider'

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
  align-self: center;
  align-items: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

const TopContainer = styled.View`
  width: 100%;
  justify-content: center;
`
const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  align-self: flex-start;
  margin-bottom: 20px;
`
const Subtitle = styled.Text`
  font-size: 13px;
  align-self: flex-start;
  margin-bottom: 20px;
`

const MiddleContainer = styled(TopContainer)``

const BottomContainer = styled(TopContainer)``
const ExistingAccountTitle = styled.Text`
  font-size: 25px;
  font-weight: bold;
  align-self: flex-start;
  margin: 20px 0px 10px;
`
const Button = styled.Pressable`
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
`
const ButtonText = styled.Text`
  margin-left: 10px;
`

const CustomSnackebar = styled(Snackbar)`
  background-color: #eee;
`

type LoginProps = NativeStackScreenProps<LoginStackParamList, 'Login'>

const Login = ({ navigation }: LoginProps) => {
  const i18n = useI18n()
  const { loginWithSocial } = useAuth()

  const [errorMessage, setErrorMessage] = useState('')

  const handleSocialAuth = (provider: string) => {
    loginWithSocial(provider).catch(e => {
      if (e.code === 'auth/account-exists-with-different-credential') {
        setErrorMessage(i18n['login.error.email.alreadyExists'])
      } else if (
        e.code === 'auth/argument-error' ||
        e.code === 'ERR_APPLE_AUTHENTICATION_REQUEST_FAILED'
      ) {
        /* noop */
      } else {
        setErrorMessage(i18n['service.errors.generalError'])
      }
    })
  }

  return (
    <SafeAreaView edges={['top', 'bottom']}>
      <LogoHeader showBackButton={true} logoPosition="center" />

      <TopContainer>
        <Title>{i18n['login.title']}</Title>
        <Subtitle>{i18n['login.subtitle']}</Subtitle>
        <LoginButton
          text={i18n['registerWithEmail']}
          onPress={() => navigation.navigate('RegisterPage')}
          type={LoginButtonType.Email}
        />
      </TopContainer>
      <TextDivider />
      <MiddleContainer>
        <LoginButton
          text={i18n['registerWithFacebook']}
          onPress={() => handleSocialAuth('facebook')}
          type={LoginButtonType.Facebook}
        />
        <LoginButton
          text={i18n['registerWithGoogle']}
          onPress={() => handleSocialAuth('google')}
          type={LoginButtonType.Google}
        />
        {Platform.OS === 'ios' && (
          <LoginButton
            text={i18n['registerWithApple']}
            onPress={() => handleSocialAuth('apple')}
            type={LoginButtonType.Apple}
          />
        )}
      </MiddleContainer>
      <BottomContainer>
        <ExistingAccountTitle>
          {i18n['login.existingAccount']}
        </ExistingAccountTitle>
        <Button onPress={() => navigation.navigate('LoginPage')}>
          <FontAwesome name="long-arrow-right" size={20} color="black" />
          <ButtonText>{i18n['login']}</ButtonText>
        </Button>
      </BottomContainer>

      <CustomSnackebar
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage('')}
        duration={3000}
        theme={{ colors: { surface: '#000', accent: '#fff' } }}>
        {errorMessage}
      </CustomSnackebar>
    </SafeAreaView>
  )
}

export default Login
