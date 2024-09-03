import axios from "axios";
const localDevelopment = 'localhost';
const remoteDevelopment = '82.197.65.247';

const apiRequest = axios.create({
  baseURL: `http://${remoteDevelopment}:3333/user`,
  withCredentials: true,
});

const apiRequestAuth = axios.create({
  baseURL: `http://${remoteDevelopment}:3333/users`,
  withCredentials: true,
});

export {
  apiRequest,
  apiRequestAuth
};