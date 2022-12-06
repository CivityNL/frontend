// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { Heading, Row, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import MapDetail from 'components/MapDetail'
import {
  smallMarkerIcon,
  markerIcon,
} from 'shared/services/configuration/map-markers'

export const Wrapper = styled.div`
  flex-direction: column;
  width: 100%;
`

export const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(10)};
  margin-bottom: ${themeSpacing(5)};
`

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

export const MapThumbnailSection = styled.section`
  display: flex;
`

export const MapRow = styled(Row)`
  position: relative;
`

export const Map = styled(MapDetail).attrs({
  canFocusMarker: false,
  hasZoomControls: true,
  icon: markerIcon,
  zoom: 10,
})`
  width: 100%;
  height: 500px;
  margin-top: ${themeSpacing(5)};
  z-index: 1;
`

export const QuestionnaireRow = styled(Row)<{
  hidden?: boolean
}>`
  ${({ hidden }) => hidden && 'display: none;'}
`
