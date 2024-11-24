import { IQueueProcess } from "../../lib";
import q from "./index";
export const danger: IQueueProcess<{ message: string }> = {
  name: "danger",
  process: async ({ data }) => {
    console.log("Hey ", data.message);
    await q.shutdown();
  },
  groupName: "app1",
  defaultJobOptions: {
    removeOnFail: 0,
  },
  workerOptions: {
    concurrency: 1,
  },
  options: {},
};
