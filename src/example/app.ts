import queues from "./queues";
async function start() {
  await queues.registerQueues();
  await queues.startWorkers();

  await queues.addJob("greet", "my-job", { name: "Sarath" });
}

start()
  .then(async () => {
    console.log("App started");

    setTimeout(async () => {
      await queues.addJob("greet", "after-greet", { name: "Luke" });
    }, 5000);

    setTimeout(async () => {
      await queues.addJob("danger", "close ", { message: "Good bye" });
    }, 10000);
  })
  .catch((e) => {
    console.error("App start error", e);
  });
