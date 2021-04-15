// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import ContainerListPreview from './ContainerListPreview'
import DateTime from './DateTime'
import Image from './Image'
import Map from './Map'
import MapSelectPreview from './MapSelect'

import components from '.'
import ListObjectValue from './ListObjectValue'

describe('Preview components', () => {
  it('should load all components', () => {
    expect(components).toEqual({
      ContainerListPreview,
      DateTime,
      ListObjectValue,
      Image,
      Map,
      MapSelectPreview,
    })
  })
})
