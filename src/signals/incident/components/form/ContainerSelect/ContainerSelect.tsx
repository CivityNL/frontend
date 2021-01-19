import type { FunctionComponent } from 'react';
import React, { useCallback, useState } from 'react';
import { ContainerSelectProvider } from './ContainerSelectContext';
import Intro from './Intro';
import Selector from './Selector';
import Summary from './Summary';
import type { ClickEventHandler, Item, Meta } from './types';
import type { Incident } from 'types/incident';
import type { LatLngExpression } from 'leaflet';

export interface ContainerSelectProps {
  handler: () => { value: Item[] };
  meta: Meta;
  parent: {
    meta: {
      incidentContainer: { incident: Pick<Incident, 'location'> };
      updateIncident: (data: { extra_container: Item[] }) => void;
    };
  };
}

const ContainerSelect: FunctionComponent<ContainerSelectProps> = ({ handler, meta, parent }) => {
  const value = handler().value;
  const [showMap, setShowMap] = useState(false);

  const { coordinates } = parent.meta?.incidentContainer?.incident?.location.geometrie;
  const location: LatLngExpression = [coordinates[1], coordinates[0]];

  const update = useCallback(
    (selectedValue: Item[]) => {
      parent.meta.updateIncident({ extra_container: selectedValue });
    },
    [parent]
  );

  const edit = useCallback<ClickEventHandler>(
    event => {
      event.preventDefault();
      setShowMap(true);
    },
    [setShowMap]
  );

  const close = useCallback<ClickEventHandler>(
    event => {
      event.preventDefault();
      setShowMap(false);
    },
    [setShowMap]
  );

  return (
    <ContainerSelectProvider value={{ selection: value, location, meta, update, edit, close }}>
      {!showMap && !value && <Intro />}

      {showMap && <Selector />}

      {!showMap && value && <Summary />}
    </ContainerSelectProvider>
  );
};

export default ContainerSelect;
