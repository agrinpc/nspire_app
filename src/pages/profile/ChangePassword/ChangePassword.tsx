import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LinearGradientButton as UnstyledLinearGradientButton } from 'components/buttons'
import TitleHeader from 'components/headers/TitleHeader'
import NoUnderlineInput from 'components/inputs/NoUnderlineInput'
import { HomeTabParamList } from 'navigation/HomeTabNavigation/HomeTabNavigation'
import { ProfileStackParamList } from 'navigation/HomeTabNavigation/ProfileNavigation'
import React, { useEffect, useState } from 'react'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { useValidation } from 'util/validationUtils'
import { useUserService } from 'service/UserService'
import Toast from 'react-native-toast-message'
import { useMountedGoBack } from 'util/navigationUtils'

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

const InputContainer = styled.View`
  margin-bottom: 10px;
`

const LinearGradientButton = styled(UnstyledLinearGradientButton)``

export type ChangePasswordProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'ChangePassword'>,
  BottomTabScreenProps<HomeTabParamList>
>

const ChangePassword = ({ navigation }: ChangePasswordProps) => {
  const i18n = useI18n()
  const { mountedGoBack } = useMountedGoBack()
  const { changePassword } = useUserService()
  const [isLoading, setIsLoading] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [oldPasswordErrorMessage, setOldPasswordErrorMessage] = useState('')
  useEffect(() => {
    setOldPasswordErrorMessage('')
  }, [oldPassword])

  const [password, setPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')

  const { validationResult, allEntriesValid, showErrorsUntilNextInput } =
    useValidation({
      oldPassword: {
        value: oldPassword,
        validationTypes: ['IS_NOT_EMPTY']
      },
      password: {
        value: password,
        validationTypes: ['PASSWORD_MIN_LENGTH']
      },
      secondPassword: {
        value: secondPassword,
        extraValue: password,
        validationTypes: ['PASSWORDS_MATCH']
      }
    })

  const onSave = () => {
    if (!allEntriesValid) {
      showErrorsUntilNextInput()
      return undefined
    }

    setIsLoading(true)
    changePassword(oldPassword, password)
      .then(() =>
        Toast.show({
          type: 'success',
          text1: i18n['changePassword.success.changedPassword'],
          visibilityTime: 2000,
          onHide: () => mountedGoBack()
        })
      )
      .catch(error => {
        if (error?.code === 'auth/wrong-password') {
          setOldPasswordErrorMessage(
            i18n['changePassword.error.wrongOldPassword']
          )
        }
        Toast.show({
          type: 'error',
          text1: i18n['service.errors.generalError']
        })
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <SafeAreaView>
      <TitleHeader
        title={i18n['changePassword.header.title']}
        onClose={() => navigation.goBack()}
      />
      <InputContainer>
        <NoUnderlineInput
          value={oldPassword}
          onChangeValue={setOldPassword}
          errorMessage={
            validationResult?.oldPassword.errorMessage ||
            oldPasswordErrorMessage
          }
          textInputProps={{
            placeholder: i18n['changePassword.oldPassword'],
            secureTextEntry: true
          }}
        />
      </InputContainer>
      <InputContainer>
        <NoUnderlineInput
          value={password}
          onChangeValue={setPassword}
          errorMessage={validationResult?.password.errorMessage}
          textInputProps={{
            placeholder: i18n['changePassword.newPassword'],
            secureTextEntry: true
          }}
        />
      </InputContainer>
      <InputContainer>
        <NoUnderlineInput
          value={secondPassword}
          onChangeValue={setSecondPassword}
          textInputProps={{
            placeholder: i18n['changePassword.confirmNewPassword'],
            secureTextEntry: true
          }}
          errorMessage={validationResult?.secondPassword.errorMessage}
        />
      </InputContainer>

      <LinearGradientButton
        isLoading={isLoading}
        onPress={onSave}
        text={i18n['changePassword.savePassword']}
      />
    </SafeAreaView>
  )
}

export default ChangePassword
