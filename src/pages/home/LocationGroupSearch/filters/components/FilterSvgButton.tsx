import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  Surface as UnstyledSurface,
  Text as PaperText
} from 'react-native-paper'
import styled from 'styled-components/native'

const Surface = styled(UnstyledSurface)`
  height: 95px;
  width: 90px;
  margin: 5px 0px;
  margin-right: 15px;
  border-radius: 12px;
`

const StyledTouchableOpacity = styled.TouchableOpacity<{ active?: boolean }>`
  height: 100%;
  width: 100%;
  border-radius: 12px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.onSurface : theme.colors.background};
  justify-content: center;
  align-items: center;
`

const SvgContainer = styled.View`
  height: 45px;
  justify-content: center;
`

const Text = styled(PaperText)<{ active?: boolean }>`
  margin: 5px 5px 0px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme, active }) =>
    active ? theme.colors.oppositeText : theme.colors.text};
`

export const FilterSvgButton = ({
  svg,
  text,
  onPress,
  active,
  style
}: {
  svg: any
  text: string
  onPress: () => void
  active?: boolean
  style?: StyleProp<ViewStyle>
}) => {
  return (
    <Surface elevation={3}>
      <StyledTouchableOpacity onPress={onPress} active={active} style={style}>
        <SvgContainer>{svg}</SvgContainer>
        <Text active={active}>{text}</Text>
      </StyledTouchableOpacity>
    </Surface>
  )
}
