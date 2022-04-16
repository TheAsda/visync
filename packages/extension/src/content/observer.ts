export const watchMutation = (onMutation: () => void) => {
  const observer = new MutationObserver(onMutation);
  observer.observe(document.body, { subtree: true, childList: true });
};
