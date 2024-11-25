import queues from "./queues";
async function start() {
  await queues.registerQueues();
  await queues.startWorkers();
}

let signals = ["SIGINT", "SIGTERM"];

signals.map((signal) => {
  process.on(signal, async function () {
    await queues.shutdown();
  });
});

start()
  .then(async () => {
    console.log("App2  started");

    await queues.addJob("slowGreet", "greet-slowly", { name: "Yoda" });

    setTimeout(async () => {
      await queues.addJob("greet", "after-greet", { name: "Obiwan" });
    }, 5000);

    setTimeout(async () => {
      await queues.addJob("greet", "greet vader", { name: "Darth Vader" });
    }, 8000);
  })
  .catch((e) => {
    console.error("App2 start error", e);
  });
