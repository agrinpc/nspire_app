import React from 'react'
import { TouchableOpacity } from 'react-native'
import { SimpleLineIcons } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { LikeButton } from 'components/card'

const Container = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 24px 16px;
  margin-top: 20px;
  position: absolute;
  width: 100%;
  z-index: 1;
`

const Icon = styled(SimpleLineIcons)`
  padding-right: 12px;
`

const ButtonsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const ImageSectionHeader = ({
  liked,
  onLikePress,
  onSharePress
}: {
  liked?: boolean
  onLikePress?: () => void
  onSharePress?: () => void
}) => {
  return (
    <Container>
      <ButtonsContainer>
        {!!onSharePress && (
          <TouchableOpacity activeOpacity={0.7} onPress={onSharePress}>
            <Icon name="share" color="#fff" size={20} />
          </TouchableOpacity>
        )}
        {!!onLikePress && (
          <LikeButton
            isAbsolute={false}
            customPadding={0}
            liked={liked}
            onPress={onLikePress}
          />
        )}
      </ButtonsContainer>
    </Container>
  )
}
