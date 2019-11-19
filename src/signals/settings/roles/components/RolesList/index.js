import React from 'react';
import PropTypes from 'prop-types';
import styled from '@datapunt/asc-core';
import { useHistory } from 'react-router-dom';

import ListComponent from 'components/List';

import PageHeader from 'signals/settings/components/PageHeader';
import formatRoles from '../../services/formatRoles';

const StyledListComponent = styled(ListComponent)`
  tr:nth-child(1),
  td:nth-child(1) {
    width: 20%;
  }
`;

export const RolesList = ({
  list,
}) => {
  const history = useHistory();

  const onItemClick = e => {
    const roleId = e.currentTarget.getAttribute('data-item-id');
    /* istanbul ignore else */
    if (roleId > -1) {
      history.push(`rollen/${roleId}`);
    }
  };

  return (
    <div>
      <div>
        <PageHeader title="Rollen" />

        <StyledListComponent
          items={formatRoles(list)}
          invisibleColumns={['id']}
          primaryKeyColumn="id"
          onItemClick={onItemClick}
        />
      </div>
    </div >
  )
};

RolesList.defaultProps = {
  list: [],
};

RolesList.propTypes = {
  list: PropTypes.array,
};

export default RolesList;
