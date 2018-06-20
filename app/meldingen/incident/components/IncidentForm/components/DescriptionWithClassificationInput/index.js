import React from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../ErrorMessage/';

const DescriptionWithClassificationInput = ({ handler, touched, hasError, meta, parent }) => (
  <div className="rij mode_input rij_verplicht">
    <div className="label">
      <label htmlFor="textarea">Textarea</label>
    </div>

    <div>{meta.label}</div>
    <div>{meta.subtitle}</div>
    <div className="invoer">
      <textarea
        placeholder={meta.placeholder}
        id={meta.id}
        onKeyUp={(e) => parent.meta.getClassification(e.target.value)}
        {...handler()}
      />
    </div>

    <ErrorMessage
      touched={touched}
      hasError={hasError}
    />
  </div>
);

DescriptionWithClassificationInput.propTypes = {
  handler: PropTypes.func.isRequired,
  touched: PropTypes.bool.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired
};

export default DescriptionWithClassificationInput;
