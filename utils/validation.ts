const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const validateEmail = (email: string): boolean => {
  return regex.test(email);
};
