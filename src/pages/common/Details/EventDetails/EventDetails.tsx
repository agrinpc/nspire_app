/* eslint-disable react-native/no-inline-styles */
// eslint-disable-next-line import/named
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import { Card as PaperCard } from 'react-native-paper'
import RenderHtml from 'react-native-render-html'
import { DetailsScreenParams } from 'navigation/HomeTabNavigation/common/screenParams'
import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import styled from 'styled-components/native'
import {
  Linking,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions
} from 'react-native'
import { EvilIcons } from '@expo/vector-icons'
import TitleHeader from 'components/headers/TitleHeader'
import { PaddingContainer } from 'components'
import { Location } from '@nspire/interfaces'
import { ContactItem } from 'components/contactItem'
import { useI18n } from 'translations'
import { ImageSection } from '../sections/ImageSection/ImageSection'
import { SectionDescription } from '../components/SectionDescription'
import { SectionTitle } from '../components/SectionTitle'
import { OpeningHoursSection } from '../sections/OpeningHoursSection'
import { AddressSection } from '../sections/AddressSection'

const TitleContainer = styled.View`
  padding-top: 16px;
`

const Section = styled.TouchableOpacity`
  margin-bottom: 12px;
`

const ContactContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 16px 0px 0px;
`

const ContactItemMarginContainer = styled.View`
  width: 25%;
`

const SectionItemTitle = styled.Text`
  font-weight: bold;
`

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`

const TagContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 24px;
`

const TagChipContainer = styled(PaperCard)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 10px;
  margin-right: 4px;
  background-color: #7c44d5;
  opacity: 0.5;
  elevation: 4;
`

const TagChipText = styled.Text`
  font-size: 13px;
  color: #fff;
`

const OpenLinkImage = styled(EvilIcons)``

const Hr = styled.View`
  width: 100%;
  height: 1px;
  margin-top: 6px;
  background-color: #e7e7e7;
`

type DetailsRouteProp = RouteProp<DetailsScreenParams, 'EventDetails'>

const TagChip = ({ text }: { text: string }) => {
  return (
    <TagChipContainer>
      <TagChipText numberOfLines={1}>{text}</TagChipText>
    </TagChipContainer>
  )
}

export const EventDetails = () => {
  const route = useRoute<DetailsRouteProp>()
  const { width } = useWindowDimensions()
  const navigation = useNavigation()
  const i18n = useI18n()

  const { event, location } = route.params

  const openMap = (location: Location) => {
    if (!location.address?.latitude || !location.address?.longitude) return

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    })
    const latLng = `${location.address?.latitude},${location.address?.longitude}`
    const label = location.name
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    })

    Linking.openURL(url as string)
  }

  const openHomepage = () => {
    if (location.contact?.homepageUrl)
      WebBrowser.openBrowserAsync(location.contact?.homepageUrl)
  }

  const onAffiliateLinkPressed = (link: string) => {
    WebBrowser.openBrowserAsync(link)
  }

  return (
    <SafeAreaViewStyle>
      <ContentContainer>
        <TitleHeader title="" onClose={() => navigation.goBack()} />
      </ContentContainer>

      <ScrollView>
        <ImageSection
          imageUrls={
            event.imageUrls?.length ? event.imageUrls : location.imageUrls
          }
        />

        <PaddingContainer>
          <TitleContainer pointerEvents="none">
            <Title>{event.name}</Title>
          </TitleContainer>
          <AddressSection address={location.address} />
        </PaddingContainer>

        <ContactContainer>
          {!!location.contact?.homepageUrl?.startsWith('http') && (
            <ContactItemMarginContainer>
              <ContactItem
                text={i18n['contact.homepage']}
                icon={require('assets/icons/homepage.png')}
                onPress={openHomepage}
              />
            </ContactItemMarginContainer>
          )}

          {!!location.address.latitude && location.address.longitude && (
            <ContactItemMarginContainer>
              <ContactItem
                text={i18n['contact.route']}
                icon={require('assets/icons/route.png')}
                onPress={() => openMap(location)}
              />
            </ContactItemMarginContainer>
          )}

          {!!location.contact?.phoneNumber && (
            <ContactItemMarginContainer>
              <ContactItem
                text={i18n['contact.phone']}
                icon={require('assets/icons/phone.png')}
                onPress={() =>
                  Linking.openURL(
                    `tel:${location.contact?.phoneNumber
                      ?.replace(/ /g, '')
                      .replace(/\//g, '')}`
                  )
                }
              />
            </ContactItemMarginContainer>
          )}

          {!!location.contact?.email && (
            <ContactItemMarginContainer>
              <ContactItem
                text={i18n['contact.email']}
                icon={require('assets/icons/email.png')}
                onPress={() =>
                  Linking.openURL(`mailto:${location.contact?.email}`)
                }
              />
            </ContactItemMarginContainer>
          )}
        </ContactContainer>

        <PaddingContainer>
          <TagContainer>
            {event.tags?.map(tag => (
              <TagChip key={tag} text={tag} />
            ))}
          </TagContainer>

          {!!event.description && (
            <>
              <SectionTitle>
                {i18n['locationDetails.section.goodToKnow']}
              </SectionTitle>
              <SectionDescription>{event.description}</SectionDescription>
            </>
          )}

          {!!location.openingHours && (
            <OpeningHoursSection openingHours={location.openingHours} />
          )}

          {!!event?.affiliateLinks?.length && (
            <>
              <SectionTitle>{i18n.affiliateLinksTitle}</SectionTitle>
              {event.affiliateLinks?.map((affiliateLink, index) => (
                <Section key={affiliateLink.title}>
                  {affiliateLink.type === 'link' && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }}
                      onPress={() =>
                        onAffiliateLinkPressed(affiliateLink.data)
                      }>
                      <SectionItemTitle
                        style={{ textDecorationLine: 'underline' }}>
                        {affiliateLink.title}
                      </SectionItemTitle>
                      <OpenLinkImage
                        name="external-link"
                        color="#0072BB"
                        size={24}
                      />
                    </TouchableOpacity>
                  )}
                  {affiliateLink.type === 'html' && (
                    <>
                      <SectionItemTitle
                        style={{
                          marginBottom: 4
                        }}>
                        {affiliateLink.title}
                      </SectionItemTitle>
                      <RenderHtml
                        contentWidth={width - 32}
                        source={{
                          html: `<html><head><base href="https://nspire-app.com"></base></head><body>${affiliateLink.data}</body></html>`
                        }}
                      />
                    </>
                  )}
                  {index !== event?.affiliateLinks?.length - 1 && <Hr />}
                </Section>
              ))}
            </>
          )}
        </PaddingContainer>
      </ScrollView>
    </SafeAreaViewStyle>
  )
}

const SafeAreaViewStyle = styled(SafeAreaView)`
  flex: 1;
`

const ScrollView = styled.ScrollView`
  flex: 1;
`

const ContentContainer = styled.View`
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`
