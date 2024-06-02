import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'reducers/store'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import { LocationGroup } from '@nspire/interfaces'
import TitleHeader from 'components/headers/TitleHeader'
import { Card, Size } from 'components'
import { useFavorites, useLocationGroups } from 'hooks'
import { parseLocationGroups } from 'util/utils'
import { Session, setSessions } from 'reducers/favorites/favoritesReducer'
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet'
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types'
import { DetailsContent } from 'pages/common/Details/DetailsContent'
import { trackEvent } from 'analytics'

const snapPoints = ['92%']

const CustomBottomSheetBackdrop = (
  props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
) => <BottomSheetBackdrop {...props} disappearsOnIndex={0} appearsOnIndex={1} />

export const FavoriteDetails = ({ route }) => {
  const { updateScore, updateSession } = useFavorites()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const { getLocationGroupsByIds } = useLocationGroups()

  const bottomSheetRef = useRef<BottomSheet>(null)

  const { sessionIds, title, subtitle } = route.params

  const { sessions } = useSelector((state: RootState) => state.favorites)

  const [selectedLocationGroup, setSelectedLocationGroup] = useState<
    LocationGroup | undefined
  >()

  useEffect(() => {
    const selectedSessions = sessions.filter(s => sessionIds.includes(s.id))
    if (!selectedSessions.length) return

    const session = selectedSessions[0]

    let selectedIds: string[] = []

    selectedSessions.forEach(s => {
      selectedIds = selectedIds.concat(s.locationGroupIds)
    })

    getLocationGroupsByIds({
      locationGroupIds: selectedIds,
      latitude: session.latitude,
      longitude: session.longitude,
      perimeter: session.perimeter
    }).then(({ locationGroups }) => {
      const lgs = parseLocationGroups(locationGroups)
      dispatch(
        setSessions({
          sessions: sessions.map(s => {
            return {
              ...s,
              locationGroups: lgs.filter(lg =>
                s.locationGroupIds.includes(lg.id)
              )
            }
          }) as Session[]
        })
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDislike = async (locationGroup: LocationGroup) => {
    const sessionsToDelete = sessions.filter(s =>
      s.locationGroupIds.includes(locationGroup.id)
    )

    let shouldGoBack = true

    sessions.forEach(s => {
      const hasItem = !!s.locationGroups?.find(lg => lg.id !== locationGroup.id)
      if (hasItem && shouldGoBack) shouldGoBack = false
    })

    updateScore(locationGroup, 'dislike')

    for (let s of sessionsToDelete) {
      updateSession({
        sessionId: s.id as string,
        locationGroup,
        toDelete: true,
        shouldDispatch: false
      })
    }

    dispatch(
      setSessions({
        sessions: [
          ...sessions.map(s => {
            return {
              ...s,
              locationGroups: sessionsToDelete.find(st => st.id === s.id)
                ? s.locationGroups?.filter(lg => lg.id !== locationGroup.id)
                : s.locationGroups,
              locationGroupIds: sessionsToDelete.find(st => st.id === s.id)
                ? s.locationGroupIds?.filter(lg => lg !== locationGroup.id)
                : s.locationGroupIds
            }
          })
        ]
      })
    )

    if (shouldGoBack) navigation.goBack()
  }

  const filteredSessions = sessions.filter(s => sessionIds.includes(s.id))
  const filteredLocationGroups = useMemo(() => {
    const locs: any[] = []
    filteredSessions.forEach(fs => {
      fs.locationGroups?.forEach(lg => {
        const alreadyAdded = locs.find(l => l.id === lg.id)
        if (!alreadyAdded) locs.push(lg)
      })
    })
    return locs
  }, [filteredSessions])

  return (
    <>
      <SafeAreaViewStyle edges={['top', 'bottom']}>
        <ContentContainer>
          <TitleHeader
            title={title}
            subtitle={subtitle}
            onClose={() => navigation.goBack()}
          />
        </ContentContainer>
        <ScrollView>
          {filteredLocationGroups?.map((locationGroup: LocationGroup) => {
            return (
              <Card
                key={locationGroup.id}
                id={locationGroup.id}
                size={Size.Full}
                title={locationGroup.name}
                imageSource={locationGroup.images[0]}
                verified={locationGroup.locations?.[0]?.isVerified}
                liked
                onPress={() => {
                  trackEvent('open_favorite', { activity: locationGroup.name })
                  setSelectedLocationGroup(locationGroup)
                  setTimeout(() => bottomSheetRef.current?.expand(), 0)
                }}
                onLikePress={() => {
                  trackEvent('remove_favorite', {
                    activity: locationGroup.name
                  })
                  handleDislike(locationGroup)
                }}
              />
            )
          })}
        </ScrollView>
      </SafeAreaViewStyle>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={CustomBottomSheetBackdrop}
        onClose={() => {
          bottomSheetRef.current?.close()
          setSelectedLocationGroup(undefined)
        }}
        enablePanDownToClose>
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {!!selectedLocationGroup && (
            <DetailsContent locationGroup={selectedLocationGroup} />
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </>
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
