export type RuntimeMessage<T, P = void> = {
  type: T;
} & (P extends void ? {} : { payload: P });
