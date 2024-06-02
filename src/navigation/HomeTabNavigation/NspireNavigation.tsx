import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SearchConfig } from '@nspire/interfaces'
import Home from 'pages/home/Home'
import { Details } from 'pages/common/Details'
import { EventDetails } from 'pages/common/Details/EventDetails/EventDetails'

export type NspireStackParamList = {
  Nspire: {
    sessionId?: string
    searchConfig: SearchConfig
  }
}

const NspireStack = createNativeStackNavigator()

const NspireNavigation = () => (
  <NspireStack.Navigator screenOptions={{ headerShown: false }}>
    <NspireStack.Screen name="Categories" component={Home} />
    <NspireStack.Screen name="Details" component={Details} />
    <NspireStack.Screen name="EventDetails" component={EventDetails} />
  </NspireStack.Navigator>
)

export default NspireNavigation
