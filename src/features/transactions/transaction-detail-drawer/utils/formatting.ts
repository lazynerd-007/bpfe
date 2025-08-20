export const formatCurrency = (amount: number, currency = 'GHS') => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString();
};