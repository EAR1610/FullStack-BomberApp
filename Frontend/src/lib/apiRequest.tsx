import axios from "axios";
const localDevelopment = `http://localhost:3333`;
const remoteDevelopment = `https://api.bomberapp-peten.com`;

const apiRequest = axios.create({
  baseURL: `${remoteDevelopment}/user`,
  withCredentials: true,
});

const apiRequestAuth = axios.create({
  baseURL: `${remoteDevelopment}/users`,
  withCredentials: true,
});

const socketIoURL = `${remoteDevelopment}`;

export {
  apiRequest,
  apiRequestAuth,
  socketIoURL
};