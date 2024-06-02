import React, { useEffect } from 'react'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import * as WebBrowser from 'expo-web-browser'
import { Alert, Linking } from 'react-native'
import * as StoreReview from 'expo-store-review'
import TitleHeader from 'components/headers/TitleHeader'
import { HomeTabParamList } from 'navigation/HomeTabNavigation/HomeTabNavigation'
import { ProfileStackParamList } from 'navigation/HomeTabNavigation/ProfileNavigation'
import { useFirebase } from 'react-redux-firebase'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import { useUserService } from 'service/UserService'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import ProfileButton from './ProfileButton'
import ProfileCard from './ProfileCard'
import { trackEvent } from 'analytics'

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

const Scrollview = styled.ScrollView`
  padding: 5px;
`

export type ProfileProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'Profile'>,
  BottomTabScreenProps<HomeTabParamList>
>

const Profile = ({ navigation }: ProfileProps) => {
  const i18n = useI18n()
  const firebase = useFirebase()
  const isFocused = useIsFocused()
  const { isSignedInWithPassword } = useUserService()
  // const profile = useSelector(selectProfile)
  // const { notificationsEnabled } = profile
  // const { updateNotificationSetting } = useUserService()

  useEffect(() => {
    isFocused && trackEvent('open_profile')
  }, [isFocused])

  const openTermsOfUse = async () => {
    await WebBrowser.openBrowserAsync('https://www.nspire-app.com/agb')
  }

  const openAppReview = async () => {
    const hasAction = await StoreReview.hasAction()
    if (hasAction) {
      StoreReview.requestReview()
    }
  }

  const openEmail = () => {
    const url = 'mailto:info@nspire-app.com?subject=Feedback%20NSPIRE%20App'
    Linking.openURL(url)
  }

  const openFaq = async () => {
    await WebBrowser.openBrowserAsync('https://www.nspire-app.com')
  }

  const logout = () => {
    Alert.alert(
      i18n['profile.button.logout.title'],
      i18n['profile.button.logout.description'],
      [
        {
          text: i18n.cancel,
          style: 'cancel'
        },
        {
          text: i18n.ok,
          onPress: () => firebase.logout()
        }
      ],
      {
        cancelable: true
      }
    )
  }

  return (
    <SafeAreaView edges={['left', 'top', 'right']}>
      <TitleHeader title={i18n['profile.header.title']} />
      <Scrollview
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}>
        <ProfileCard />
        <ProfileButton
          text={i18n['profile.button.profileSettings']}
          onPress={() => navigation.navigate('ProfileSettings')}
        />
        <ProfileButton
          text={i18n['profile.button.myDefaultLocation']}
          onPress={() => navigation.navigate('MyDefaultLocation')}
        />
        <ProfileButton
          text={i18n['profile.button.termsOfUse']}
          onPress={openTermsOfUse}
        />
        {isSignedInWithPassword && (
          <ProfileButton
            text={i18n['profile.button.changePassword']}
            onPress={() => navigation.navigate('ChangePassword')}
          />
        )}
        <ProfileButton
          text={i18n['profile.button.rateApp']}
          onPress={openAppReview}
        />
        <ProfileButton
          text={i18n['profile.button.contactUs']}
          onPress={openEmail}
        />
        <ProfileButton text={i18n['profile.button.faq']} onPress={openFaq} />
        {/* <ProfileButton
          text={i18n['profile.button.notifications']}
          onPress={() => updateNotificationSetting(!notificationsEnabled)}
          right={
            <Switch
              value={notificationsEnabled}
              onValueChange={() =>
                updateNotificationSetting(!notificationsEnabled)
              }
            />
          }
        /> */}
        <ProfileButton
          text={i18n['profile.button.logout.title']}
          onPress={logout}
        />
        <ProfileButton
          text={i18n['profile.button.deleteProfile']}
          onPress={() => navigation.navigate('DeleteProfile')}
        />
      </Scrollview>
    </SafeAreaView>
  )
}

export default Profile
