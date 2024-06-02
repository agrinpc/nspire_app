import { CachedImage } from 'components/CachedImage'
import React from 'react'
import { Card as PaperCard, useTheme, Text } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { selectProfile } from 'reducers/selectors/profileSelector'
import styled from 'styled-components/native'
import { useI18n } from 'translations'
import { getAge } from 'util/dateUtils'

const Card = styled(PaperCard)`
  background-color: ${({ theme }) => theme.colors.background};
  height: 180px;
`

const CardContent = styled(Card.Content)`
  height: 100%;
  flex-direction: row;
`

const TextContainer = styled.View`
  padding: 5px 20px;
`
const Title = styled(Text)`
  font-size: ${({ theme }) => theme.constants.fontSize.size200}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`
const Subtitle = styled(Text)`
  font-size: ${({ theme }) => theme.constants.fontSize.size100}px;
  color: ${({ theme }) => theme.colors.surfaceSecondary};
  margin-top: 3px;
`

const ProfileCard = () => {
  const theme = useTheme()
  const i18n = useI18n()
  const profile = useSelector(selectProfile)
  const { firstname, lastname, birthdate, imageUrl } = profile
  const age = birthdate && getAge(birthdate)
  const hasAge = !!age

  return (
    <Card style={{ elevation: theme.elevation }}>
      <CardContent>
        <CachedImage
          cacheKey="profileImage"
          imageUrl={imageUrl}
          imageHeight={'100%'}
          imageWidth={130}
          borderRadius={theme.roundness}
          backgroundColor={theme.colors.surface}
        />
        <TextContainer>
          {firstname && lastname && (
            <Title>{i18n['profile.formattedName'](firstname, lastname)}</Title>
          )}
          {hasAge && <Subtitle>{i18n['profile.formattedAge'](age)}</Subtitle>}
        </TextContainer>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
