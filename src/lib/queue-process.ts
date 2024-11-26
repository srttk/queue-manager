import {
  QueueOptions,
  WorkerOptions,
  Job,
  JobsOptions,
  WorkerListener,
} from "bullmq";

export interface IQueueProcess<Payload = any, Result = any> {
  name: string;
  process(job: Job<Payload, Result>): Promise<Result>;
  groupName?: string;
  options?: Partial<QueueOptions>;
  defaultJobOptions?: JobsOptions;
  workerOptions?: Partial<WorkerOptions>;
  // Events
  onActive?: WorkerListener<Payload, Result>["active"];
  onClosed?: WorkerListener<Payload, Result>["closed"];
  onCompleted?: WorkerListener<Payload, Result>["completed"];
  onError?: WorkerListener<Payload, Result>["error"];
  onDrained?: WorkerListener<Payload, Result>["drained"];
  onFailed?: WorkerListener<Payload, Result>["failed"];
  onPaused?: WorkerListener<Payload, Result>["paused"];
  onProgress?: WorkerListener<Payload, Result>["progress"];
  onReady?: WorkerListener<Payload, Result>["ready"];
  onStalled?: WorkerListener<Payload, Result>["stalled"];
}
