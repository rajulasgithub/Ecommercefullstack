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

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string' || password.trim() === '') {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
};

export const validateName = (name, label) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return `${label} is required`;
  }
  if (name.trim().length < 2) {
    return `${label} must be at least 2 characters long`;
  }
  if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    return `${label} should only contain letters`;
  }
  return null;
};

export const validatePhone = (phone, label = "Phone number") => {
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    return `${label} is required`;
  }
  if (!/^[0-9]+$/.test(phone.trim())) {
    return `${label} must contain only digits`;
  }
  return null;
};

export const GENDERS = ["Male", "Female", "Other"];

export const validateGender = (gender) => {
  if (!gender || typeof gender !== 'string' || gender.trim() === '') {
    return "Gender is required";
  }
  if (!GENDERS.includes(gender.trim())) {
    return "Please select a valid gender option";
  }
  return null;
};
