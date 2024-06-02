import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { LinearGradientButton } from 'components/buttons/LinearGradientButton'
import {
  resetSearchConfig,
  setLatitude,
  setLongitude
} from 'reducers/searchConfig/searchConfigReducer'
import { RootState } from 'reducers/Store'
import { useSearchService } from 'service/SearchService'
import { selectProfile } from 'reducers/selectors/profileSelector'
import { LocationGroupSearchProps } from './LocationGroupSearch'

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => theme.constants.height.button.medium + 30}px;
  margin-left: 30px;
  margin-right: 30px;
`
const FindButton = styled(LinearGradientButton)`
  flex: 1;
  max-width: 220px;
  height: ${({ theme }) => theme.constants.height.button.medium}px;
  padding: 0px 20px;
`
const DeleteFiltersButton = styled.Pressable`
  width: 60px;
  margin-right: 30px;
  align-items: center;
`
const DeleteFiltersButtonText = styled.Text`
  font-size: ${({ theme }) => theme.constants.fontSize.size100}px;
  font-weight: bold;
  text-align: center;
`

const BottomActions = ({
  navigation
}: {
  navigation: LocationGroupSearchProps['navigation']
}) => {
  const i18n = useI18n()
  const dispatch = useDispatch()

  const profile = useSelector(selectProfile)

  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const { currentLocationDetails, isSearchLoading, locationGroupsAmount } =
    useSearchService({
      ...searchConfig,
      ...{ lengthOnly: true }
    })
  const findButonIsDisabled =
    !searchConfig.chosenPrediction || locationGroupsAmount < 1

  const showLocationGroups = async () => {
    dispatch(setLatitude(currentLocationDetails?.latitude as number))
    dispatch(setLongitude(currentLocationDetails?.longitude as number))

    navigation.navigate('HomeTab', {
      screen: 'Nspire'
    })
  }

  return (
    <Container>
      <DeleteFiltersButton
        onPress={() => dispatch(resetSearchConfig(profile.defaultLocation))}>
        <DeleteFiltersButtonText>
          {i18n['locationGroupSearch.deleteEverything']}
        </DeleteFiltersButtonText>
      </DeleteFiltersButton>
      <FindButton
        isLoading={isSearchLoading}
        text={i18n['locationGroupSearch.totalCount'](locationGroupsAmount)}
        onPress={() => showLocationGroups()}
        disabled={findButonIsDisabled}
      />
    </Container>
  )
}

export default BottomActions
