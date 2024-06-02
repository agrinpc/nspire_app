import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MyDefaultLocation } from 'pages/common/MyDefaultLocation/MyDefaultLocation'
import ChangePassword from 'pages/profile/ChangePassword/ChangePassword'
import DeleteProfile from 'pages/profile/DeleteProfile/DeleteProfile'
import Profile from 'pages/profile/Profile'
import ProfileSettings from 'pages/profile/ProfileSettings/ProfileSettings'
import React from 'react'

export type ProfileStackParamList = {
  Profile: undefined
  ProfileSettings: undefined
  ChangePassword: undefined
  DeleteProfile: undefined
  MyDefaultLocation: { fromProfile: boolean | undefined }
}
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()
const ProfileNavigation = () => (
  <ProfileStack.Navigator
    initialRouteName="Profile"
    screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="Profile" component={Profile} />
    <ProfileStack.Screen name="ProfileSettings" component={ProfileSettings} />
    <ProfileStack.Screen
      name="MyDefaultLocation"
      component={MyDefaultLocation}
      initialParams={{ fromProfile: true }}
    />
    <ProfileStack.Screen name="ChangePassword" component={ChangePassword} />
    <ProfileStack.Screen name="DeleteProfile" component={DeleteProfile} />
  </ProfileStack.Navigator>
)

export default ProfileNavigation
