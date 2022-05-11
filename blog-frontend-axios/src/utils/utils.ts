export const APP_NAME = 'blog-marc';
export const ALT_IMAGE_URL =
  'https://static.productionready.io/images/smiley-cyrus.jpg';

export function getLocalStorageValue(key: string) {
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const toLocalDateString = (date: Date) => {
  let localDate: string;

  if (date) {
    if (date instanceof Date) {
      localDate = date.toLocaleDateString();
    } else {
      localDate = new Date(date).toLocaleDateString();
    }
    return localDate;
  }
}

