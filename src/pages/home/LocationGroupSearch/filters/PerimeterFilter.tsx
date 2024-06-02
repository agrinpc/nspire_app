/* eslint-disable react-hooks/exhaustive-deps */
import { trackEvent } from 'analytics'
import { default as UnstyledSliderWithTitle } from 'components/SliderWithTitle'
import React, { useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { useDebounce } from 'util/utils'

const SliderWithTitle = styled(UnstyledSliderWithTitle)`
  margin-top: 40px;
`

const PerimeterFilter = ({
  defaultPerimeter,
  style,
  onPerimeterChange
}: {
  defaultPerimeter: number
  style?: StyleProp<ViewStyle>
  onPerimeterChange: (perimeter: number) => void
}) => {
  const i18n = useI18n()
  const [value, setValue] = useState(defaultPerimeter)
  const debouncedValue = useDebounce(value, 750)

  useEffect(() => {
    onPerimeterChange(debouncedValue)
  }, [debouncedValue])

  return (
    <SliderWithTitle
      style={style}
      leftTitle={i18n['locationGroupSearch.perimeterSlider.perimeter']}
      rightTitle={i18n['locationGroupSearch.perimeterSlider.perimeterAmount'](
        value
      )}
      initialValue={defaultPerimeter}
      onValueChange={perimeter => {
        setValue(perimeter)
        trackEvent('search_perimeter', { perimeter })
      }}
    />
  )
}

export default PerimeterFilter
