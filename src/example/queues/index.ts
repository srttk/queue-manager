import { QueueManager } from "../../lib";
import { greet } from "./greet.queue";
import { danger } from "./danger.queue";
import { groupGreet } from "./group-greet.queue";
export default new QueueManager(
  { greet, danger, groupGreet },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
