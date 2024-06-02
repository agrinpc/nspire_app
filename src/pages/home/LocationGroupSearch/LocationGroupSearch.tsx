import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import TitleHeader from 'components/headers/TitleHeader'
import { SearchWithPredictions } from 'components/inputs/SearchWithPredictions'
import { HomeStackParamList } from 'navigation/HomeTabNavigation/HomeNavigation'
import { HomeTabParamList } from 'navigation/HomeTabNavigation/HomeTabNavigation'
import React, { useEffect } from 'react'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import BottomActions from './BottomActions'
import ActionFilter from './filters/ActionFilter'
import DateFilter from './filters/DateFilter/DateFilter'
import GroupFilter from './filters/GroupFilter'
import LocationFilter from './filters/LocationFilter'
import PerimeterFilter from './filters/PerimeterFilter'
import PriceFilter from './filters/PriceFilter'
import { useDispatch, useSelector } from 'react-redux'
import { selectProfile } from 'reducers/selectors/profileSelector'
import { RootState } from 'reducers/store'
import { trackEvent } from 'analytics'
import { setPerimeter } from 'reducers/searchConfig/searchConfigReducer'

const contentContainerStyle = {
  paddingBottom: 40
}

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
  align-self: center;
  width: 100%;
`

const ContentContainer = styled.View`
  z-index: 1;
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

export type LocationGroupSearchProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'LocationGroupSearch'>,
  BottomTabScreenProps<HomeTabParamList>
>

export const LocationGroupSearch = ({
  navigation
}: LocationGroupSearchProps) => {
  const i18n = useI18n()

  useEffect(() => {
    trackEvent('open_search')
  }, [])

  const dispatch = useDispatch()

  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const profile = useSelector(selectProfile)
  const city =
    searchConfig.chosenPrediction?.name ||
    profile.defaultLocation?.chosenPrediction.name

  return (
    <SafeAreaView edges={['top']}>
      <ContentContainer>
        <TitleHeader
          title={i18n['locationGroupSearch.header.title']}
          onClose={() => navigation.goBack()}
        />
      </ContentContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}>
        <ContentContainer>
          <SearchWithPredictions
            placeholder={`${city} (+${searchConfig.perimeter} km)`}
          />
          <PerimeterFilter
            defaultPerimeter={searchConfig.perimeter || 15}
            onPerimeterChange={(perimeter: number) =>
              dispatch(setPerimeter(perimeter))
            }
          />
        </ContentContainer>
        <DateFilter />
        <ContentContainer>
          <PriceFilter />
          <LocationFilter />
          <GroupFilter />
          <ActionFilter />
        </ContentContainer>
      </ScrollView>
      <BottomActions navigation={navigation} />
    </SafeAreaView>
  )
}

export default LocationGroupSearch
