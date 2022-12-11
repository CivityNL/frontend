import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import MapDetail from 'components/MapDetail'
import { smallMarkerIcon } from 'shared/services/configuration/map-markers'
import type { Address as AddressType } from 'types/address'

import Address from '../Address'

export const MapThumbnailButton = styled.div.attrs({
  role: 'button',
  tabIndex: 0,
})`
  width: max-content;
  margin-right: ${themeSpacing(2)};
  margin-bottom: ${themeSpacing(4)};
`

export const MapThumbnail = styled(MapDetail).attrs({
  canFocusMarker: false,
  hasZoomControls: false,
  icon: smallMarkerIcon,
  zoom: 9,
})`
  width: 80px;
  height: 80px;
  :hover {
    cursor: pointer;
    outline: 1px solid ${themeColor('tint', 'level6')};
  }
`

export const LocationSection = styled.section`
  display: flex;
`

type LocationProps = {
  onClick: () => void
  location: {
    address: AddressType
    address_text?: string | null
    geometrie: {
      coordinates: [number, number]
      type: 'Point'
    }
  }
}

const Location = ({ onClick, location }: LocationProps) => {
  const handleMapThumbnailKey: React.KeyboardEventHandler<HTMLElement> = (
    event
  ) => {
    if (event.key === 'Enter') {
      onClick()
    }
  }

  return (
    <LocationSection>
      <MapThumbnailButton onKeyDown={handleMapThumbnailKey} onClick={onClick}>
        <MapThumbnail value={{ geometrie: location.geometrie }} />
      </MapThumbnailButton>
      <Address address={location.address_text ? location.address : null} />
    </LocationSection>
  )
}

export default Location
