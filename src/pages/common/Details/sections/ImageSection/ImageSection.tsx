import React, { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import styled, { useTheme } from 'styled-components/native'
import { useI18n } from 'translations'
import { Image } from '@nspire/interfaces'
import { useSpecialEventDate } from '../../utils/useSpecialEventDate'
import { ImageScrollView } from './ImageScrollView'
import { ImageSectionHeader } from './ImageSectionHeader'

const MAX_AMOUNT_DOTS = 10

const Container = styled.View`
  width: 100%;
  height: 450px;
`

const InfoContainer = styled.View`
  position: absolute;
  width: 100%;
  display: flex;
  bottom: 0;
  z-index: 1;
`

const SpecialContainer = styled.Text`
  width: ${() => width}px;
  background-color: #7c44d5;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  padding: 12px 10px;
`

const { width } = Dimensions.get('window')

type EventData = {
  locationName: string
  startDate: Date
  endDate?: Date
  isSpecialEvent: boolean
}
type ExtraData = { locationData?: never; eventData?: EventData }

const GradientAreaAboveSwiper = styled(LinearGradient)`
  position: absolute;
  height: 150px;
  top: 0px;
  width: 100%;
`

const GradientAreaBelowSwiper = styled(LinearGradient)`
  position: absolute;
  height: 70px;
  bottom: 0px;
  width: 100%;
`

const DotsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;
`

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 8px;
  margin-left: 2px;
  margin-right: 2px;
  background-color: ${({ color }: { color: string }) => color};
`

export const ImageSection = ({
  imageUrls,
  eventData,
  liked,
  onLike,
  onDislike,
  onShare
}: {
  imageUrls: Image[]
  liked?: boolean
  onLike?: () => void
  onDislike?: () => void
  onShare?: () => void
} & ExtraData) => {
  const i18n = useI18n()
  const theme = useTheme()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { startDate, isSpecialEvent } = eventData || {}

  const specialEventDate = useSpecialEventDate(startDate)

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [imageUrls])

  const onLikePress = () => {
    if (!onLike) return

    if (liked && onDislike) onDislike()
    else onLike()
  }

  const getAmountOfDots = () => {
    const amountOfImages = imageUrls.length
    let normalizedAmount = amountOfImages % MAX_AMOUNT_DOTS
    if (normalizedAmount === 0) normalizedAmount = MAX_AMOUNT_DOTS
    if (currentImageIndex >= amountOfImages - normalizedAmount)
      return normalizedAmount
    return MAX_AMOUNT_DOTS
  }

  const getDotColor = (index: number) => {
    const normalizedCurrentIndex = currentImageIndex % MAX_AMOUNT_DOTS
    return normalizedCurrentIndex === index ? theme.colors.primary : '#fff'
  }

  return (
    <Container>
      <ImageScrollView
        imageUrls={imageUrls}
        setCurrentImageIndex={setCurrentImageIndex}
      />

      <GradientAreaAboveSwiper
        colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}>
        <ImageSectionHeader
          liked={liked}
          onLikePress={onLike ? onLikePress : undefined}
          onSharePress={onShare}
        />
      </GradientAreaAboveSwiper>

      <GradientAreaBelowSwiper
        colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none">
        <InfoContainer>
          <DotsContainer>
            {getAmountOfDots() > 1 &&
              imageUrls.map((_, index) => (
                <Dot
                  key={`background_indicator_${index}`}
                  color={getDotColor(index)}
                />
              ))}
          </DotsContainer>
          {isSpecialEvent && (
            <SpecialContainer numberOfLines={1}>
              {i18n['locationDetails.specialEvent']} {' - '} {specialEventDate}
            </SpecialContainer>
          )}
        </InfoContainer>
      </GradientAreaBelowSwiper>
    </Container>
  )
}
