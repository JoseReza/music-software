
const utils = {
  wait: async (time) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
}
