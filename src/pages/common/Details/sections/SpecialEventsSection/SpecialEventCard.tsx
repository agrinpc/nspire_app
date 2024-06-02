import React from 'react'
import { Event } from '@nspire/interfaces'
import { Card, Size } from 'components/card'
import { useSpecialEventDate } from '../../utils/useSpecialEventDate'
import { useNavigation } from '@react-navigation/native'
import type { NavigationProp } from '@react-navigation/native'
import {
  DetailsScreenParams,
  EventDetailsScreenParams
} from 'navigation/HomeTabNavigation/common/screenParams'

export const SpecialEventCard = ({
  location,
  event
}: {
  location: Location
  event: Event
}) => {
  const navigation =
    useNavigation<
      NavigationProp<DetailsScreenParams & EventDetailsScreenParams>
    >()
  const specialEventDate = useSpecialEventDate(event.startDate)

  return (
    <Card
      id={event.id}
      size={Size.Small}
      title={event.name}
      description={specialEventDate}
      isSpecial={event.eventType === 'special'}
      imageSource={event.imageUrls}
      onPress={() => navigation.navigate('EventDetails', { location, event })}
    />
  )
}
