import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { NativeModules, Platform } from 'react-native'
// eslint-disable-next-line import/no-named-as-default
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import TitleContainer from './components/TitleContainer'
import NoUnderlineInput from 'components/inputs/NoUnderlineInput'
import { useI18n } from 'translations'
import { formatDateFullYearWithDots } from 'util/dateUtils'

const BirthdateSelection = ({
  birthdate,
  setBirthdate
}: {
  birthdate: Date | undefined
  setBirthdate: Dispatch<SetStateAction<Date | undefined>>
}) => {
  const i18n = useI18n()
  const [isPickerVisible, setIsPickerVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [deviceLanguage, setDeviceLanguage] = useState('en_GB')

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

  useEffect(() => {
    if (birthdate) setInputValue(formatDateFullYearWithDots(birthdate))
    else setInputValue('')
  }, [birthdate])

  return (
    <>
      <TitleContainer title={i18n['profileSettings.birthdate']}>
        <NoUnderlineInput
          value={inputValue}
          onPressIn={() => setIsPickerVisible(true)}
          textInputProps={{ editable: false }}
        />
      </TitleContainer>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        date={birthdate}
        confirmTextIOS={i18n.apply}
        cancelTextIOS={i18n.cancel}
        mode="date"
        locale={deviceLanguage}
        textColor="black"
        isDarkModeEnabled={false}
        onConfirm={date => {
          setIsPickerVisible(false)
          setBirthdate(date)
        }}
        onCancel={() => setIsPickerVisible(false)}
      />
    </>
  )
}

export default BirthdateSelection
