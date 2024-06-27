export const getTokenFromLocalStorage = () => {
  const token = localStorage.getItem("token");
  return token;
};

export const addTokenToLocalStorage = (token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

export const removeTokenFromLocalStorage = () => {
  localStorage.removeItem("token");
};
