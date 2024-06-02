import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 40px 0px 10px;
`
const Title = styled.Text`
  font-size: ${({ theme }) => theme.constants.fontSize.size300}px;
  font-weight: bold;
`
const Icon = styled(MaterialCommunityIcons)`
  margin-right: 10px;
`

const FilterTitle = ({
  title,
  iconName,
  style
}: {
  title: string
  iconName?: string
  style?: StyleProp<ViewStyle>
}) => {
  return (
    <TitleContainer style={style}>
      {!!iconName && <Icon name={iconName} size={24} />}
      <Title>{title}</Title>
    </TitleContainer>
  )
}
export default FilterTitle
