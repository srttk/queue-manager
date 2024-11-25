import { QueueManager } from "../../lib";
import { greet } from "./greet.queue";
import { danger } from "./danger.queue";
import { groupGreet } from "./group-greet.queue";
import { slowGreet } from "./slow-greet";
export default new QueueManager(
  { greet, danger, groupGreet, slowGreet },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
    namespace: "dev",
  }
);
