import { GenderType } from '@nspire/interfaces/User'
import RNPickerSelect from 'react-native-picker-select'
import React, { Dispatch, SetStateAction } from 'react'
import { useI18n } from 'translations'
import { useTranslationHelpers } from 'translations/translationHelpers'
import NoUnderlineInput from 'components/inputs/NoUnderlineInput'
import TitleContainer from './components/TitleContainer'

const GenderSelection = ({
  gender,
  setGender
}: {
  gender: GenderType | undefined
  setGender: Dispatch<SetStateAction<GenderType | undefined>>
}) => {
  const i18n = useI18n()
  const { getGenderTranslation } = useTranslationHelpers()

  return (
    <>
      <TitleContainer title={i18n['profileSettings.gender']}>
        <RNPickerSelect
          placeholder={''}
          doneText={i18n.apply}
          value={gender}
          onValueChange={setGender}
          items={[
            {
              label: getGenderTranslation('female'),
              value: 'female'
            },
            {
              label: getGenderTranslation('male'),
              value: 'male'
            },
            {
              label: getGenderTranslation('other'),
              value: 'other'
            }
          ]}>
          <NoUnderlineInput
            value={getGenderTranslation(gender)}
            textInputProps={{ editable: false }}
          />
        </RNPickerSelect>
      </TitleContainer>
    </>
  )
}

export default GenderSelection
