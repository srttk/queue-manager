import { IQueueProcess } from "../../lib";
import q from "./index";
export const danger: IQueueProcess<{ message: string }> = {
  name: "danger",
  action: async ({ data }) => {
    console.log("Hey ", data.message);
    await q.shutdown();
  },
};
