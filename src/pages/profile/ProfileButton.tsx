import { MaterialIcons } from '@expo/vector-icons'
import React, { ReactNode } from 'react'
import { TouchableOpacity as UnstyledTouchableOpacity } from 'react-native'
import styled from 'styled-components/native'
import { Text as PaperText } from 'react-native-paper'

const TouchableOpacity = styled(UnstyledTouchableOpacity)`
  margin-top: 20px;
  height: ${({ theme }) => theme.constants.height.button.large}px;
  border-radius: ${({ theme }) => theme.roundness}px;
`

const Content = styled.View`
  height: 100%;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.roundness}px;
  align-items: center;
  padding: 0px 15px;
`

const Text = styled(PaperText)`
  flex: 1;
  font-size: ${({ theme }) => theme.constants.fontSize.size200}px;
  font-weight: bold;
`

const Icon = styled(MaterialIcons)`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.text};
`

const ProfileButton = ({
  text,
  onPress,
  right
}: {
  text: string
  onPress: () => void
  right?: ReactNode
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Content>
        <Text>{text}</Text>
        {right ? right : <Icon name={'arrow-right-alt'} />}
      </Content>
    </TouchableOpacity>
  )
}

export default ProfileButton
