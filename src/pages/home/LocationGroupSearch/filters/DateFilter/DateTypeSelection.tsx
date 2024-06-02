import { SearchDateType } from '@nspire/interfaces'
import React from 'react'
import { Button as UnstyledPaperButton } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import {
  setDateType,
  setFromDate,
  setToDate
} from 'reducers/searchConfig/searchConfigReducer'
import { RootState } from 'reducers/Store'
import styled, { useTheme } from 'styled-components/native'
import { useI18n } from 'translations'
import { addDaysToDate, getNextWeekendDate } from 'util/dateUtils'

const Container = styled.ScrollView`
  flex-direction: row;
  width: 95%;
  align-self: flex-end;
`
const Button = styled(UnstyledPaperButton)<{ active?: boolean }>`
  background-color: ${({ theme, active }) =>
    active ? theme.colors.onSurface : theme.colors.surface};
  margin: 5px 0px;
  margin-right: 10px;
`

const DateTypeSelection = () => {
  const i18n = useI18n()
  const theme = useTheme()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const dispatch = useDispatch()

  const getTextColor = (buttonType: SearchDateType) => {
    return buttonType === searchConfig.dateType
      ? theme.colors.oppositeText
      : theme.colors.text
  }

  const onPressToday = () => {
    dispatch(setDateType('today'))
    dispatch(setFromDate(new Date()))
    dispatch(setToDate(new Date()))
  }
  const onPressTomorrow = () => {
    dispatch(setDateType('tomorrow'))
    const date = new Date()
    const dateTomorrow = addDaysToDate(date, 1)
    dispatch(setFromDate(dateTomorrow))
    dispatch(setToDate(dateTomorrow))
  }
  const onPressWeekend = () => {
    dispatch(setDateType('weekend'))
    const { startDate, endDate } = getNextWeekendDate(new Date())
    dispatch(setFromDate(startDate))
    dispatch(setToDate(endDate))
  }
  const onPressPeriod = () => {
    dispatch(setDateType('period'))
    const date = new Date()
    const dateTomorrow = addDaysToDate(date, 1)
    dispatch(setFromDate(date))
    dispatch(setToDate(dateTomorrow))
  }

  return (
    <Container horizontal={true} showsHorizontalScrollIndicator={false}>
      <Button
        active={searchConfig.dateType === 'today'}
        color={getTextColor('today')}
        onPress={() => onPressToday()}
        uppercase={false}>
        {i18n['locationGroupSearch.date.today']}
      </Button>
      <Button
        active={searchConfig.dateType === 'tomorrow'}
        color={getTextColor('tomorrow')}
        onPress={() => onPressTomorrow()}
        uppercase={false}>
        {i18n['locationGroupSearch.date.tomorrow']}
      </Button>
      <Button
        active={searchConfig.dateType === 'weekend'}
        color={getTextColor('weekend')}
        onPress={() => onPressWeekend()}
        uppercase={false}>
        {i18n['locationGroupSearch.date.weekend']}
      </Button>
      <Button
        active={searchConfig.dateType === 'period'}
        color={getTextColor('period')}
        onPress={() => onPressPeriod()}
        uppercase={false}>
        {i18n['locationGroupSearch.period']}
      </Button>
    </Container>
  )
}

export default DateTypeSelection
