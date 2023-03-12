export const MWA_AUTH_TOKEN_KEY = "glueMWAAuthToken";

export const setItemToLocalStorage = (key: string, value: any) => {
  try {
    if (!localStorage) return;

    localStorage.setItem(key, value);
  } catch (e) {
    return;
  }
};

export const getItemFromLocalStorage = (key: string) => {
  try {
    if (!localStorage) return;

    return localStorage.getItem(key);
  } catch (e) {
    return;
  }
};

export const removeItemFromLocalStorage = (key: string) => {
  try {
    if (!localStorage) return;
    if (!localStorage.getItem(key)) return;

    localStorage.removeItem(key);
  } catch (e) {
    return;
  }
};
