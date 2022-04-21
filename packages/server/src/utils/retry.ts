export const retry = (
  callback: () => void,
  interval: number = 500,
  times: number = 3
): Promise<void> => {
  let counter = 0;
  return new Promise((res, rej) => {
    const timer = setInterval(() => {
      counter++;
      try {
        callback();
        clearInterval(timer);
        res();
      } catch {
        if (counter === times) {
          clearInterval(timer);
          rej(new Error(`Failed after ${counter} retries`));
        }
      }
    }, interval);
  });
};
