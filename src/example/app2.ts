import queues from "./queues";
async function start() {
  await queues.startQueues();
  await queues.startWorkers("app2");
}

start()
  .then(async () => {
    console.log("App2  started");

    setTimeout(async () => {
      await queues.addJob("greet", "after-greet", { name: "Obiwan" });
    }, 5000);
  })
  .catch((e) => {
    console.error("App2 start error", e);
  });
