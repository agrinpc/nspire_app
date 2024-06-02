import KostenlosLogo from 'assets/filter/kostenlos.svg'
import KostenpflichtigLogo from 'assets/filter/kostenpflichtig.svg'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPriceType } from 'reducers/searchConfig/searchConfigReducer'
import { RootState } from 'reducers/Store'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { FilterSvgButton } from './components/FilterSvgButton'
import FilterTitle from './components/FilterTitle'

const PriceButtonContainer = styled.View`
  flex-direction: row;
`

const PriceFilter = () => {
  const i18n = useI18n()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const dispatch = useDispatch()

  const imageConfig = { width: 45, height: 45 }

  return (
    <>
      <FilterTitle title={i18n['price']} />
      <PriceButtonContainer>
        <FilterSvgButton
          active={searchConfig.priceType === 'free'}
          onPress={() =>
            dispatch(
              setPriceType(
                searchConfig.priceType === 'free' ? undefined : 'free'
              )
            )
          }
          svg={<KostenlosLogo {...imageConfig} style={{ marginLeft: 16 }} />}
          text={i18n['price.free']}
        />
        <FilterSvgButton
          active={searchConfig.priceType === 'paid'}
          onPress={() =>
            dispatch(
              setPriceType(
                searchConfig.priceType === 'paid' ? undefined : 'paid'
              )
            )
          }
          svg={
            <KostenpflichtigLogo {...imageConfig} style={{ marginLeft: 16 }} />
          }
          text={i18n['price.notFree']}
        />
      </PriceButtonContainer>
    </>
  )
}

export default PriceFilter
