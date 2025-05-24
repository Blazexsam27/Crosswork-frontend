// localStorage getters according to given key
export function getFromLocalStorage(key: string) {
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  return null;
}

// sessionStorage getter according to given key
export function getFromSessionStorage(key: string) {
  const data = sessionStorage.getItem(key);
  if (data) return JSON.parse(data);
  return null;
}

// localStorage setter according to given key
export function setInLocalStorage(key: string, value: any, expiry: number = 0) {
  let data = value;
  if (expiry > 0) {
    data = { ...data, expiry };
  }
  const stringifyValue = JSON.stringify(data);
  localStorage.setItem(key, stringifyValue);
}

// sessionStorage setter according to given key
export function setInSessionStorage(
  key: string,
  value: any,
  expiry: number = 0
) {
  let data = value;
  if (expiry > 0) data = { ...data, expiry };
  const stringifyValue = JSON.stringify(data);
  sessionStorage.setItem(key, stringifyValue);
}

// check if the data is expired or not in local storage
export function isExpiredInLocalStorage(key: string): boolean {
  const data = getFromLocalStorage(key);
  console.log("data", data);
  // return true if data doesn't exist
  if (!data) return true;

  if (data.expiry) return Date.now() > data.expiry;
  return false;
}

// check if the data is expired or not in session storage
export function isExpiredInSessionStorage(key: string): boolean {
  const data = getFromSessionStorage(key);

  // return true if data doesn't exist
  if (!data) return true;

  if (data.expiry) return Date.now() > data.expiry;
  return false;
}
