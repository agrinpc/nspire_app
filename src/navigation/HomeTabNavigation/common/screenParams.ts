import { Event, LocationGroup } from '@nspire/interfaces'

export type DetailsScreenParams = {
  Details: {
    locationGroup?: LocationGroup
    locationGroupID?: string
    goBackTo?: {
      tabName: string
      screenName: string
      popScreen?: boolean
      params?: any
    }
  }
}

export type EventDetailsScreenParams = {
  EventDetails: {
    event: Event
    location: Location
  }
}
