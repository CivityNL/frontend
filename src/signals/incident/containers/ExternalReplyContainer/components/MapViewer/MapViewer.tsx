import type { FunctionComponent } from 'react'

import { Marker } from '@amsterdam/react-maps'
import styled from 'styled-components'

import Map from 'components/Map'
import { markerIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

type MapViewerProps = {
  coordinates: {
    lat: number
    lng: number
  }
  className?: string
}

const StyledMap = styled(Map)`
  width: 100%;
  height: 500px;
`

const MapViewer: FunctionComponent<MapViewerProps> = ({
  coordinates: { lat, lng },
  className,
}) => (
  <StyledMap
    mapOptions={{
      ...MAP_OPTIONS,
      center: [lat, lng],
    }}
    className={className}
    hasZoomControls
  >
    <Marker args={[{ lat, lng }]} options={{ icon: markerIcon }} />
  </StyledMap>
)

export default MapViewer
