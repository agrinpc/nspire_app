import { OpeningHours, OpeningTimes } from '@nspire/interfaces'
import React from 'react'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { SectionDescription } from '../components/SectionDescription'
import { SectionTitle } from '../components/SectionTitle'

const SectionItem = styled.View`
  display: flex;
  flex-direction: row;
`
const Day = styled(SectionDescription)`
  width: 40px;
  padding: 0px;
`
const Time = styled(SectionDescription)`
  padding: 0px;
`

export const OpeningHoursSection = ({
  openingHours
}: {
  openingHours: OpeningHours
}) => {
  const i18n = useI18n()
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } =
    openingHours

  const getPaddedTimePart = (part: number) => {
    return `${part}`.padStart(2, '0')
  }

  const getFormattedTime = (day: OpeningTimes) => {
    if (!day || day.isClosed)
      return i18n['locationDetails.section.openingHours.isClosed']

    const { fromHours, fromMinutes, toHours, toMinutes } = day

    const paddedFromHours = fromHours >= 0 ? getPaddedTimePart(fromHours) : ''
    const paddedFromMinutes =
      fromMinutes >= 0 ? getPaddedTimePart(fromMinutes) : '00'
    const paddedToHours = toHours >= 0 ? getPaddedTimePart(toHours) : ''
    const paddedToMinutes = toMinutes >= 0 ? getPaddedTimePart(toMinutes) : '00'

    let formattedTime = ''

    if (paddedFromHours)
      formattedTime = `${paddedFromHours}.${paddedFromMinutes}`

    if (paddedToHours) {
      if (formattedTime) formattedTime = `${formattedTime} - `
      formattedTime = `${formattedTime}${paddedToHours}.${paddedToMinutes}`
    }

    if (!formattedTime)
      return i18n['locationDetails.section.openingHours.isClosed']

    return formattedTime
  }

  return (
    <>
      <SectionTitle>
        {i18n['locationDetails.section.openingHours']}
      </SectionTitle>
      <SectionItem>
        <Day>{i18n['dayOfWeek.monday.short']}:</Day>
        <Time>{getFormattedTime(monday)}</Time>
      </SectionItem>
      <SectionItem>
        <Day>{i18n['dayOfWeek.tuesday.short']}:</Day>
        <Time>{getFormattedTime(tuesday)}</Time>
      </SectionItem>
      <SectionItem>
        <Day>{i18n['dayOfWeek.wednesday.short']}:</Day>
        <Time>{getFormattedTime(wednesday)}</Time>
      </SectionItem>
      <SectionItem>
        <Day>{i18n['dayOfWeek.thursday.short']}:</Day>
        <Time>{getFormattedTime(thursday)}</Time>
      </SectionItem>
      <SectionItem>
        <Day>{i18n['dayOfWeek.friday.short']}:</Day>
        <Time>{getFormattedTime(friday)}</Time>
      </SectionItem>
      <SectionItem>
        <Day>{i18n['dayOfWeek.saturday.short']}:</Day>
        <Time>{getFormattedTime(saturday)}</Time>
      </SectionItem>
      <SectionItem>
        <Day>{i18n['dayOfWeek.sunday.short']}:</Day>
        <Time>{getFormattedTime(sunday)}</Time>
      </SectionItem>
    </>
  )
}
