/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'
import {
  Linking,
  Platform,
  Share,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native'
import RenderHtml from 'react-native-render-html'
import * as WebBrowser from 'expo-web-browser'
import { MaterialIcons, EvilIcons } from '@expo/vector-icons'
import { LocationGroup, Location, Event } from '@nspire/interfaces'
import { useI18n } from 'translations'
import { SectionDescription } from './components/SectionDescription'
import { ContactItem } from 'components/contactItem'
import { SectionTitle } from './components/SectionTitle'
import { AddressSection } from './sections/AddressSection'
import { ImageSection } from './sections/ImageSection/ImageSection'
import { OpeningHoursSection } from './sections/OpeningHoursSection'
import { SpecialEventsSection } from './sections/SpecialEventsSection/SpecialEventsSection'
import Constants from '../../../../Constants'
import firebase from 'firebase'
import { trackEvent } from 'analytics'
import { useSelector } from 'react-redux'
import { RootState } from 'reducers/store'

const PaddingContainer = styled.View`
  padding: 0px 24px;
`

const ContactContainer = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  padding: 16px 16px 0px;
`

const ContactItemMarginContainer = styled.View`
  width: 20%;
`

const Section = styled.TouchableOpacity`
  margin-bottom: 12px;
`

const SectionItemTitle = styled.Text`
  font-weight: bold;
  margin-right: 4px;
`

const AddressText = styled.Text``

const RatingContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 4px;
  margin-bottom: 4px;
  align-items: center;
`
const RatingText = styled.Text`
  margin-right: 6px;
`

const StarIcon = styled(MaterialIcons)`
  margin-right: 2px;
`

const TitleContainer = styled.View`
  padding-top: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  padding-right: 6px;
`

const OfficialImage = styled.Image`
  width: 20px;
  height: 20px;
`

const Hr = styled.View`
  width: 100%;
  height: 1px;
  margin-top: 6px;
  background-color: #e7e7e7;
`

const LocationInfoItemContainer = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  background-color: #f2f2f2;
  border-radius: 48px;
  margin-left: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LocationInfoItemIcon = styled.Image`
  width: 20px;
  height: 20px;
`

const LocationHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const OpenLinkImage = styled(EvilIcons)``

export const DetailsContent = ({
  locationGroup,
  onLike
}: {
  locationGroup: LocationGroup
  onLike?: () => void
}) => {
  const { width } = useWindowDimensions()
  const i18n = useI18n()
  const theme = useTheme()
  const searchConfig = useSelector((state: RootState) => state.searchConfig)
  const [events, setEvents] = useState<Event[] | null>(null)

  const eventSearch = firebase
    .app()
    .functions('europe-west3')
    .httpsCallable('api-events')

  const premiumLocation = locationGroup?.locations?.[0]?.isPremium
    ? locationGroup.locations[0]
    : undefined

  useEffect(() => {
    if (premiumLocation) {
      eventSearch({ locationID: premiumLocation.id })
        .then(({ data }) => {
          setEvents(data)
        })
        .catch(error => {
          console.log(error)
          setEvents(null)
        })
    }
  }, [premiumLocation])

  useEffect(() => {
    trackEvent('open_details_screen', {
      activity: locationGroup.name,
      city: searchConfig.chosenPrediction?.name
    })
  }, [locationGroup])

  const openMap = async (location: Location) => {
    if (!location.address?.latitude || !location.address?.longitude) return

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    })
    const latLng = `${location.address?.latitude},${location.address?.longitude}`
    const label = location.name
    const url = Platform.select({
      ios: `${scheme},${latLng}`,
      android: `${scheme}${latLng}(${label})`
    }) as string

    try {
      const supported = await Linking.canOpenURL(url)

      if (supported) Linking.openURL(url)
    } catch (error) {
      console.log('###', error)
    }
  }

  const openLink = link => {
    WebBrowser.openBrowserAsync(link)
  }

  const onShare = () => {
    trackEvent('share_activity', {
      activity: locationGroup.name,
      city: searchConfig.chosenPrediction?.name
    })
    Share.share({
      message: `NSPIRE | ${premiumLocation?.name || locationGroup.name}`,
      url: `${Constants.dynamicLink}/${locationGroup.id}`
    })
  }

  const imagesUrls = premiumLocation?.imageUrls?.length
    ? premiumLocation.imageUrls
    : locationGroup.images

  const hasContact =
    !!premiumLocation?.contact?.phoneNumber ||
    !!premiumLocation?.contact?.email ||
    !!premiumLocation?.contact?.homepageUrl ||
    !!(
      premiumLocation?.address?.latitude && premiumLocation?.address?.longitude
    )

  const getParsedRating = (rating: number) => {
    let currentRating = rating

    return [...Array(5).keys()].map((_, index) => {
      let star = 'star-border'

      if (currentRating >= 1) star = 'star'
      else if (currentRating >= 0.25 && currentRating < 1) star = 'star-half'

      currentRating -= 1

      return (
        <StarIcon
          key={`star_${index}`}
          name={star}
          color={theme.colors.primary}
          size={18}
        />
      )
    })
  }

  const onAffiliateLinkPressed = (link: string) => {
    trackEvent('open_product_link', {
      activity: locationGroup.name,
      city: searchConfig.chosenPrediction?.name
    })
    WebBrowser.openBrowserAsync(link)
  }

  return (
    <>
      <ImageSection imageUrls={imagesUrls} onShare={onShare} onLike={onLike} />

      <PaddingContainer>
        <>
          <TitleContainer pointerEvents="none">
            <Title numberOfLines={1}>
              {premiumLocation?.name || locationGroup.name}{' '}
            </Title>
            {!!premiumLocation && (
              <OfficialImage source={require('assets/icons/official.png')} />
            )}
          </TitleContainer>
          {!!premiumLocation && (
            <AddressSection address={premiumLocation.address} />
          )}
        </>
      </PaddingContainer>

      {!!premiumLocation && !!hasContact && (
        <ContactContainer>
          {!!premiumLocation.contact?.homepageUrl?.startsWith('http') && (
            <ContactItemMarginContainer>
              <ContactItem
                text={i18n['contact.homepage']}
                icon={require('assets/icons/homepage.png')}
                onPress={() => openLink(premiumLocation?.contact?.homepageUrl)}
              />
            </ContactItemMarginContainer>
          )}

          {!!premiumLocation.contact?.bookingLink && (
            <ContactItemMarginContainer>
              <ContactItem
                text={i18n['contact.booking']}
                icon={require('assets/icons/ticket.png')}
                onPress={() => openLink(premiumLocation?.contact?.bookingLink)}
              />
            </ContactItemMarginContainer>
          )}

          {!!premiumLocation.address.latitude &&
            !!premiumLocation.address.longitude && (
              <ContactItemMarginContainer>
                <ContactItem
                  text={i18n['contact.route']}
                  icon={require('assets/icons/route.png')}
                  onPress={() => openMap(premiumLocation)}
                />
              </ContactItemMarginContainer>
            )}

          {!!premiumLocation.contact?.phoneNumber && (
            <ContactItemMarginContainer>
              <ContactItem
                text={i18n['contact.phone']}
                icon={require('assets/icons/phone.png')}
                onPress={() => {
                  trackEvent('open_phone', {
                    activity: locationGroup.name,
                    city: searchConfig.chosenPrediction?.name
                  })
                  Linking.openURL(
                    `tel:${premiumLocation?.contact?.phoneNumber
                      ?.replace(/ /g, '')
                      .replace(/\//g, '')}`
                  )
                }}
              />
            </ContactItemMarginContainer>
          )}

          {!!premiumLocation.contact?.email && (
            <ContactItemMarginContainer>
              <ContactItem
                text={i18n['contact.email']}
                icon={require('assets/icons/email.png')}
                onPress={() =>
                  Linking.openURL(`mailto:${premiumLocation?.contact?.email}`)
                }
              />
            </ContactItemMarginContainer>
          )}
        </ContactContainer>
      )}

      {!!premiumLocation && !!events?.length && (
        <SpecialEventsSection location={premiumLocation} events={events} />
      )}

      <PaddingContainer>
        {!!(premiumLocation?.description || locationGroup.goodToKnow) && (
          <>
            <SectionTitle>
              {i18n['locationDetails.section.goodToKnow']}
            </SectionTitle>
            <SectionDescription>
              {premiumLocation?.description || locationGroup.goodToKnow}
            </SectionDescription>
          </>
        )}

        {!!premiumLocation?.openingHours && (
          <OpeningHoursSection openingHours={premiumLocation.openingHours} />
        )}

        {!premiumLocation && !!locationGroup.locations?.length && (
          <>
            <SectionTitle>{i18n.providerInYourLocation}</SectionTitle>
            {locationGroup.locations
              .sort((a: Location, b: Location) => {
                return (
                  (a.isPremium === b.isPremium ? 0 : a.isPremium ? -1 : 1) ||
                  (a.address.website === b.address.website
                    ? 0
                    : a.address.website
                    ? -1
                    : 1)
                )
              })
              .map((location: Location, index) => (
                <View key={location.id}>
                  <LocationHeader>
                    <View style={{ flex: 1 }}>
                      <SectionItemTitle numberOfLines={1}>
                        {location.name}
                      </SectionItemTitle>
                      {!!location.rating && (
                        <RatingContainer>
                          <RatingText>
                            {location.rating.toPrecision(2).replace('.', ',')}
                          </RatingText>
                          {getParsedRating(location.rating)}
                        </RatingContainer>
                      )}
                    </View>
                    {!!location.address.website && (
                      <LocationInfoItemContainer
                        onPress={() => openLink(location.address.website)}>
                        <LocationInfoItemIcon
                          source={require('assets/icons/homepage.png')}
                          resizeMode="contain"
                        />
                      </LocationInfoItemContainer>
                    )}
                    <LocationInfoItemContainer
                      onPress={() => openMap(location)}>
                      <LocationInfoItemIcon
                        source={require('assets/icons/route.png')}
                        resizeMode="contain"
                      />
                    </LocationInfoItemContainer>
                  </LocationHeader>

                  {!!location.address.street && (
                    <AddressText>{`${location.address.street} ${location.address.streetNr}`}</AddressText>
                  )}
                  <AddressText>{`${location.address.zipcode} ${location.address.city}`}</AddressText>
                  {index !== locationGroup.locations.length - 1 && <Hr />}
                </View>
              ))}
          </>
        )}

        {!!locationGroup?.affiliateLinks?.length && (
          <>
            <SectionTitle>{i18n.affiliateLinksTitle}</SectionTitle>
            {locationGroup.affiliateLinks?.map((affiliateLink, index) => (
              <Section key={affiliateLink.title}>
                {affiliateLink.type === 'link' && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                    onPress={() => onAffiliateLinkPressed(affiliateLink.data)}>
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
                {index !== locationGroup?.affiliateLinks?.length - 1 && <Hr />}
              </Section>
            ))}
          </>
        )}
      </PaddingContainer>
    </>
  )
}
