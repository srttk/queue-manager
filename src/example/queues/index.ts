import { QueueManager } from "../../lib";
import { greet } from "./greet.queue";
import { danger } from "./danger.queue";
import { groupGreet } from "./group-greet.queue";
import { slowGreet } from "./slow-greet";
import { events } from "./events";

export default new QueueManager(
  { greet, danger, groupGreet, slowGreet, events },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
    namespace: "dev",
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  }
);
