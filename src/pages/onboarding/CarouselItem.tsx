import React from 'react'
import { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'

const CarouselPageContainer = styled.View`
  flex: 1;
  align-items: center;
`

const CarouselImage = styled.Image`
  width: 80%;
  height: 70%;
  border-radius: 12px;
`
const CarouselTextContainer = styled.View`
  width: 80%;
`
const CarouselTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  padding: 12px 0 12px 0;
`
const CarouselSubtitle = styled.Text`
  font-size: 14px;
  color: #727272;
  padding-bottom: 8px;
`

export type CarouselItemProps = {
  title: string
  subtitle: string
  imageSrc: ImageSourcePropType
}

const CarouselItem = ({ item }: { item: CarouselItemProps }) => {
  return (
    <CarouselPageContainer>
      <CarouselImage source={item.imageSrc} resizeMode="contain" />
      <CarouselTextContainer>
        <CarouselTitle>{item.title}</CarouselTitle>
        <CarouselSubtitle>{item.subtitle}</CarouselSubtitle>
      </CarouselTextContainer>
    </CarouselPageContainer>
  )
}

export default CarouselItem
