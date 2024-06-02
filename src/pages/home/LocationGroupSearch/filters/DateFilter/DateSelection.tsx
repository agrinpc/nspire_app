import React, { Dispatch, SetStateAction } from 'react'
import { Button as UnstyledPaperButton } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/Store'
import styled, { useTheme } from 'styled-components/native'
import { useI18n } from 'translations'
import { DATE_DASHES_PLACEHOLDER, formatDateWithDashes } from 'util/dateUtils'
import { DatePickerType } from './DateFilter'

const Container = styled.View`
  width: ${({ theme }) => theme.constants.width.screenContainer};
  align-self: center;
  flex-direction: row;
  margin-top: 20px;
`
const ButtonContainer = styled.View`
  flex: 1;
`
const ButtonTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
`
const Button = styled(UnstyledPaperButton)`
  background-color: ${({ theme }) => theme.colors.surface};
  margin-top: 5px;
`
const EmptySpace = styled.View`
  height: 1px;
  width: 10px;
`

const DateSelection = ({
  setDatePickerType,
  disabled
}: {
  setDatePickerType: Dispatch<SetStateAction<DatePickerType>>
  disabled?: boolean
}) => {
  const i18n = useI18n()
  const theme = useTheme()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)

  const dateButtonStyle = {
    contentStyle: {
      height: theme.constants.height.button.medium + 10
    },
    labelStyle: {
      color: disabled ? theme.colors.disabled : theme.colors.text
    }
  }

  const getDateOrPlaceholder = (date: Date | undefined) => {
    if (searchConfig.dateType !== 'period') return DATE_DASHES_PLACEHOLDER
    return formatDateWithDashes(date)
  }

  return (
    <Container>
      <ButtonContainer>
        <ButtonTitle>{i18n['from']}</ButtonTitle>
        <Button
          disabled={disabled}
          {...dateButtonStyle}
          onPress={() => setDatePickerType('from')}>
          {getDateOrPlaceholder(searchConfig.fromDate)}
        </Button>
      </ButtonContainer>
      <EmptySpace />
      <ButtonContainer>
        <ButtonTitle>{i18n['to']}</ButtonTitle>
        <Button
          disabled={disabled}
          {...dateButtonStyle}
          onPress={() => setDatePickerType('to')}>
          {getDateOrPlaceholder(searchConfig.toDate)}
        </Button>
      </ButtonContainer>
    </Container>
  )
}

export default DateSelection
