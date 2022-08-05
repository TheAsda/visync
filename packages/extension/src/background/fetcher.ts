import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

export const serverHostname = process.env.SERVER_HOSTNAME ?? 'localhost';
export const serverPort = process.env.SERVER_PORT ?? 7001;
export const serverUrl = `http://${serverHostname}:${serverPort}`;

export const fetcher = axios.create({
  baseURL: serverUrl,
  adapter: fetchAdapter,
});
