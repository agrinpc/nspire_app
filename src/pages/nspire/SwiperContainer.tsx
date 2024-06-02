/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react'
import Swiper from 'react-native-deck-swiper'
import { Animated, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'
import { useFavorites } from 'hooks'
import { useI18n } from 'translations'
import { LocationGroup } from '@nspire/interfaces'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { DetailsContent } from 'pages/common/Details/DetailsContent'
import { NspireButtons } from './NspireButtons'
import { NspireCard } from './NspireCard'
import { trackEvent } from 'analytics'
import { RootState } from 'reducers/store'
import { useSelector } from 'react-redux'

interface SwiperContainerProps {
  locationGroups: LocationGroup[]
  sessionId?: string
  refresh: () => Promise<void>
  loading: boolean
  onLoading: (isLoading: boolean) => void
}

const ButtonsContainer = styled.View`
  position: absolute;
  bottom: 48px;
  left: 0px;
  right: 0px;
  overflow: hidden;
`

const LoadingContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoadingText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`

const Image = styled.Image`
  width: 150px
  height: 150px;
  margin-bottom: -20px;
`

const IndicatorContainer = styled.View`
  height: 30px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const IndicatorLine = styled.View`
  margin-top: 4px;
  height: 4px;
  width: 32px;
  border-radius: 10px;
  background-color: #000;
`

const IndicatorText = styled.Text`
  margin-top: 2px;
  font-weight: bold;
  color: #000;
`

const CustomBottomSheetBackdrop = (
  props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
) => <BottomSheetBackdrop {...props} disappearsOnIndex={0} appearsOnIndex={1} />

const Indicator = () => {
  return (
    <IndicatorContainer>
      <IndicatorLine />
      <IndicatorText>Details</IndicatorText>
    </IndicatorContainer>
  )
}

export const SwiperContainer = ({
  locationGroups,
  sessionId,
  refresh,
  loading,
  onLoading
}: SwiperContainerProps) => {
  const i18n = useI18n()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)

  const windowHeight = useWindowDimensions().height - 10

  const { like, dislike } = useFavorites()

  const swiperRef = useRef<Swiper<LocationGroup> | null>(null)

  const leftSwipeAnimation = useRef(new Animated.Value(0)).current
  const rightSwipeAnimation = useRef(new Animated.Value(0)).current

  const animationEnabled = useRef(true)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const snapPoints = [28, windowHeight * 0.92 < 670 ? '92%' : 670]

  useEffect(() => {
    setCurrentCardIndex(0)
  }, [locationGroups])

  const onSwiped = (closedCardIndex: number) => {
    const lastCardSwiped = closedCardIndex === locationGroups.length - 1
    const nextCardIndex = lastCardSwiped ? 0 : closedCardIndex + 1
    setCurrentCardIndex(nextCardIndex)
  }

  const onSwipeBack = (closedCardIndex: number) => {
    const lastCardSwiped = closedCardIndex === 0
    const nextCardIndex = lastCardSwiped
      ? locationGroups.length
      : closedCardIndex
    setCurrentCardIndex(nextCardIndex - 1)
  }

  const onSwipedLeft = (cardIndex: number) => {
    trackEvent('click_dislike', {
      name: locationGroups[cardIndex].name,
      city: searchConfig.chosenPrediction?.name
    })
    dislike(locationGroups[cardIndex])
    if (animationEnabled.current)
      Animated.sequence([
        Animated.timing(leftSwipeAnimation, {
          toValue: 0.75,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(leftSwipeAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start()
  }

  const onSwipedRight = (cardIndex: number) => {
    trackEvent('click_like', {
      name: locationGroups[cardIndex].name,
      city: searchConfig.chosenPrediction?.name
    })
    like(locationGroups[cardIndex], sessionId)
    if (animationEnabled.current)
      Animated.sequence([
        Animated.timing(rightSwipeAnimation, {
          toValue: 0.75,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(rightSwipeAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start()
  }
  const keyExtractor = (locationGroup: LocationGroup) => locationGroup?.id

  return (
    <>
      {!loading ? (
        <>
          <Swiper
            ref={swiperRef}
            keyExtractor={keyExtractor}
            stackSize={locationGroups?.length > 3 ? 3 : locationGroups?.length}
            cards={locationGroups}
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
            backgroundColor={'#fff'}
            disableBottomSwipe={true}
            infinite={false}
            onSwiped={onSwiped}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            onSwipedTop={onSwipedRight}
            onSwipedAll={async () => {
              onLoading(true)
              setCurrentCardIndex(0)
              await refresh()
              swiperRef.current?.jumpToCardIndex(0)
              onLoading(false)
              // Here be api call
            }}
            renderCard={(locationGroup: LocationGroup, index: number) => {
              if (!locationGroup) return null
              return (
                <NspireCard
                  locationGroup={locationGroup}
                  isActive={index === currentCardIndex}
                />
              )
            }}
          />

          <ButtonsContainer>
            <NspireButtons
              leftSwipeAnimation={leftSwipeAnimation}
              rightSwipeAnimation={rightSwipeAnimation}
              onClosePressed={() => {
                animationEnabled.current = false
                swiperRef.current?.swipeLeft()
                setTimeout(() => (animationEnabled.current = true), 400)
              }}
              onFavoritePressed={() => {
                animationEnabled.current = false
                swiperRef.current?.swipeRight()
                setTimeout(() => (animationEnabled.current = true), 400)
              }}
              canGoBack={currentCardIndex > 0}
              onReplayPressed={() => {
                trackEvent('click_back_button', {
                  name: locationGroups[currentCardIndex]?.name,
                  city: searchConfig.chosenPrediction?.name
                })
                swiperRef.current?.swipeBack(onSwipeBack)
              }}
            />
          </ButtonsContainer>

          <BottomSheet
            handleStyle={{ height: 44 }}
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={CustomBottomSheetBackdrop}
            onClose={() => bottomSheetRef.current?.snapToIndex(0)}
            handleComponent={Indicator}
            enablePanDownToClose>
            <BottomSheetScrollView showsVerticalScrollIndicator={false}>
              {locationGroups?.[currentCardIndex] && (
                <DetailsContent
                  locationGroup={locationGroups?.[currentCardIndex]}
                  onLike={() => {
                    swiperRef.current?.swipeRight()
                    bottomSheetRef.current?.close()
                  }}
                />
              )}
            </BottomSheetScrollView>
          </BottomSheet>
        </>
      ) : (
        <LoadingContainer>
          <Image source={require('assets/icon_loading.gif')} />
          <LoadingText>{i18n.loading}</LoadingText>
        </LoadingContainer>
      )}
    </>
  )
}
