import { AxiosError } from 'axios';

export const isServerError = (
  error: any
): error is AxiosError<{ error: string }> => {
  return (error as AxiosError).isAxiosError && 'error' in error.response.data;
};
