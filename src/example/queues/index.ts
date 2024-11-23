import { QueueManager } from "../../lib";
import { greet } from "./greet.queue";
import { danger } from "./danger.queue";
export default new QueueManager(
  { greet, danger },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
