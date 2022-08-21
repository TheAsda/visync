import { Exception } from '../types/exception';

export const tryException = <T>(value: T): Exclude<T, Exception> => {
  if (value && 'message' in value) {
    throw new Error((value as Exception).message);
  }
  return value as Exclude<T, Exception>;
};
