import axios from "axios";

const api = axios.create({
  baseURL: "https://chatai-123g.onrender.com",
  withCredentials: true
});

export default api;
