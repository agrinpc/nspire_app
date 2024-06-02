import React, { useState } from 'react'
import { Dimensions } from 'react-native'
import { SafeAreaView as UnstyledSafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import Carousel from 'react-native-snap-carousel'
import { useI18n } from 'translations'
import CarouselItem, { CarouselItemProps } from './CarouselItem'
import { LinearGradientButton } from 'components/buttons'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import LogoHeader from 'components/headers/LogoHeader'
import { LoginStackParamList } from 'navigation/LoginNavigation/LoginNavigation'

const SafeAreaView = styled(UnstyledSafeAreaView)`
  flex: 1;
`
const LogoHeaderStyled = styled(LogoHeader)`
  height: ${({ theme }) => theme.constants.height.header.size400}px;
`

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
`

const DotsContainer = styled.View`
  flex-direction: row;
  padding: 10px 0 18px 0;
`
const Dot = styled.View<{ active: boolean }>`
  width: 10px;
  height: 10px;
  margin: 0px 2px;
  border-radius: 20px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : '#9D9D9D'};
`

const ButtonContainer = styled.View`
  width: 80%;
  align-items: center;
`

type OnboardingProps = NativeStackScreenProps<LoginStackParamList, 'Onboarding'>

const Onboarding = ({ navigation }: OnboardingProps) => {
  const i18n = useI18n()
  const { width: viewportWidth } = Dimensions.get('window')
  const [activeIndex, setActiveIndex] = useState(0)

  const data = [
    {
      title: i18n['onboarding.carousel.title1'],
      subtitle: i18n['onboarding.carousel.subtitle1'],
      imageSrc: require('assets/images/onboarding-slider-1.jpg')
    },
    {
      title: i18n['onboarding.carousel.title2'],
      subtitle: i18n['onboarding.carousel.subtitle2'],
      imageSrc: require('assets/images/onboarding-slider-2.png')
    },
    {
      title: i18n['onboarding.carousel.title3'],
      subtitle: i18n['onboarding.carousel.subtitle3'],
      imageSrc: require('assets/images/onboarding-slider-3.png')
    },
    {
      title: i18n['onboarding.carousel.title4'],
      subtitle: i18n['onboarding.carousel.subtitle4'],
      imageSrc: require('assets/images/onboarding-slider-4.png')
    },
    {
      title: i18n['onboarding.carousel.title5'],
      subtitle: i18n['onboarding.carousel.subtitle5'],
      imageSrc: require('assets/images/onboarding-slider-5.png')
    }
  ]

  return (
    <SafeAreaView edges={['top', 'bottom']}>
      <LogoHeaderStyled />
      <Container>
        <Carousel<CarouselItemProps>
          data={data}
          renderItem={CarouselItem}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          onSnapToItem={setActiveIndex}
          pagingEnabled
        />
        <DotsContainer style={{}}>
          <Dot active={activeIndex === 0} />
          <Dot active={activeIndex === 1} />
          <Dot active={activeIndex === 2} />
          <Dot active={activeIndex === 3} />
          <Dot active={activeIndex === 4} />
        </DotsContainer>
        <ButtonContainer>
          <LinearGradientButton
            text={i18n['startNow']}
            onPress={() => navigation.navigate('Login')}
          />
        </ButtonContainer>
      </Container>
    </SafeAreaView>
  )
}

export default Onboarding
