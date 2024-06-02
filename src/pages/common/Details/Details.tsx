// eslint-disable-next-line import/named
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import { useLocationGroups } from 'hooks'
import { DetailsScreenParams } from 'navigation/HomeTabNavigation/common/screenParams'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native-paper'
import styled from 'styled-components/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleHeader from 'components/headers/TitleHeader'
import { DetailsContent } from './DetailsContent'
import { LocationGroup } from '@nspire/interfaces'
import { useSelector } from 'react-redux'
import { selectProfile } from '../../../reducers/selectors/profileSelector'

const Spinner = styled(ActivityIndicator)`
  position: absolute;
  top: 0px;
  bottom: 0px;
  align-self: center;
`

type DetailsRouteProp = RouteProp<DetailsScreenParams, 'Details'>

export const Details = () => {
  const route = useRoute<DetailsRouteProp>()
  const navigation = useNavigation()

  const profile = useSelector(selectProfile)
  const { getLocationGroupsByIds } = useLocationGroups()

  const [fetchedLocationGroup, setFetchedLocationGroup] =
    useState<LocationGroup | null>(null)

  const { locationGroup: routeLocationGroup, locationGroupID } = route.params

  const locationGroup = routeLocationGroup || fetchedLocationGroup

  useEffect(() => {
    const getLocationGroup = async () => {
      const { locationGroups } = await getLocationGroupsByIds({
        locationGroupIds: [locationGroupID as string],
        latitude: profile.defaultLocation?.latitude,
        longitude: profile.defaultLocation?.longitude,
        perimeter: profile.defaultLocation?.perimeter
      })
      setFetchedLocationGroup(locationGroups[0])
    }
    if (locationGroupID) {
      getLocationGroup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationGroupID])

  if (!locationGroup) return <Spinner />
  return (
    <SafeAreaViewStyle>
      <ContentContainer>
        <TitleHeader title="" onClose={() => navigation.goBack()} />
      </ContentContainer>

      <ScrollView>
        <DetailsContent locationGroup={locationGroup} />
      </ScrollView>
    </SafeAreaViewStyle>
  )
}

const SafeAreaViewStyle = styled(SafeAreaView)`
  flex: 1;
`

const ScrollView = styled.ScrollView`
  flex: 1;
`

const ContentContainer = styled.View`
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`
