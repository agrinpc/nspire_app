import React, { useEffect, useState } from 'react'
import { NativeModules, Platform } from 'react-native'
// eslint-disable-next-line import/no-named-as-default
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFromDate,
  setToDate
} from 'reducers/searchConfig/searchConfigReducer'
import { RootState } from 'reducers/store'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import FilterTitle from '../components/FilterTitle'
import DateSelection from './DateSelection'
import DateTypeSelection from './DateTypeSelection'
import { trackEvent } from 'analytics'

const StyledFilterTitle = styled(FilterTitle)`
  width: ${({ theme }) => theme.constants.width.screenContainer};
  align-self: center;
`

export type DatePickerType = 'none' | 'from' | 'to'

const DateFilter = () => {
  const i18n = useI18n()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const dispatch = useDispatch()

  const [deviceLanguage, setDeviceLanguage] = useState('en_GB')
  const [datePickerType, setDatePickerType] = useState<DatePickerType>('none')
  const isDatePickerVisible = datePickerType !== 'none'

  useEffect(() => {
    let selectedLanguage = 'en_GB'

    if (Platform.OS === 'ios') {
      selectedLanguage =
        NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
    } else {
      selectedLanguage = NativeModules.I18nManager.localeIdentifier
    }
    setDeviceLanguage(selectedLanguage)
  }, [])

  const getInitialPickerDate = () => {
    const date =
      datePickerType === 'from' ? searchConfig.fromDate : searchConfig.toDate
    if (!date) return new Date()
    return date
  }

  return (
    <>
      <StyledFilterTitle title={i18n['locationGroupSearch.date.title']} />
      <DateTypeSelection />
      {searchConfig.dateType === 'period' && (
        <DateSelection
          setDatePickerType={setDatePickerType}
          disabled={searchConfig.dateType !== 'period'}
        />
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        confirmTextIOS={i18n.apply}
        cancelTextIOS={i18n.cancel}
        date={getInitialPickerDate()}
        locale={deviceLanguage}
        textColor="black"
        isDarkModeEnabled={false}
        onConfirm={date => {
          datePickerType === 'from' &&
            trackEvent('search_date_from', {
              date: date.toISOString(),
              city: searchConfig.chosenPrediction?.name
            })
          datePickerType === 'to' &&
            trackEvent('search_date_to', {
              date: date.toISOString(),
              city: searchConfig.chosenPrediction?.name
            })

          dispatch(
            datePickerType === 'from' ? setFromDate(date) : setToDate(date)
          )
          setDatePickerType('none')
        }}
        onCancel={() => setDatePickerType('none')}
      />
    </>
  )
}

export default DateFilter
