/* eslint-disable react-native/no-inline-styles */
import { MaterialIcons } from '@expo/vector-icons'
import { Address } from '@nspire/interfaces'
import React from 'react'
import styled from 'styled-components/native'
import { SectionDescription } from '../components/SectionDescription'

const SectionContent = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Icon = styled(MaterialIcons)`
  font-size: 20px;
  margin-right: 6px;
`

export const AddressSection = ({ address }: { address: Address }) => {
  const { street, streetNr, zipcode, city } = address || {}
  const formattedAddress = `${street} ${streetNr}, ${zipcode} ${city} `

  return (
    <>
      <SectionContent>
        <Icon name={'location-on'} />
        <SectionDescription style={{ textDecorationLine: 'underline' }}>
          {formattedAddress}
        </SectionDescription>
      </SectionContent>
    </>
  )
}
