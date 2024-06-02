import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import { Button as UnstyledButton } from 'react-native-paper'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Button = styled(UnstyledButton)<{ active?: boolean }>`
  background-color: ${({ theme, active }) =>
    active ? theme.colors.onSurface : theme.colors.background};
  margin: 5px 0px;
  margin-right: 15px;
  elevation: 4;
`

// React Native Paper Button-Icon has internally "marginLeft: 12"
// Workaround to center correctly: "margin-right: 12"
const Icon = styled(MaterialCommunityIcons)`
  align-self: center;
  margin-right: 12px;
`

const defaultContentStyle = {
  flexDirection: 'column',
  width: 80,
  height: 80
}

const defaultLabelStyle = {
  marginVertical: 0,
  marginHorizontal: 0,
  marginTop: 9,
  fontWeight: 'bold'
}

const FilterIconButton = ({
  iconName,
  text,
  onPress,
  active,
  style,
  contentStyle,
  labelStyle,
  iconSize = 24
}: {
  iconName: string
  text: string
  onPress: () => void
  active?: boolean
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  iconSize?: number
}) => {
  const theme = useTheme()

  const getTextColor = () => {
    return active ? theme.colors.oppositeText : theme.colors.text
  }

  return (
    <Button
      mode="contained"
      active={active}
      onPress={onPress}
      uppercase={false}
      icon={() => (
        <Icon name={iconName} size={iconSize} color={getTextColor()} />
      )}
      style={style}
      contentStyle={[defaultContentStyle, contentStyle]}
      labelStyle={[
        {
          ...defaultLabelStyle,
          ...{
            fontSize: theme.constants.fontSize.size100,
            color: getTextColor()
          }
        },
        labelStyle
      ]}>
      {text}
    </Button>
  )
}

export default FilterIconButton
