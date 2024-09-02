import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://82.197.65.247:3333/user",
  withCredentials: true,
});

const apiRequestAuth = axios.create({
  baseURL: "http://82.197.65.247:3333/users",
  withCredentials: true,
});

export {
  apiRequest,
  apiRequestAuth
};