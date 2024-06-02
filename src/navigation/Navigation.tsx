import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'
import LoginNavigation from './LoginNavigation/LoginNavigation'
import HomeTabNavigation from './HomeTabNavigation/HomeTabNavigation'
import { isEmpty, isLoaded } from 'react-redux-firebase'
import { RootState } from 'reducers/Store'
import { PreHomeNavigation } from './PreHomeNavigation/PreHomeNavigation'

const Navigation = () => {
  const auth = useSelector((state: RootState) => state.firebase.auth)
  const profile = useSelector((state: RootState) => state.firebase.profile)

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (isLoaded(auth) && isLoaded(profile)) setLoading(false)
  }, [auth, profile])
  useEffect(() => {
    const hideSplashScreen = async () => {
      if (!loading) {
        await SplashScreen.hideAsync()
      }
    }
    hideSplashScreen()
  }, [loading])

  if (!isLoaded(auth) || !isLoaded(profile)) return null
  if (isEmpty(auth)) return <LoginNavigation />
  if (!profile.defaultLocation) return <PreHomeNavigation />
  return <HomeTabNavigation />
}

export default Navigation
