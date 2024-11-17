import axios from "axios";
const localDevelopment = `http://localhost:3333`;
const remoteDevelopment = `https://api.bomberapp-peten.com`;

const apiRequest = axios.create({
  baseURL: `${localDevelopment}/user`,
  withCredentials: true,
});

const apiRequestAuth = axios.create({
  baseURL: `${localDevelopment}/users`,
  withCredentials: true,
});

const socketIoURL = `${localDevelopment}`;

export {
  apiRequest,
  apiRequestAuth,
  socketIoURL
};