import React from 'react';
import { capitalize } from '../../utils/format';

const StatusBadge = ({ status }) => {
  return <span className={`badge badge-${status}`}>{capitalize(status)}</span>;
};

export default StatusBadge;
