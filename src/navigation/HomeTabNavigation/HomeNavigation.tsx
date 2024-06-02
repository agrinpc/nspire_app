/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LocationGroup } from '@nspire/interfaces'
import { useNavigation } from '@react-navigation/native'
import { Nspire } from 'pages/nspire/Nspire'
import {
  EventDetailsScreenParams,
  DetailsScreenParams
} from './common/screenParams'
import { LocationGroupSearch } from 'pages/home/LocationGroupSearch'
import useDeeplinking from '../../hooks/useDeepLinking'

export type HomeStackParamList = {
  Home: undefined
  Nspire: { locationGroups: LocationGroup[] }
  LocationGroupSearch: undefined
} & DetailsScreenParams &
  EventDetailsScreenParams

const HomeStack = createNativeStackNavigator<HomeStackParamList>()
const HomeNavigation = () => {
  const navigation = useNavigation()
  const [deeplinkLocationGroupID, resetDeeplink] = useDeeplinking()

  useEffect(() => {
    if (deeplinkLocationGroupID) {
      navigation.navigate('NspireTab', {
        screen: 'Details',
        params: {
          locationGroupID: deeplinkLocationGroupID
        }
      })
      resetDeeplink()
    }
  }, [deeplinkLocationGroupID])
  return (
    <HomeStack.Navigator
      initialRouteName="Nspire"
      screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Nspire" component={Nspire} />
      <HomeStack.Screen
        name="LocationGroupSearch"
        component={LocationGroupSearch}
      />
    </HomeStack.Navigator>
  )
}

export default HomeNavigation
