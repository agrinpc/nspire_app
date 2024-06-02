import React, { useEffect } from 'react'
import { Animated, Keyboard, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import { SearchWithPredictions as UnstlyedSearchWithPredictions } from 'components/inputs/SearchWithPredictions'
import { PaddingContainer } from 'components/paddingContainer'
import { ActivitySlider } from 'components/sliders'
import { selectProfile } from 'reducers/selectors/profileSelector'

import { ActivityGroup } from '@nspire/interfaces'
import { setChosenPrediction } from 'reducers/searchConfig/searchConfigReducer'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { useActivityGroups } from 'hooks'
import TitleHeader from 'components/headers/TitleHeader'
import { RootState } from 'reducers/store'

const Home = () => {
  const i18n = useI18n()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)

  const profile = useSelector(selectProfile)
  const { activityGroups } = useActivityGroups()

  useEffect(() => {
    Keyboard.dismiss()
  }, [isFocused])

  const startSession = async (prediction: { id: string; name: string }) => {
    dispatch(setChosenPrediction({ id: prediction.id, name: prediction.name }))
  }

  const city =
    searchConfig.chosenPrediction?.name ||
    profile.defaultLocation?.chosenPrediction.name

  return (
    <SafeAreaViewStyle>
      <ContentContainer>
        <TitleHeader title={i18n['home.header.title']} />
      </ContentContainer>
      <SearchContainer>
        <PaddingContainer>
          <SearchContent>
            <SearchWithPredictions
              placeholder={`${city} (+${searchConfig.perimeter} km)`}
              onPredictionPress={startSession}
            />
          </SearchContent>
        </PaddingContainer>
      </SearchContainer>

      <ScrollView showsVerticalScrollIndicator={false} style={{ zIndex: -1 }}>
        <PaddingContainer>
          <Description>{i18n['home.description']}</Description>
        </PaddingContainer>
        {activityGroups.map((activityGroup: ActivityGroup) => (
          <ActivitySlider
            key={`activity-${activityGroup.id}`}
            name={activityGroup.name}
            activities={activityGroup.activities}
          />
        ))}
      </ScrollView>
    </SafeAreaViewStyle>
  )
}

export default Home

const SafeAreaViewStyle = styled(SafeAreaView)`
  flex: 1;
`

const SearchContainer = styled(Animated.View)`
  width: 100%;
  padding-bottom: 4px;
`

const ContentContainer = styled.View`
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

const SearchContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  z-index: 2;
`

const SearchWithPredictions = styled(UnstlyedSearchWithPredictions)`
  flex: 1;
  border-radius: 0px;
`

const Description = styled.Text`
  color: ${({ theme }) => theme.colors.surfaceSecondary};
  font-size: 14px;
  padding-top: 18px;
`
