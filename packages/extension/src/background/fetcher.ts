import axios from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

export const serverHostname = process.env.SERVER_HOSTNAME ?? '127.0.0.1';
export const serverPort = process.env.SERVER_PORT ?? 7001;
export const serverUrl = `http://${serverHostname}:${serverPort}`;

export const fetcher = axios.create({
  baseURL: serverUrl,
  adapter: fetchAdapter,
});
