import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:3333/user",
  withCredentials: true,
});

export default apiRequest;