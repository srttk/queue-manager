import { IQueueProcess } from "../../lib";

type GreetPayload = {
  name: string;
};

type Result = {
  message: string;
};

export const greet: IQueueProcess<GreetPayload, Result> = {
  name: "greet",
  process: async ({ data }) => {
    const message = `Hello ${data.name}`;
    console.log(message);
    return {
      message,
    };
  },
  groupName: "app1",
  onCompleted: (job, result) => {
    console.log("@greet:onComplete : ", job.id, " Completed, result: ", result);
  },
};
