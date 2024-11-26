import { IQueueProcess } from "../../lib";

type Payload = {
  name: string;
};

export const events: IQueueProcess<Payload> = {
  name: "events",
  process: async ({ data }) => {
    console.log("@event", data.name);
    throw new Error("Oh shit");
  },
  async onError(e) {
    console.log("@events:onError >>", e);
  },
  async onFailed(job, error, prev) {
    console.info(
      "@events:onFailed >>",
      `Job ${job?.id} failed : Reason`,
      error.message,
      " prev",
      prev
    );
  },
  onReady: () => {
    console.info("@event:onReady");
  },
  onActive() {
    console.info("@event:onActive");
  },
};
