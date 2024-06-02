/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { NavigatorScreenParams } from '@react-navigation/native'
import FavoritenLogo from 'assets/tabs/favoriten.svg'
import HomeLogo from 'assets/tabs/home.svg'
import NspireLogo from 'assets/tabs/nspire.svg'
import ProfilLogo from 'assets/tabs/profil.svg'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setChosenPrediction,
  setLatitude,
  setLongitude,
  setPerimeter
} from 'reducers/searchConfig/searchConfigReducer'
import { selectProfile } from 'reducers/selectors/profileSelector'
import { useTheme } from 'styled-components/native'
import FavoriteNavigation, {
  FavoriteStackParamList
} from './FavoriteNavigation'
import HomeNavigation, { HomeStackParamList } from './HomeNavigation'
import NspireNavigation, { NspireStackParamList } from './NspireNavigation'
import ProfileNavigation, { ProfileStackParamList } from './ProfileNavigation'

export type HomeTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>
  NspireTab: NavigatorScreenParams<NspireStackParamList>
  FavoriteTab: NavigatorScreenParams<FavoriteStackParamList>
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>
}

const HomeTab = createBottomTabNavigator<HomeTabParamList>()

const HomeTabNavigation = () => {
  const theme = useTheme()

  const dispatch = useDispatch()
  const profile = useSelector(selectProfile)

  useEffect(() => {
    dispatch(setChosenPrediction(profile.defaultLocation?.chosenPrediction))
    dispatch(setPerimeter(profile.defaultLocation?.perimeter || 15))
    dispatch(setLatitude(profile.defaultLocation?.latitude as number))
    dispatch(setLongitude(profile.defaultLocation?.longitude as number))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getLogoConfig = (focused: boolean) => ({
    width: focused ? 35 : 30,
    height: focused ? 35 : 30,
    color: focused ? theme.colors.primary : 'black'
  })

  return (
    <HomeTab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <HomeTab.Screen
        name="HomeTab"
        component={HomeNavigation}
        options={() => ({
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <HomeLogo {...getLogoConfig(focused)} />
          )
        })}
      />
      <HomeTab.Screen
        name="NspireTab"
        component={NspireNavigation}
        options={() => ({
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <NspireLogo {...getLogoConfig(focused)} />
          )
        })}
      />
      <HomeTab.Screen
        name="FavoriteTab"
        component={FavoriteNavigation}
        options={() => ({
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <FavoritenLogo {...getLogoConfig(focused)} />
          )
        })}
      />
      <HomeTab.Screen
        name="ProfileTab"
        component={ProfileNavigation}
        options={() => ({
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <ProfilLogo {...getLogoConfig(focused)} />
          )
        })}
      />
    </HomeTab.Navigator>
  )
}

export default HomeTabNavigation
