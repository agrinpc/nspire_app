/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { Animated } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import styled from 'styled-components/native'

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
`

const Button = styled.TouchableOpacity`
  background-color: white;
  padding: 16px;
  margin: 0px 12px;
  border-radius: 50px;
  overflow: hidden;
`

const AnimatedButton = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.primary};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const Icon = styled(MaterialIcons)``

export const NspireButtons = ({
  leftSwipeAnimation,
  rightSwipeAnimation,
  canGoBack,
  onClosePressed,
  onReplayPressed,
  onFavoritePressed
}: {
  leftSwipeAnimation: any
  rightSwipeAnimation: any
  canGoBack: boolean
  onClosePressed: () => void
  onReplayPressed: () => void
  onFavoritePressed: () => void
}) => {
  return (
    <Container>
      <Button activeOpacity={0.7} onPress={onClosePressed}>
        <AnimatedButton
          style={{
            opacity: leftSwipeAnimation
          }}
        />
        <Icon name="close" color={'black'} size={30} />
      </Button>
      <Button
        activeOpacity={0.7}
        onPress={onReplayPressed}
        disabled={!canGoBack}
        style={{ opacity: canGoBack ? 1 : 0.2 }}>
        <Icon name="replay" color={'black'} size={30} />
      </Button>
      <Button activeOpacity={0.7} onPress={onFavoritePressed}>
        <AnimatedButton
          style={{
            opacity: rightSwipeAnimation
          }}
        />
        <Icon name="favorite" color={'black'} size={30} />
      </Button>
    </Container>
  )
}
