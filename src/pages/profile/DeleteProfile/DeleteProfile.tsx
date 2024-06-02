import React from 'react'
import { useFirebase } from 'react-redux-firebase'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import TitleHeader from 'components/headers/TitleHeader'
import { HomeTabParamList } from 'navigation/HomeTabNavigation/HomeTabNavigation'
import { ProfileStackParamList } from 'navigation/HomeTabNavigation/ProfileNavigation'
import { Text as PaperText } from 'react-native-paper'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { LinearGradientButton as UnstyledLinearGradientButton } from 'components/buttons'
import { Alert } from 'react-native'

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

const Title = styled(PaperText)`
  font-size: 16px;
  font-weight: bold;
  margin-left: 15px;
  margin-top: 20px;
`

const LinearGradientButton = styled(UnstyledLinearGradientButton)`
  margin-top: 30px;
  width: 90%;
  align-self: center;
`

const Description = styled(PaperText)`
  margin-top: 20px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.surfaceSecondary};
  margin-left: 15px;
`

export type ChangePasswordProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'DeleteProfile'>,
  BottomTabScreenProps<HomeTabParamList>
>

const DeleteProfile = ({ navigation }: ChangePasswordProps) => {
  const i18n = useI18n()
  const firebase = useFirebase()

  const deleteUser = async () => {
    const user = firebase.auth().currentUser

    await firebase.firestore().doc(`users/${user?.uid}`).delete()

    await firebase
      .auth()
      .currentUser?.delete()
      .catch(error => {
        if (error.code === 'auth/requires-recent-login') {
          // The user's credential is too old. She needs to sign in again.
          firebase.auth().signOut()
        }
      })
      .then(() => {
        Alert.alert(
          i18n['deleteProfile.deleteSuccessful.Title'],
          i18n['deleteProfile.deleteSuccessful.Description']
        )
      })
  }

  return (
    <SafeAreaView>
      <TitleHeader
        title={i18n['deleteProfile.header.title']}
        onClose={() => navigation.goBack()}
      />
      <Title>{i18n['deleteProfile.title']}</Title>
      <Description>{i18n['deleteProfile.description1']}</Description>
      <Description>{i18n['deleteProfile.description2']}</Description>
      <LinearGradientButton
        text={i18n['deleteProfile.button.title']}
        onPress={deleteUser}
      />
    </SafeAreaView>
  )
}

export default DeleteProfile
