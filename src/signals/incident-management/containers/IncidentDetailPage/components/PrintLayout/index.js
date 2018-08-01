import React from 'react';
import PropTypes from 'prop-types';

import Img from 'shared/components/Img';

import './style.scss';
import MapDetail from '../MapDetail';
import IncidentDetail from '../IncidentDetail';

class PrintLayout extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onPrint = this.onPrint.bind(this);
  }

  onPrint() {
    window.print();
  }

  render() {
    const { incident, stadsdeelList, onPrintView } = this.props;
    return (
      <div className="print-layout row container" >
        <div className="col-12">
          <h3>Melding {this.props.id}</h3>
          <div className="no-print">
            <button className="no-print" onClick={this.onPrint}>Print</button>
            <button className="no-print" onClick={onPrintView}>Terug</button>
          </div>
        </div>
        <div className="col-12 incident-print-page__map">
          {(incident) ? <MapDetail label="" value={incident.location} /> : ''}
        </div>
        <div className="col-12">
          {(incident) ? <IncidentDetail incident={incident} stadsdeelList={stadsdeelList} /> : ''}
        </div>
        <div className="col-12">
          {incident.image ?
            <Img src={incident.image} alt={''} className="incident-detail-page__image--max-width" />
            : ''
          }
        </div>
      </div>
    );
  }
}

PrintLayout.propTypes = {
  id: PropTypes.string.isRequired,
  incident: PropTypes.object.isRequired,
  stadsdeelList: PropTypes.array.isRequired,
  onPrintView: PropTypes.func.isRequired,
};

export default PrintLayout;
