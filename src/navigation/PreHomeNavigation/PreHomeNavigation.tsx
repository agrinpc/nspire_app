import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MyDefaultLocation } from 'pages/common/MyDefaultLocation/MyDefaultLocation'
import React from 'react'

export type PreHomeStackParamList = {
  MyDefaultLocation: undefined
}
const PreHomeStack = createNativeStackNavigator<PreHomeStackParamList>()
export const PreHomeNavigation = () => (
  <PreHomeStack.Navigator initialRouteName="MyDefaultLocation">
    <PreHomeStack.Screen
      name="MyDefaultLocation"
      component={MyDefaultLocation}
      options={{ headerShown: false }}
    />
  </PreHomeStack.Navigator>
)
