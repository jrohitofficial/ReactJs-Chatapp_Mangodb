let interval = 0;

export const touchAndHoldStart = (callback) => {
  let i = 1;

  interval = setInterval(() => {
    if (i >= 3) {
      clearInterval(interval);
      callback();

      return;
    }

    i += 1;
  }, 300);
};

export const touchAndHoldEnd = () => {
  clearInterval(interval);
};
