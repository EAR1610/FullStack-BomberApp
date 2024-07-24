import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://localhost:3333/user",
  withCredentials: true,
});

const apiRequestAuth = axios.create({
  baseURL: "http://localhost:3333/users",
  withCredentials: true,
});

export {
  apiRequest,
  apiRequestAuth
};