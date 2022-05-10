// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext, useMemo } from 'react'
import styled from 'styled-components'
import Button from 'components/Button'
import { themeSpacing } from '@amsterdam/asc-ui'

import type { LatLngTuple, MapOptions } from 'leaflet'

import configuration from 'shared/services/configuration/configuration'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import Map from 'components/Map'
import { useDispatch } from 'react-redux'
import { showMap } from '../../../../../containers/IncidentContainer/actions'

const Wrapper = styled.div`
  position: relative;
  height: ${themeSpacing(40)};
`

const ButtonBar = styled.div`
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 401; // 400 is the minimum elevation where elements are shown above the map
`

const StyledMap = styled(Map)`
  position: absolute;
  width: 100%;
  height: 100%;
`

const Intro = () => {
  const { coordinates } = useContext(AssetSelectContext)
  const center =
    coordinates || (configuration.map.options.center as LatLngTuple)

  const dispatch = useDispatch()

  const mapOptions = useMemo<MapOptions>(
    () => ({
      ...MAP_OPTIONS,
      attributionControl: false,
      center,
      dragging: false,
      keyboard: false,
      doubleClickZoom: false,
    }),
    [center]
  )

  return (
    <Wrapper data-testid="assetSelectIntro">
      <StyledMap
        data-testid="mapLocation"
        mapOptions={mapOptions}
        hasZoomControls={false}
        events={{}}
        setInstance={() => {}}
      />

      <ButtonBar>
        <Button
          data-testid="chooseOnMap"
          onClick={() => dispatch(showMap())}
          variant="primary"
        >
          Kies locatie
        </Button>
      </ButtonBar>
    </Wrapper>
  )
}

export default Intro
