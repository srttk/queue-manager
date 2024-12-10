import { IQueueProcess, QueueManager } from "../lib";

let greet: IQueueProcess<{ name: string }> = {
  name: "greet",
  process: async ({ data }) => {
    console.log("HEY ", data.name.toUpperCase());
  },
};

let qm = new QueueManager(
  { greet },
  {
    namespace: "development",
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

async function start() {
  await qm.startQueues();
  await qm.startWorkers();

  setTimeout(async () => {
    await qm.addJob("greet", "greet-luke", { name: "Luke Skywalker" });
  }, 3000);
}

start();
