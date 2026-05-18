export const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
export const validatePassword = (value) => value.length >= 8;

export const loginValidation = ({ email, password }) => {
  const errors = {};
  if (!validateEmail(email)) errors.email = 'Enter a valid email address';
  if (!validatePassword(password)) errors.password = 'Password must be at least 8 characters';
  return errors;
};