import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { CategoryChips } from 'pages/common/Details/sections/ImageSection/CategoryChips'
import { LocationGroup } from '@nspire/interfaces'
import { LinearGradient } from 'expo-linear-gradient'
import { useI18n } from 'translations'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { Animated, useWindowDimensions } from 'react-native'
import { trackEvent } from 'analytics'
import { RootState } from 'reducers/store'
import { useSelector } from 'react-redux'
import { selectProfile } from 'reducers/selectors/profileSelector'

interface NspireProps {
  locationGroup: LocationGroup
  isActive: boolean
}

const SwipeableImage = styled.ImageBackground<{
  children?: ReactNode
  height: number
}>`
  height: ${({ height }) => height}px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const GradientAreaAboveSwiper = styled(LinearGradient)`
  position: absolute;
  height: 150px;
  top: 0px;
  width: 100%;
  z-index: 1;
`

const GradientAreaBelowSwiper = styled(LinearGradient)<{
  height: number
}>`
  position: absolute;
  bottom: 0px;
  height: 350px;
  width: 100%;
`

const ContentContainer = styled.View`
  height: 100%;
  width: 100%;
  align-self: center;
  justify-content: flex-end;
  padding-bottom: 110px;
`

const TextContainer = styled.View`
  padding-left: ${({ theme }) => theme.constants.padding.horizontal}px;
`

const NameContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const Title = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.constants.fontSize.size900}px;
  color: white;
  font-weight: bold;
  margin-right: 24px;
`

const FreeLabel = styled.View`
  background-color: #fff;
  padding: 8px 10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`

const FreeLabelText = styled.Text`
  font-size: 12px;
  font-weight: bold;
`

const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.constants.fontSize.size300}px;
  text-decoration-line: underline;
  margin-top: 20px;
  margin-bottom: 5px;
  color: #fff;
`

const Dot = styled.View`
  width: 20px;
  height: 2px;
  border-radius: 10px;
  margin-right: 2px;
  background-color: ${({ color }: { color: string }) => color};
`

const FilledDot = styled(Animated.View)`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 100%;
`

const DotsContainer = styled.View`
  position: absolute;
  top: 64px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 1;
`

const animationDuration = 5000

const Dots = ({
  currentIndex,
  imagesCount,
  progressWidth
}: {
  currentIndex: number
  imagesCount: number
  progressWidth: any
}) => {
  const theme = useTheme()

  return (
    <DotsContainer>
      {imagesCount > 1 &&
        [...Array(imagesCount).keys()].map(index => (
          <Dot
            key={`background_indicator_${index}`}
            color={currentIndex > index ? theme.colors.primary : '#fff'}>
            {index === currentIndex && (
              <FilledDot
                style={{
                  width: progressWidth
                }}
              />
            )}
          </Dot>
        ))}
    </DotsContainer>
  )
}

export const NspireCard = ({ locationGroup, isActive }: NspireProps) => {
  const i18n = useI18n()

  const tabBarHeight = useBottomTabBarHeight()
  const windowHeight = useWindowDimensions().height

  const searchConfig = useSelector((state: RootState) => state.searchConfig)

  const height = windowHeight - tabBarHeight

  const oneThirdOfTheScreen = height * 0.2
  const scrollDownAreaStart = height - oneThirdOfTheScreen
  const scrollDownAreaEnd = height
  const blockerHeight = scrollDownAreaEnd - scrollDownAreaStart

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const currentProgressWidth = useRef(new Animated.Value(0)).current

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentProgressRef = useRef(
    Animated.timing(currentProgressWidth, {
      toValue: 20,
      duration: animationDuration,
      useNativeDriver: false
    })
  )

  const images = locationGroup?.images || []

  useEffect(() => {
    trackEvent('show_activity', {
      activity: locationGroup.name,
      city: searchConfig.chosenPrediction?.name
    })
    return () => clearAnimation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (images.length > 1) {
      if (isActive) startImageAnimation()
      else clearAnimation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentImageIndex])

  const clearAnimation = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    currentProgressRef.current.stop()
    currentProgressWidth.setValue(0)
  }

  const startImageAnimation = () => {
    currentProgressRef.current.stop()
    currentProgressWidth.setValue(0)
    currentProgressRef.current.start()
    timeoutRef.current = setTimeout(() => {
      setCurrentImageIndex(
        images[currentImageIndex + 1] ? currentImageIndex + 1 : 0
      )
    }, animationDuration)
  }

  return (
    <>
      <GradientAreaAboveSwiper
        colors={['rgba(0, 0, 0, 0.4)', 'transparent']}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
      />
      <Dots
        currentIndex={currentImageIndex}
        imagesCount={images.length}
        progressWidth={currentProgressWidth}
      />
      <SwipeableImage
        height={height}
        source={{
          uri: locationGroup?.images?.[currentImageIndex]?.src
        }}>
        <GradientAreaBelowSwiper
          height={blockerHeight}
          colors={['transparent', '#000']}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.5, y: 1 }}>
          <ContentContainer>
            <TextContainer>
              <NameContainer>
                <Title numberOfLines={1}>{locationGroup.name}</Title>
                {locationGroup.priceModel === 'free' && (
                  <FreeLabel>
                    <FreeLabelText>{i18n['price.free']}</FreeLabelText>
                  </FreeLabel>
                )}
              </NameContainer>

              {locationGroup.distanceToGivenLocation && (
                <Subtitle>{locationGroup.distanceToGivenLocation} km</Subtitle>
              )}
            </TextContainer>
            <CategoryChips categories={locationGroup.categories?.slice(0, 2)} />
          </ContentContainer>
        </GradientAreaBelowSwiper>
      </SwipeableImage>
    </>
  )
}
