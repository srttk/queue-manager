import { QueueOptions, WorkerOptions, Job } from "bullmq";

export interface IQueueProcess<Payload = object> {
  name: string;
  action(job: Job<Payload>): Promise<any>;
  options?: QueueOptions;
  workerOptions?: WorkerOptions;
  groupName?: string;
}
