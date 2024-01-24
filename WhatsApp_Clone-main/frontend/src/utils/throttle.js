function throttle(func, delay) {
  let timeoutId;
  let lastExecTime = 0;

  return function (...args) {
    const currentTime = Date.now();
    const timeSinceLastExec = currentTime - lastExecTime;

    // If the time since the last execution is greater than the delay,
    // call the function immediately and reset the last execution time.
    if (timeSinceLastExec >= delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      // If the time since the last execution is less than the delay,
      // schedule the function call after the remaining time has passed.
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - timeSinceLastExec);
    }
  };
}


export default throttle;