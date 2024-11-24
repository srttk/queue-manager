import queues from "./queues";
async function start() {
  await queues.registerQueues();
  await queues.startWorkers("app1");
  await queues.addJob("greet", "my-job", { name: "Sarath" });
}

start()
  .then(async () => {
    console.log("App started");

    setTimeout(async () => {
      await queues.addJob("greet", "after-greet", { name: "Luke" });
      await queues.addJob("groupGreet", "group-greet-job", {
        name: "Master Yoda",
      });
    }, 5000);

    setTimeout(async () => {
      await queues.addJob("danger", "close ", { message: "Good bye" });
    }, 10000);
  })
  .catch((e) => {
    console.error("App start error", e);
  });
