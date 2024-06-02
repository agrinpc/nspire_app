import { FirebaseTimestamp } from '@nspire/interfaces'
import { useEffect, useState } from 'react'
import {
  useDateUtils,
  convertFirebaseTimestampToDate,
  formatDateFullYearWithDots
} from 'util/dateUtils'

export const useSpecialEventDate = (
  dateOrTimestamp: Date | FirebaseTimestamp | undefined
) => {
  const { getShortDay } = useDateUtils()
  const [date, setDate] = useState('')

  useEffect(() => {
    if (dateOrTimestamp) {
      const date = convertFirebaseTimestampToDate(dateOrTimestamp)
      const day = getShortDay(date)
      const formattedDate = formatDateFullYearWithDots(date)
      setDate(`${day}, ${formattedDate}`)
    }
  }, [dateOrTimestamp, getShortDay])

  return date
}
