/* eslint-disable react-native/no-inline-styles */
import TitleHeader from 'components/headers/TitleHeader'
import { SearchWithPredictions } from 'components/inputs/SearchWithPredictions'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Circle, Marker } from 'react-native-maps'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { Text as PaperText } from 'react-native-paper'
import { RootState } from 'reducers/store'
import { ScrollView } from 'react-native'
import { usePlaceDetails } from 'service/PlacesService'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { useCircleCoordinates } from './utils/useCircleCoordinates'
import { LinearGradientButton } from 'components/buttons'
import { default as UnstyledPerimeterFilter } from 'pages/home/LocationGroupSearch/filters/PerimeterFilter'
import { useUserService } from 'service/UserService'
import Toast from 'react-native-toast-message'
import {
  setChosenPrediction,
  setLocation,
  setPerimeter
} from 'reducers/searchConfig/searchConfigReducer'
import type { RouteProp } from '@react-navigation/native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ProfileStackParamList } from 'navigation/HomeTabNavigation/ProfileNavigation'
import { trackEvent } from 'analytics'

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

const BottomContainer = styled.View`
  flex: 1;
`

const PerimeterFilter = styled(UnstyledPerimeterFilter)`
  margin-top: 20px;
  flex-grow: 0;
`

const SaveButtonContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`

const Description = styled(PaperText)`
  margin: 20px 0 30px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.surfaceSecondary};
`

const SaveButton = styled(LinearGradientButton)`
  width: 50%;
  height: ${({ theme }) => theme.constants.height.button.large}px;
  margin-bottom: 10px;
`
type MyDefaultLocationRouteProp = RouteProp<
  ProfileStackParamList,
  'MyDefaultLocation'
>

export const MyDefaultLocation = () => {
  const i18n = useI18n()
  const route = useRoute<MyDefaultLocationRouteProp>()
  const { fromProfile } = route.params || {}
  const navigation = useNavigation()

  const dispatch = useDispatch()

  const profile = useSelector((state: RootState) => state.firebase.profile)

  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const { chosenPrediction } = searchConfig
  const locationDetails = usePlaceDetails(chosenPrediction?.id)
  const { latitude, longitude } = locationDetails || {}
  const { defaultLocation } = profile

  const [selectedPerimeter, setSelectedPerimeter] = useState(
    defaultLocation?.perimeter || searchConfig.perimeter || 15
  )
  const circleCoordinates = useCircleCoordinates({
    latitude,
    longitude,
    radius: selectedPerimeter
  })

  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    if (defaultLocation) {
      const { chosenPrediction, perimeter } = defaultLocation
      dispatch(setLocation(chosenPrediction.name))
      dispatch(setChosenPrediction(chosenPrediction))
      dispatch(setPerimeter(perimeter))
      trackEvent('change_perimeter', {
        city: chosenPrediction.name,
        perimeter
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (circleCoordinates) {
      mapRef.current?.fitToCoordinates(circleCoordinates, {
        animated: true
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, JSON.stringify(circleCoordinates)])

  const initialRegion = {
    latitude: 51,
    longitude: 10,
    latitudeDelta: 7.5,
    longitudeDelta: 7.5
  }

  const [isLoadingAfterSave, setIsLoadingAfterSave] = useState(false)
  const { updateProfile } = useUserService()

  const onSave = () => {
    setIsLoadingAfterSave(true)

    updateProfile({
      defaultLocation: {
        latitude: latitude as number,
        longitude: longitude as number,
        chosenPrediction,
        perimeter: selectedPerimeter
      }
    })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: i18n['service.errors.generalError']
        })
      })
      .finally(() => {
        dispatch(setPerimeter(selectedPerimeter))
        setIsLoadingAfterSave(false)
      })
  }

  return (
    <SafeAreaView>
      <TitleHeader
        title={i18n['preHome.myDefaultLocation.title']}
        onClose={(fromProfile && navigation.goBack) as () => void}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Description>
          {
            i18n[
              'preHome.myDefaultLocation.title.myDefaultLocation.description1'
            ]
          }
        </Description>
        <SearchWithPredictions
          placeholder={i18n['preHome.searchbar.placeholder']}
        />
        <MapView
          ref={mapRef}
          provider="google"
          style={{ marginTop: 20, width: '100%', height: 275 }}
          initialRegion={initialRegion}
          maxZoomLevel={11}
          minZoomLevel={5}>
          {latitude && longitude && (
            <>
              <Marker coordinate={{ latitude, longitude }} />
              <Circle
                radius={selectedPerimeter * 1000}
                center={{
                  latitude,
                  longitude
                }}
                fillColor="rgba(196, 43, 32, 0.3)"
                strokeColor="rgba(196, 43, 32, 0.3)"
                zIndex={2}
                strokeWidth={2}
              />
            </>
          )}
        </MapView>
        <BottomContainer>
          <PerimeterFilter
            defaultPerimeter={selectedPerimeter}
            onPerimeterChange={setSelectedPerimeter}
          />

          {!profile.defaultLocation && (
            <Description>
              {
                i18n[
                  'preHome.myDefaultLocation.title.myDefaultLocation.description2'
                ]
              }
            </Description>
          )}
          <SaveButtonContainer>
            <SaveButton
              disabled={!chosenPrediction}
              text={i18n.save}
              isLoading={isLoadingAfterSave}
              onPress={onSave}
            />
          </SaveButtonContainer>
        </BottomContainer>
      </ScrollView>
    </SafeAreaView>
  )
}
