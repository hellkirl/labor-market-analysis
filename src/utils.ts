import axios from "axios";
import { promisify } from "util";

export const sleep = promisify(setTimeout);

export const getRequestInstance = (config: any) => {
  return axios.create({
    ...config,
  });
};

export const createRequest = (config: any) => {
  const { baseURL, method, url, timeout, proxy, httpsAgent, headers } = config;
  return getRequestInstance({
    baseURL,
    timeout,
    proxy,
    httpsAgent,
    headers: { ...headers },
  }).request({
    method,
    url,
  });
};
