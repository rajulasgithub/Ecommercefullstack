// Helper functions matching backend express-validator rules

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
};

export const isMinLength = (value, min) => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= min;
};

export const isNumeric = (value) => {
  if (value === null || value === undefined || value === '') return false;
  const numStr = String(value).trim();
  return numStr !== '' && !isNaN(Number(numStr)) && isFinite(Number(numStr));
};
