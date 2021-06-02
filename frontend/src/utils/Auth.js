export const isAuthenticated = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  return true;
};

export const getToken = () => {
  const token = localStorage.getItem('token');

  return token;
};
