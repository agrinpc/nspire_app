import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FavoriteDetails, Favorites } from 'pages/favorites'
import { Details } from 'pages/common/Details'
import { EventDetails } from 'pages/common/Details/EventDetails/EventDetails'

export type FavoriteStackParamList = {
  Favorite: undefined
  FavoriteDetails: {
    sessionIds: string[]
    title: string
    subtitle: string
  }
  Details: undefined
  EventDetails: undefined
}
const FavoriteStack = createNativeStackNavigator<FavoriteStackParamList>()

const FavoriteNavigation = () => (
  <FavoriteStack.Navigator screenOptions={{ headerShown: false }}>
    <FavoriteStack.Screen name="Favorite" component={Favorites} />
    <FavoriteStack.Screen name="FavoriteDetails" component={FavoriteDetails} />
    <FavoriteStack.Screen name="Details" component={Details} />
    <FavoriteStack.Screen name="EventDetails" component={EventDetails} />
  </FavoriteStack.Navigator>
)

export default FavoriteNavigation
