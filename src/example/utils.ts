export function sleep(ms: number = 1000) {
  return new Promise((resolve, reject) => {
    let $timer = setTimeout(() => {
      clearTimeout($timer);
      return resolve("done");
    }, ms);
  });
}
