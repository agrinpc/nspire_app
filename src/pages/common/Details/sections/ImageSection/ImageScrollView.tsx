import { Image } from '@nspire/interfaces'
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'
import { ScrollView } from 'react-native-gesture-handler'

const StyledImage = styled.Image<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 100%;
`

export const ImageScrollView = ({
  imageUrls,
  setCurrentImageIndex
}: {
  imageUrls: Image[]
  setCurrentImageIndex: Dispatch<SetStateAction<number>>
}) => {
  const scrollViewRef = useRef(null)
  const windowWidth = useWindowDimensions().width

  useEffect(() => reset(), [imageUrls])

  const reset = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: false })
  }

  const handleOnScrollEnd = (e: {
    nativeEvent: { contentOffset: { x: number } }
  }) => {
    const { x } = e.nativeEvent.contentOffset
    setCurrentImageIndex(Math.round(x / windowWidth))
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      onMomentumScrollEnd={handleOnScrollEnd}
      showsHorizontalScrollIndicator={false}
      decelerationRate={0}
      bounces={false}>
      {imageUrls.map(({ src }, index) => (
        <StyledImage
          width={windowWidth}
          key={`background_${index}`}
          source={{ uri: src }}
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  )
}
