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

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || typeof confirmPassword !== 'string' || confirmPassword.trim() === '') {
    return "Confirm password is required";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

export const validateName = (name, label, minLength = 2) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return `${label} is required`;
  }
  if (minLength > 1 && name.trim().length < minLength) {
    return `${label} must be at least ${minLength} characters long`;
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
  if (phone.trim().length !== 10) {
    return `${label} must be exactly 10 digits`;
  }
  return null;
};

export const GENDERS = ["Male", "Female", "Other"];

export const MATERIALS = [
  "Cotton",
  "Silk",
  "Georgette",
  "Polyester",
  "Wool",
  "Linen",
  "Denim",
  "Velvet",
  "Chiffon",
  "Satin",
  "Rayon",
  "Blend",
  "Other"
];

export const STYLES = [
  "Casual Wear",
  "Party Wear",
  "Ethnic Wear",
  "Formal Wear",
  "Wedding Wear",
  "Sportswear"
];

export const validateGender = (gender) => {
  if (!gender || typeof gender !== 'string' || gender.trim() === '') {
    return "Gender is required";
  }
  if (!GENDERS.includes(gender.trim())) {
    return "Please select a valid gender option";
  }
  return null;
};

export const validateRegNumber = (regNumber) => {
  if (!regNumber || typeof regNumber !== 'string' || regNumber.trim() === '') {
    return "Registration number is required";
  }
  return null;
};

export const validateGstNumber = (gstNumber) => {
  if (!gstNumber || typeof gstNumber !== 'string' || gstNumber.trim() === '') {
    return "GST number is required";
  }
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/i;
  if (!gstRegex.test(gstNumber.trim())) {
    return "Please enter a valid 15-digit GSTIN (e.g. 22AAAAA0000A1Z5)";
  }
  return null;
};

export const validateBio = (bio, maxLength = 500) => {
  if (bio && typeof bio === 'string' && bio.trim().length > maxLength) {
    return `Bio cannot exceed ${maxLength} characters`;
  }
  return null;
};

export const validateCompanyName = (name, minLength = 2, maxLength = 100) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return "Company name is required";
  }
  if (name.trim().length < minLength) {
    return `Company name must be at least ${minLength} characters long`;
  }
  if (name.trim().length > maxLength) {
    return `Company name cannot exceed ${maxLength} characters`;
  }
  return null;
};

export const validatePincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string' || pincode.trim() === '') {
    return "Pincode is required";
  }
  if (!/^[0-9]{6}$/.test(pincode.trim())) {
    return "Pincode must be exactly 6 digits";
  }
  return null;
};
