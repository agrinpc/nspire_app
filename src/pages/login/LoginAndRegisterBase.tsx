import React, { useState } from 'react'
import { Keyboard, Platform, Text, TouchableOpacity, View } from 'react-native'
import Checkbox from 'expo-checkbox'
import styled from 'styled-components/native'
import * as WebBrowser from 'expo-web-browser'
import { Snackbar, useTheme } from 'react-native-paper'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import { useI18n } from 'translations'
import { useAuth } from 'hooks/firebaseAuth'
import LogoHeader from 'components/headers/LogoHeader'
import { LoginButton, LoginButtonType } from 'components/buttons'
import { default as UnstyledTextDivider } from 'components/TextDivider'
import { default as UnstyledEmailInput } from 'components/inputs/EmailInput'
import { default as UnstyledPasswordInput } from 'components/inputs/PasswordInput'

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
  align-self: center;
  align-items: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`
const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  align-self: flex-start;
  margin-bottom: 20px;
`

const EmailInput = styled(UnstyledEmailInput)`
  margin-bottom: 10px;
`
const PasswordInput = styled(UnstyledPasswordInput)`
  margin-bottom: 10px;
`
const PasswordForgottenButton = styled.Pressable`
  align-self: flex-end;
`

const TextDivider = styled(UnstyledTextDivider)`
  margin-top: 10px;
`

const ContentContainer = styled.ScrollView`
  width: 100%;
`

const CustomSnackbar = styled(Snackbar)`
  background-color: #eee;
`

const ConditionContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  margin-bottom: 28px;
`

const ConditionText = styled.Text`
  line-height: 20px;
  color: ${({ theme, color }: { theme: any; color?: string }) =>
    color || theme.colors.surfaceSecondary};
`

const LinkContainer = styled.View`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 10px;
`

const LoginAndRegisterBase = ({
  title,
  loginButtonText,
  goToResetPassword,
  isRegister
}: {
  title: string
  loginButtonText: string
  goToResetPassword?: () => void
  isRegister?: boolean
}) => {
  const theme = useTheme()
  const i18n = useI18n()

  const {
    registerWithEmailAndPassword,
    loginWithEmailAndPassword,
    loginWithSocial
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasEmailError, setHasEmailError] = useState(true)
  const [hasPasswordError, setHasPasswordError] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conditionsAccepted, setConditionsAccepted] = useState(false)

  const handleEmailAuth = () => {
    Keyboard.dismiss()
    setIsLoading(true)
    if (isRegister) {
      registerWithEmailAndPassword(email, password)
        .catch(() =>
          setErrorMessage(i18n['registerPage.error.invalidCredentials'])
        )
        .finally(() => setIsLoading(false))
    } else {
      loginWithEmailAndPassword(email, password)
        .catch(() =>
          setErrorMessage(i18n['loginPage.error.invalidCredentials'])
        )
        .finally(() => setIsLoading(false))
    }
  }

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

  const openLink = (link: string) => {
    WebBrowser.openBrowserAsync(link)
  }

  return (
    <SafeAreaView edges={['top', 'bottom']}>
      <LogoHeader showBackButton={true} logoPosition="center" />
      <ContentContainer showsVerticalScrollIndicator={false}>
        <Title>{title}</Title>
        <EmailInput
          value={email}
          setValue={setEmail}
          onHasError={setHasEmailError}
        />
        <PasswordInput
          value={password}
          setValue={setPassword}
          onHasError={setHasPasswordError}
          isRegister={isRegister}
        />
        {isRegister && (
          <ConditionContainer>
            <Checkbox
              value={conditionsAccepted}
              onValueChange={setConditionsAccepted}
              color={
                conditionsAccepted
                  ? theme.colors.primary
                  : theme.colors.surfaceSecondary
              }
            />

            <View>
              <LinkContainer>
                <ConditionText>
                  {i18n['loginPage.condition.text']}{' '}
                </ConditionText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => openLink('https://www.nspire-app.com/agb')}>
                  <ConditionText color="#0072BB">AGB</ConditionText>
                </TouchableOpacity>
                <ConditionText>.</ConditionText>
              </LinkContainer>

              <LinkContainer>
                <ConditionText>{i18n['loginPage.privacy.text']} </ConditionText>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    openLink('https://www.nspire-app.com/datenschutz')
                  }>
                  <ConditionText color="#0072BB">
                    {i18n['loginPage.privacy.text2']}
                  </ConditionText>
                </TouchableOpacity>
                <ConditionText>.</ConditionText>
              </LinkContainer>
            </View>
          </ConditionContainer>
        )}

        <LoginButton
          text={loginButtonText}
          onPress={handleEmailAuth}
          type={LoginButtonType.Email}
          disabled={
            hasEmailError ||
            hasPasswordError ||
            isLoading ||
            (isRegister && !conditionsAccepted)
          }
          isLoading={isLoading}
        />
        {goToResetPassword && (
          <PasswordForgottenButton onPress={() => goToResetPassword()}>
            <Text>{i18n['loginPage.passwordForgotten']}</Text>
          </PasswordForgottenButton>
        )}
        <TextDivider />
        <LoginButton
          text={i18n['loginWithFacebook']}
          onPress={() => handleSocialAuth('facebook')}
          type={LoginButtonType.Facebook}
        />
        <LoginButton
          text={i18n['loginWithGoogle']}
          onPress={() => handleSocialAuth('google')}
          type={LoginButtonType.Google}
        />
        {Platform.OS === 'ios' && (
          <LoginButton
            text={i18n['loginWithApple']}
            onPress={() => handleSocialAuth('apple')}
            type={LoginButtonType.Apple}
          />
        )}
      </ContentContainer>
      <CustomSnackbar
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage('')}
        duration={3000}
        theme={{ colors: { surface: '#000', accent: '#fff' } }}>
        {errorMessage}
      </CustomSnackbar>
    </SafeAreaView>
  )
}

export default LoginAndRegisterBase
