import React, { useState } from 'react'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { LinearGradientButton } from 'components/buttons'
import LogoHeader from 'components/headers/LogoHeader'
import { default as UnstyledEmailInput } from 'components/inputs/EmailInput'

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
  margin-bottom: 40px;
`

const PasswordReset = () => {
  const i18n = useI18n()
  const [email, setEmail] = useState('')

  return (
    <SafeAreaView>
      <LogoHeader showBackButton={true} logoPosition="center" />
      <Title>{i18n['passwordReset.title']}</Title>
      <EmailInput value={email} setValue={setEmail} />
      <LinearGradientButton text={i18n['resetPassword']} onPress={() => null} />
    </SafeAreaView>
  )
}

export default PasswordReset
