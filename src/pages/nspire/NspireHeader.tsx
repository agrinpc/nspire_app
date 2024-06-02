import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import styled from 'styled-components/native'
import { useNavigation } from '@react-navigation/native'

const Container = styled.View`
  position: absolute;
  right: 0px;
  display: flex;
  flex-direction: row;
  margin-top: 52px;
  z-index: 1;
`

const OptionsIcon = styled(MaterialIcons)`
  right: 16px;
`

export const NspireHeader = () => {
  const navigation = useNavigation()

  return (
    <Container>
      <OptionsIcon
        name="tune"
        size={24}
        color="white"
        onPress={() =>
          navigation.navigate('HomeTab', {
            screen: 'LocationGroupSearch'
          })
        }
      />
    </Container>
  )
}
