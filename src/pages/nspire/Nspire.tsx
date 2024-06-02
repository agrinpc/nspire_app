import React, { useEffect, useRef, useState } from 'react'
import { LocationGroup } from '@nspire/interfaces'
import { NspireHeader } from './NspireHeader'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import firebase from 'firebase'
import { useFavorites } from 'hooks'
import { RootState } from 'reducers/store'
import { selectProfile } from 'reducers/selectors/profileSelector'
import { parseLocationGroups } from 'util/utils'
import { formatDateFullYearWithDots, getSeasons } from 'util/dateUtils'
import { SwiperContainer } from './SwiperContainer'
import {
  resetSearchConfig,
  setActivityName,
  setLocationGroupIds
} from 'reducers/searchConfig/searchConfigReducer'

const searchApi = firebase
  .app()
  .functions('europe-west3')
  .httpsCallable('api-search')

export const Nspire = ({ route }) => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  const { createSession } = useFavorites()
  const profile = useSelector(selectProfile)

  const seenLocationGroupIds = useRef<string[]>([])

  const searchConfig = useSelector((state: RootState) => state.searchConfig)

  const [sessionId, setSessionId] = useState<string>(route.params?.sessionId)

  const [currentLocationGroups, setCurrentLocationGroups] = useState<
    LocationGroup[]
  >([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFocused) {
      seenLocationGroupIds.current = []
      setCurrentLocationGroups([])
      dispatch(setActivityName(undefined))
      dispatch(setLocationGroupIds([]))
    } else startSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused])

  useEffect(() => {
    setLoading(!currentLocationGroups?.length)
  }, [currentLocationGroups])

  const startSession = async () => {
    const today = new Date()

    try {
      let finalSearchConfig = {
        ...searchConfig,
        ...{
          perimeter:
            searchConfig.perimeter || profile.defaultLocation?.perimeter,
          latitude: searchConfig.latitude || profile.defaultLocation?.latitude,
          longitude:
            searchConfig.longitude || profile.defaultLocation?.longitude,
          chosenPrediction:
            searchConfig.chosenPrediction ||
            profile.defaultLocation?.chosenPrediction,
          lengthOnly: false,
          dateType: searchConfig.dateType || 'today',
          fromDate: searchConfig.fromDate || today,
          toDate: searchConfig.toDate || today
        }
      }

      const sessionId = await createSession({
        activityName: searchConfig?.activityName,
        city: finalSearchConfig.chosenPrediction?.name as string,
        date:
          finalSearchConfig.dateType === 'period'
            ? `${formatDateFullYearWithDots(
                finalSearchConfig.fromDate
              )} - ${formatDateFullYearWithDots(finalSearchConfig.toDate)}`
            : formatDateFullYearWithDots(finalSearchConfig.fromDate),
        latitude: finalSearchConfig.latitude,
        longitude: finalSearchConfig.longitude,
        perimeter: finalSearchConfig.perimeter
      })

      setSessionId(sessionId)

      let seasons = finalSearchConfig.seasons
      if (!seasons?.length) {
        const now = new Date()
        seasons = getSeasons({
          dateType: 'today',
          fromDate: now,
          toDate: now
        })
      }

      const response = await searchApi({
        ...finalSearchConfig,
        seasons,
        notInLocationGroupIds: seenLocationGroupIds.current
      })

      const locationGroups = parseLocationGroups(
        response.data.locationGroups
      ) as unknown as LocationGroup[]

      if (!searchConfig?.activityName) {
        seenLocationGroupIds.current = [
          ...seenLocationGroupIds.current,
          ...locationGroups.map(lg => lg.id)
        ]
      }

      setCurrentLocationGroups(locationGroups)
      dispatch(resetSearchConfig(finalSearchConfig))
    } catch (e) {
      // ### TODO show now result screen
      console.log(e)
    }
  }

  return (
    <>
      <NspireHeader />
      <SwiperContainer
        loading={loading}
        onLoading={setLoading}
        refresh={startSession}
        locationGroups={currentLocationGroups}
        sessionId={sessionId}
      />
    </>
  )
}
