export const useCircleCoordinates = ({
  latitude,
  longitude,
  radius
}: {
  latitude: number | undefined
  longitude: number | undefined
  radius: number | undefined
}) => {
  if (!latitude || !longitude || !radius) return undefined
  const earthRadius = 6378.1 //Km
  const lat0 = latitude + (-radius / earthRadius) * (180 / Math.PI)
  const lat1 = latitude + (radius / earthRadius) * (180 / Math.PI)
  const lng0 =
    longitude +
    ((-radius / earthRadius) * (180 / Math.PI)) /
      Math.cos((latitude * Math.PI) / 180)
  const lng1 =
    longitude +
    ((radius / earthRadius) * (180 / Math.PI)) /
      Math.cos((latitude * Math.PI) / 180)

  return [
    {
      latitude: lat0,
      longitude: longitude
    }, //bottom
    {
      latitude: latitude,
      longitude: lng0
    }, //left
    {
      latitude: lat1,
      longitude: longitude
    }, //top
    {
      latitude: latitude,
      longitude: lng1
    } //right
  ]
}
