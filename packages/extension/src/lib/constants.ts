export const IS_IFRAME = typeof window !== 'undefined' && window !== top;
export const IS_CONTENT =
  typeof chrome !== 'undefined' &&
  typeof window !== 'undefined' &&
  !window.location.href.startsWith('chrome-extension://');
let isBackground = false;
try {
  isBackground =
    // @ts-expect-error class might not be defined
    typeof self !== 'undefined' && self instanceof ServiceWorkerGlobalScope;
} catch {
  isBackground = false;
}
export { isBackground as IS_BACKGROUND };
