export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '₹0.00';
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '—';
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateTimeString;
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'PAID':
    case 'SUCCESS':
      return 'badge-paid';
    case 'PARTIALLY_PAID':
      return 'badge-partially-paid';
    case 'OVERDUE':
    case 'FAILED':
      return 'badge-overdue';
    case 'PENDING':
    default:
      return 'badge-pending';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'PAID':
      return 'Paid in Full';
    case 'PARTIALLY_PAID':
      return 'Partially Paid';
    case 'OVERDUE':
      return 'Payment Overdue';
    case 'PENDING':
      return 'Due / Pending';
    case 'SUCCESS':
      return 'Success';
    case 'FAILED':
      return 'Failed';
    default:
      return status;
  }
};
