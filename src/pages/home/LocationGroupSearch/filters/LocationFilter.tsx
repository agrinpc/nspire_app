import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLocationTypes } from 'reducers/searchConfig/searchConfigReducer'
import { RootState } from 'reducers/Store'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import type { SearchLocationType } from '@nspire/interfaces'
import FilterTitle from './components/FilterTitle'
import { FilterSvgButton } from './components/FilterSvgButton'
import IndoorLogo from 'assets/filter/indoor.svg'
import OutdoorLogo from 'assets/filter/outdoor.svg'
import OnlineLogo from 'assets/filter/online.svg'

const LocationButtonContainer = styled.View`
  flex-direction: row;
`

const LocationFilter = () => {
  const i18n = useI18n()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const dispatch = useDispatch()

  const getNewLocationTypes = (type: SearchLocationType) => {
    const newLocationTypes = [...searchConfig.locationTypes]
    const locationTypeIndex = newLocationTypes.findIndex(
      lType => lType === type
    )
    locationTypeIndex !== -1
      ? newLocationTypes.splice(locationTypeIndex, 1)
      : newLocationTypes.push(type)
    return newLocationTypes
  }

  const imageConfig = { width: 45, height: 45 }

  return (
    <>
      <FilterTitle title={i18n['locationGroupSearch.location.title']} />
      <LocationButtonContainer>
        <FilterSvgButton
          active={searchConfig.locationTypes.includes('online')}
          onPress={() =>
            dispatch(setLocationTypes(getNewLocationTypes('online')))
          }
          svg={<OnlineLogo {...imageConfig} />}
          text={i18n['locationGroupSearch.location.online']}
        />
        <FilterSvgButton
          active={searchConfig.locationTypes.includes('indoor')}
          onPress={() =>
            dispatch(setLocationTypes(getNewLocationTypes('indoor')))
          }
          svg={<IndoorLogo {...imageConfig} />}
          text={i18n['locationGroupSearch.location.indoor']}
        />
        <FilterSvgButton
          active={searchConfig.locationTypes.includes('outdoor')}
          onPress={() =>
            dispatch(setLocationTypes(getNewLocationTypes('outdoor')))
          }
          svg={<OutdoorLogo {...imageConfig} />}
          text={i18n['locationGroupSearch.location.outdoor']}
        />
      </LocationButtonContainer>
    </>
  )
}

export default LocationFilter
