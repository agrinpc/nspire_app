import React, { ReactNode } from 'react'
import { Text as PaperText } from 'react-native-paper'
import styled from 'styled-components/native'

const Container = styled.View`
  margin-top: 10px;
`

const Title = styled(PaperText)`
  margin-bottom: 10px;
  margin-left: 12px;
`

const TitleContainer = ({
  title,
  children
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      {children}
    </Container>
  )
}

export default TitleContainer
