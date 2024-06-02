import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
// eslint-disable-next-line import/named
import { CompositeScreenProps, useNavigation } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import TitleHeader from 'components/headers/TitleHeader'
import { HomeTabParamList } from 'navigation/HomeTabNavigation/HomeTabNavigation'
import { ProfileStackParamList } from 'navigation/HomeTabNavigation/ProfileNavigation'
import { useI18n } from 'translations'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import TitleContainer from './components/TitleContainer'
import NoUnderlineInput from 'components/inputs/NoUnderlineInput'
import GenderSelection from './GenderSelection'
import { GenderType } from '@nspire/interfaces/User'
import BirthdateSelection from './BirthdateSelection'
import { useValidation } from 'util/validationUtils'
import {
  ActivityIndicator as PaperActivityIndicator,
  Button as PaperButton
} from 'react-native-paper'
import ImageSelection from './ImageSelection'
import { useUserService } from 'service/UserService'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import { useMountedGoBack } from 'util/navigationUtils'
import { selectProfile } from 'reducers/selectors/profileSelector'

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

const Button = styled(PaperButton)`
  font-weight: bold;
`

const ActivityIndicatorContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`

const ActivityIndicator = styled(PaperActivityIndicator)``

export type ProfileSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'Profile'>,
  BottomTabScreenProps<HomeTabParamList>
>

const ProfileSettings = () => {
  const i18n = useI18n()
  const navigation = useNavigation()
  const { mountedGoBack } = useMountedGoBack()
  const profile = useSelector(selectProfile)
  const { updateProfile } = useUserService()
  const [imageUrl, setImageUrl] = useState<string>()
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [birthdate, setBirthdate] = useState<Date>()
  const [gender, setGender] = useState<GenderType>()
  const [isLoading, setIsLoading] = useState(false)

  const initialize = () => {
    setFirstname(profile.firstname)
    setLastname(profile.lastname)
    setBirthdate(profile.birthdate)
    setImageUrl(profile.imageUrl)
    setGender(profile.gender)
  }

  useEffect(() => {
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { validationResult, allEntriesValid, showErrorsUntilNextInput } =
    useValidation({
      firstname: {
        value: firstname,
        validationTypes: ['IS_NOT_EMPTY'],
        validationTranslations: {
          IS_NOT_EMPTY: i18n['validation.error.IS_NOT_EMPTY.firstname']
        }
      },
      lastname: {
        value: lastname,
        validationTypes: ['IS_NOT_EMPTY'],
        validationTranslations: {
          IS_NOT_EMPTY: i18n['validation.error.IS_NOT_EMPTY.lastname']
        }
      }
    })

  const onSubmit = () => {
    if (!allEntriesValid) {
      showErrorsUntilNextInput()
      return undefined
    }

    setIsLoading(true)
    updateProfile({ firstname, lastname, gender, imageUrl, birthdate })
      .then(() =>
        Toast.show({
          type: 'success',
          text1: i18n['profileSettings.success.savedChanges'],
          visibilityTime: 2000,
          onHide: () => mountedGoBack()
        })
      )
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: i18n['service.errors.generalError']
        })
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <SafeAreaView edges={['left', 'top', 'right']}>
      <TitleHeader
        title={i18n['profileSettings.header.title']}
        onClose={() => navigation.goBack()}
      />
      <View>
        <ActivityIndicatorContainer>
          {isLoading && <ActivityIndicator size="small" />}
          <Button
            onPress={onSubmit}
            uppercase={false}
            contentStyle={{ justifyContent: 'flex-end' }}>
            {i18n['profileSettings.save']}
          </Button>
        </ActivityIndicatorContainer>
      </View>

      <KeyboardAwareScrollView
        enableOnAndroid
        bounces={false}
        overScrollMode="never"
        extraScrollHeight={100}>
        <ImageSelection imageUrl={imageUrl} setImageUrl={setImageUrl} />

        <TitleContainer title={i18n['profileSettings.firstname']}>
          <NoUnderlineInput
            value={firstname}
            onChangeValue={setFirstname}
            errorMessage={validationResult?.firstname.errorMessage}
          />
        </TitleContainer>

        <TitleContainer title={i18n['profileSettings.lastname']}>
          <NoUnderlineInput
            value={lastname}
            onChangeValue={setLastname}
            errorMessage={validationResult?.lastname.errorMessage}
          />
        </TitleContainer>

        <BirthdateSelection birthdate={birthdate} setBirthdate={setBirthdate} />

        <GenderSelection gender={gender} setGender={setGender} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default ProfileSettings
