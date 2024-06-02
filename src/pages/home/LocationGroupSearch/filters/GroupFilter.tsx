import { SearchGroupType } from '@nspire/interfaces'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setGroupTypes } from 'reducers/searchConfig/searchConfigReducer'
import { RootState } from 'reducers/Store'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { FilterSvgButton } from './components/FilterSvgButton'
import PaareLogo from 'assets/filter/paare.svg'
import FreundeLogo from 'assets/filter/freunde.svg'
import FamilieLogo from 'assets/filter/familie.svg'
import FilterTitle from './components/FilterTitle'

const SearchGroupContainer = styled.View`
  flex-direction: row;
`

const GroupFilter = () => {
  const i18n = useI18n()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const dispatch = useDispatch()

  const getNewGroupTypes = (type: SearchGroupType) => {
    const newGroupTypes = searchConfig.groupTypes
      ? [...searchConfig.groupTypes]
      : []
    const groupTypeIndex = newGroupTypes.findIndex(gType => gType === type)
    groupTypeIndex !== -1
      ? newGroupTypes.splice(groupTypeIndex, 1)
      : newGroupTypes.push(type)
    return newGroupTypes
  }

  return (
    <>
      <FilterTitle title={i18n['locationGroupSearch.group.title']} />
      <SearchGroupContainer>
        <FilterSvgButton
          active={searchConfig.groupTypes?.includes('couple')}
          onPress={() => dispatch(setGroupTypes(getNewGroupTypes('couple')))}
          svg={<PaareLogo width={40} height={40} />}
          text={i18n['locationGroupSearch.group.couple']}
        />
        <FilterSvgButton
          active={searchConfig.groupTypes?.includes('friends')}
          onPress={() => dispatch(setGroupTypes(getNewGroupTypes('friends')))}
          svg={<FreundeLogo width={45} height={45} style={{ marginLeft: 4 }} />}
          text={i18n['locationGroupSearch.group.friends']}
        />
        <FilterSvgButton
          active={searchConfig.groupTypes?.includes('family')}
          onPress={() => dispatch(setGroupTypes(getNewGroupTypes('family')))}
          svg={
            <FamilieLogo width={65} height={65} style={{ marginLeft: 12 }} />
          }
          text={i18n['locationGroupSearch.group.family']}
        />
      </SearchGroupContainer>
    </>
  )
}

export default GroupFilter
