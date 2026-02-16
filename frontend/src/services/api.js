import axios from "axios";

// Base URL of your backend API
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // replace if your backend URL is different
});

// Optional: Add a function to set JWT token for authenticated requests
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
