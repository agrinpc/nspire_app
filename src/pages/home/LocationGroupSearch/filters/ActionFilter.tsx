import { SearchActionLevel } from '@nspire/interfaces'
import LockerLogo from 'assets/filter/locker.svg'
import AktivLogo from 'assets/filter/aktiv.svg'
import NormalLogo from 'assets/filter/normal.svg'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActionLevels } from 'reducers/searchConfig/searchConfigReducer'
import { RootState } from 'reducers/Store'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import FilterTitle from './components/FilterTitle'
import { FilterSvgButton } from './components/FilterSvgButton'

const SearchActionContainer = styled.View`
  flex-direction: row;
`

const ActionFilter = () => {
  const i18n = useI18n()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const dispatch = useDispatch()

  const getNewActionLevels = (level: SearchActionLevel) => {
    const newLevels = [...searchConfig.actionLevels]
    const levelIndex = newLevels.findIndex(lvl => lvl === level)
    levelIndex !== -1 ? newLevels.splice(levelIndex, 1) : newLevels.push(level)
    return newLevels
  }

  const imageConfig = { width: 45, height: 45 }

  return (
    <>
      <FilterTitle title={i18n['locationGroupSearch.action.title']} />
      <SearchActionContainer>
        <FilterSvgButton
          active={searchConfig.actionLevels.includes('easy')}
          onPress={() => dispatch(setActionLevels(getNewActionLevels('easy')))}
          svg={<LockerLogo {...imageConfig} style={{ marginLeft: 16 }} />}
          text={i18n['locationGroupSearch.action.easy']}
        />
        <FilterSvgButton
          active={searchConfig.actionLevels.includes('normal')}
          onPress={() =>
            dispatch(setActionLevels(getNewActionLevels('normal')))
          }
          svg={<NormalLogo width={38} height={38} style={{ marginLeft: 8 }} />}
          text={i18n['locationGroupSearch.action.normal']}
        />
        <FilterSvgButton
          active={searchConfig.actionLevels.includes('active')}
          onPress={() =>
            dispatch(setActionLevels(getNewActionLevels('active')))
          }
          svg={
            <AktivLogo
              {...imageConfig}
              style={{ marginLeft: 4, marginBottom: 4 }}
            />
          }
          text={i18n['locationGroupSearch.action.active']}
        />
      </SearchActionContainer>
    </>
  )
}

export default ActionFilter
