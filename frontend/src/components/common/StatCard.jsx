import React from 'react';

export const StatCard = ({ label, value, subtext, icon: Icon, variant = 'primary' }) => {
  const iconVariantClass = `stat-icon-${variant}`;

  return (
    <div className="stat-card">
      {Icon && (
        <div className={`stat-icon-wrapper ${iconVariantClass}`}>
          <Icon size={24} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {subtext && <div className="stat-sub">{subtext}</div>}
      </div>
    </div>
  );
};

export default StatCard;
