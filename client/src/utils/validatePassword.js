export function validatePassword(password) {
  const isLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return isLength && hasLetter && hasNumber;
};