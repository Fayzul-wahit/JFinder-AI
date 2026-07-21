export const formatDate = (date) => new Date(date).toLocaleDateString();

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

export const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(salary);
};

export const getScoreColor = (score) => {
  if (score >= 70) return '#10B981'; // success
  if (score >= 40) return '#F59E0B'; // warning
  return '#EF4444'; // danger
};
