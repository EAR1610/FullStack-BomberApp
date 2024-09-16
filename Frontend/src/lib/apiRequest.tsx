import axios from "axios";
const localDevelopment = 'localhost';
const remoteDevelopment = '82.197.65.247';

const apiRequest = axios.create({
  baseURL: `http://${localDevelopment}:3333/user`,
  withCredentials: true,
});

const apiRequestAuth = axios.create({
  baseURL: `http://${localDevelopment}:3333/users`,
  withCredentials: true,
});

const socketIoURL = `http://${localDevelopment}:3333`;

export {
  apiRequest,
  apiRequestAuth,
  socketIoURL
};