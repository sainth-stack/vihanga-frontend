// api call for any kind of methods.
export const api = (url, method = "GET", headers = {}, body = {}) => {
  return new Promise((resolve, reject) => {
    if (method === "POST" || method === "PUT") {
      fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      fetch(url, {
        method,
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export const isTalentSpotify = () => {

  if (typeof window === 'undefined') {
    return false;
  }

  const url = window.location.origin;
  return !url.includes("vihanga");
}