import { IQueueProcess } from "../../lib";

type GreetPayload = {
  name: string;
};

export const greet: IQueueProcess<GreetPayload> = {
  name: "greet",
  process: async ({ data }) => {
    console.log(`Hello ${data.name}`);
  },
  groupName: "app1",
};
