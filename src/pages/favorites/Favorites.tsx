import React, { useEffect, useMemo } from 'react'
import { ListRenderItemInfo } from 'react-native'
import { RootState } from 'reducers/store'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { useI18n } from 'translations'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SwipeListView } from 'react-native-swipe-list-view'
import styled from 'styled-components/native'
import { Card as UnstyledPaperCard } from 'react-native-paper'
import TitleHeader from 'components/headers/TitleHeader'
import { useFavorites } from 'hooks'
import { Session, setSessions } from 'reducers/favorites/favoritesReducer'

const nspireLogo = require('assets/logos/nspire-outline.png')

const EmptyFavorites = () => {
  const i18n = useI18n()
  return (
    <EmptyFavoritesContainer>
      <NspireLogo source={nspireLogo} resizeMode="contain" />
      <NoFavoritesText>{i18n['favorites.noFavorites1']}</NoFavoritesText>
      <NoFavoritesText>{i18n['favorites.noFavorites2']}</NoFavoritesText>
    </EmptyFavoritesContainer>
  )
}

interface RowMapProps {
  closeRow: () => void
}

interface CardProps {
  key: number
}

export const Favorites = () => {
  const i18n = useI18n()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const { getSessions, deleteSession } = useFavorites()

  const { sessions = [] } = useSelector((state: RootState) => state.favorites)

  useEffect(() => {
    getSessions().then(sessions => dispatch(setSessions({ sessions })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const parsedSessions = useMemo(() => {
    let groupedSessions: Session[] = []

    sessions
      .filter(session => session.locationGroupIds.length)
      .forEach((session, index) => {
        let alreadyAdded = groupedSessions.find(
          groupedSession =>
            groupedSession.activityName === session.activityName &&
            groupedSession.city === session.city &&
            groupedSession.date === session.date
        )

        if (!alreadyAdded)
          groupedSessions.push({
            key: index,
            ids: [session.id],
            ...session
          } as any)
        else {
          groupedSessions = groupedSessions.map(gs => {
            if (
              gs.activityName === session.activityName &&
              gs.city === session.city &&
              gs.date === session.date
            ) {
              const filterGroupIds: string[] = []
              const filterGroupIdsTmp = gs.locationGroupIds.concat(
                session.locationGroupIds
              )
              filterGroupIdsTmp.forEach(id => {
                if (!filterGroupIds.includes(id)) filterGroupIds.push(id)
              })

              return {
                ...gs,
                ids: (gs as any).ids.concat([session.id]),
                locationGroupIds: filterGroupIds
              }
            }
            return gs
          })
        }
      })

    return groupedSessions
  }, [sessions])

  const removeSession = (rowKey: number, rowMap: RowMapProps[]) => {
    if (!rowMap[rowKey]) return
    rowMap[rowKey].closeRow()

    for (let id of parsedSessions[rowKey].ids) {
      deleteSession(id as string, false)
    }

    dispatch(
      setSessions({
        sessions: [
          ...sessions.filter(s => !parsedSessions[rowKey].ids.includes(s.id))
        ]
      })
    )
  }

  const renderItem = (
    data: ListRenderItemInfo<CardProps & Session & { ids: string[] }>
  ) => {
    const { ids, city, activityName, date, locationGroupIds, imagePath } =
      data.item

    return (
      <Card>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('FavoriteDetails', {
              title: activityName || city,
              subtitle: date,
              sessionIds: ids
            })
          }>
          <CardImage source={{ uri: imagePath }} />
          <TextContainer>
            <CardTitleText>{activityName || city}</CardTitleText>
            {!!date && <FavoritesCountText>{date}</FavoritesCountText>}
            <FavoritesCountText>
              {locationGroupIds.length}{' '}
              {locationGroupIds.length === 1
                ? i18n['favorites.items.one']
                : i18n['favorites.items.other']}
            </FavoritesCountText>
          </TextContainer>
        </TouchableOpacity>
      </Card>
    )
  }

  const renderHiddenItem = (
    data: ListRenderItemInfo<CardProps>,
    rowMap: RowMapProps[]
  ) => {
    return (
      <HiddenItem>
        <DeleteButton
          activeOpacity={0.7}
          onPress={() => removeSession(data.item.key, rowMap)}>
          <DeleteButtonText>
            {i18n['favorites.deleteButton.title']}
          </DeleteButtonText>
        </DeleteButton>
      </HiddenItem>
    )
  }

  return (
    <SafeAreaViewStyle edges={['top', 'bottom']}>
      <ContentContainer>
        <TitleHeader title={i18n['favorites.header.title']} />
      </ContentContainer>

      {parsedSessions.length ? (
        <SwipeListView
          data={parsedSessions}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          showsVerticalScrollIndicator={false}
          disableRightSwipe
        />
      ) : (
        <EmptyFavorites />
      )}
    </SafeAreaViewStyle>
  )
}

const SafeAreaViewStyle = styled(SafeAreaView)`
  flex: 1;
`

const ContentContainer = styled.View`
  align-self: center;
  width: ${({ theme }) => theme.constants.width.screenContainer};
`

const EmptyFavoritesContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`

const NoFavoritesText = styled.Text`
  align-self: center;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  text-align: center;
`

const NspireLogo = styled.Image`
  width: 100px;
  height: 140px;
`

const Card = styled(UnstyledPaperCard)`
  height: 112px;
  margin: 10px;
  elevation: 4;
`

const HiddenItem = styled.View`
  background-color: #eb6a4f;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: 112px;
  margin: 10px 10px 10px 12px;
  border-radius: 13px;
`

const DeleteButton = styled.TouchableOpacity`
  width: 75px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const DeleteButtonText = styled.Text`
  font-size: 10px;
  color: #fff;
  font-weight: 800;
`

const TouchableOpacity = styled.TouchableOpacity`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const CardImage = styled.Image`
  height: 112px;
  width: 92px;
  border-radius: 10px;
`

const TextContainer = styled.View`
  display: flex;
  justify-content: center;
  margin-left: 20px;
`

const CardTitleText = styled.Text`
  font-size: 15px;
  line-height: 18px;
  font-weight: 600;
`

const FavoritesCountText = styled.Text`
  margin-top: 4px;
  font-size: 14px;
  color: #9d9d9d;
  font-weight: 300;
`
