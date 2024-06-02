import React, { Dispatch, SetStateAction } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { TouchableOpacity } from 'react-native'
import { CachedImage } from 'components/CachedImage'

const TouchableContainer = styled(TouchableOpacity)`
  margin: 20px 0px;
  width: 130px;
  justify-content: center;
  border-radius: ${({ theme }) => theme.roundness}px;
`

const ImageSelection = ({
  imageUrl,
  setImageUrl
}: {
  imageUrl: string | undefined
  setImageUrl: Dispatch<SetStateAction<string | undefined>>
}) => {
  const theme = useTheme()

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.cancelled) {
      setImageUrl(result.uri)
    }
  }

  return (
    <TouchableContainer onPress={pickImage}>
      <CachedImage
        cacheKey="profileImage"
        imageUrl={imageUrl}
        imageHeight={150}
        imageWidth={130}
        borderRadius={theme.roundness}
        backgroundColor={theme.colors.surface}
      />
    </TouchableContainer>
  )
}

export default ImageSelection
