import React from 'react';
import { getStatusBadgeClass, getStatusLabel } from '../../utils/formatters';

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const badgeClass = getStatusBadgeClass(status);
  const label = getStatusLabel(status);

  return (
    <span className={`badge ${badgeClass}`}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
      {label}
    </span>
  );
};

export default StatusBadge;
