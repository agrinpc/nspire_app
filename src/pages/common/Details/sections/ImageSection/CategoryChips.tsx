/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { Chip } from 'components/chip'
import { useI18n } from 'translations'

const getIcon = (category: string) => {
  if (category === 'party') return require('assets/icons/party.png')
  if (category === 'foodAndDrink')
    return require('assets/icons/foodAndDrink.png')
  if (category === 'event') return require('assets/icons/event.png')
  if (category === 'park') return require('assets/icons/park.png')
  if (category === 'game') return require('assets/icons/game.png')
  if (category === 'sport') return require('assets/icons/sport.png')
  if (category === 'travel') return require('assets/icons/travel.png')
  if (category === 'beauty') return require('assets/icons/beauty.png')
  if (category === 'culture') return require('assets/icons/culture.png')
  if (category === 'karma') return require('assets/icons/karma.png')
  if (category === 'sport') return require('assets/icons/sport.png')
}

const StyledChip = styled(Chip)`
  margin-right: 8px;
`

export const CategoryChips = ({
  categories
}: {
  categories: string[] | undefined
}) => {
  const i18n = useI18n()

  const getTitle = (category: string) => {
    if (category === 'party') return i18n['categories.party']
    if (category === 'foodAndDrink') return i18n['categories.foodAndDrink']
    if (category === 'event') return i18n['categories.event']
    if (category === 'park') return i18n['categories.park']
    if (category === 'game') return i18n['categories.game']
    if (category === 'sport') return i18n['categories.sport']
    if (category === 'travel') return i18n['categories.travel']
    if (category === 'beauty') return i18n['categories.beauty']
    if (category === 'culture') return i18n['categories.culture']
    if (category === 'karma') return i18n['categories.karma']
    if (category === 'sport') return i18n['categories.sport']
  }

  return (
    <ScrollView
      style={{ flexGrow: 0 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate={0}
      bounces={false}
      snapToAlignment={'center'}
      contentContainerStyle={{
        paddingVertical: 25,
        paddingHorizontal: 24,
        alignItems: 'flex-start'
      }}>
      {categories?.map((category: string) => (
        <StyledChip
          key={category}
          title={getTitle(category)}
          icon={getIcon(category)}
        />
      ))}
    </ScrollView>
  )
}
