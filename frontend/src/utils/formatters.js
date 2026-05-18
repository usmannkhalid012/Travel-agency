export const formatCurrency = (value) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value || 0);
export const formatDate = (value) => new Date(value).toLocaleDateString();
export const routeLabel = (bus) => `${bus.departureCity} → ${bus.arrivalCity}`;