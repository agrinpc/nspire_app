import { HorizontalCardScrollView } from 'components/card/HorizontalCardScrollView'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { Event, Location } from '@nspire/interfaces'
import { SpecialEventCard } from './SpecialEventCard'

const SectionTitle = styled.Text`
  color: #000;
  font-size: 18px;
  font-weight: bold;
  padding: 30px 0px 8px;
`

const SpecialEventTitle = styled(SectionTitle)`
  padding: 30px 24px 16px;
`

export const SpecialEventsSection = ({
  location,
  events
}: {
  location: Location
  events: Event[]
}) => {
  const i18n = useI18n()

  if (!events) return null

  return (
    <View>
      <SpecialEventTitle>
        {i18n['locationDetails.section.specialEvents']}
      </SpecialEventTitle>

      <HorizontalCardScrollView horizontalPadding={16}>
        {events.map(event => (
          <SpecialEventCard key={event.id} location={location} event={event} />
        ))}
      </HorizontalCardScrollView>
    </View>
  )
}
