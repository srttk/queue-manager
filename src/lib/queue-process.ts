import { QueueOptions, WorkerOptions, Job, JobsOptions } from "bullmq";

export interface IQueueProcess<Payload = object> {
  name: string;
  process(job: Job<Payload>): Promise<any>;
  groupName?: string;
  options?: Partial<QueueOptions>;
  defaultJobOptions?: JobsOptions;
  workerOptions?: Partial<WorkerOptions>;
  // Events
  onCompleted?(): void;
}
