const BASE_URL = "http://localhost:3030/";

export const PATCH_CONFIG = body => {
  return {
    method: "PATCH", body: JSON.stringify(body),  headers: {"Content-type": "application/json"}
  }
}
export const api = {
  cities: {
    filter: search => BASE_URL + `cities/?filter=${search}&limit=10`,
    id: searchId => BASE_URL + `cities/${searchId}`
  },
  preferences: {
    cities: BASE_URL + "preferences/cities",
  }
}
