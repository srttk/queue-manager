import {
  Queue,
  QueueOptions,
  Worker,
  WorkerOptions,
  RedisConnection,
  ConnectionOptions,
  QueueEvents,
} from "bullmq";
import { IQueueProcess } from "./queue-process";

type QueuemanagerConnection = ConnectionOptions | RedisConnection;

type QueueManagerConfig = {
  namespace?: string;
  connection: ConnectionOptions;
};

export class QueueManager<T extends Record<string, IQueueProcess<object>>> {
  private _queueMap: T;

  private queues: Queue[] = [];
  private workers: Worker[] = [];

  private config?: QueueManagerConfig;

  public events: QueueEvents;

  private connectionOptions: ConnectionOptions;

  constructor(queueMaps: T, config?: QueueManagerConfig) {
    this._queueMap = queueMaps || {};
    this.config = config;

    if (config?.connection) {
      this.connectionOptions = config.connection;
    }
  }

  registerQueues() {
    if (!this._queueMap) {
      //TODO: Error no queues added
      return null;
    }
    let queues = Object.values(this._queueMap);

    if (!queues?.length) {
      return null;
    }

    queues.map((q) => {
      let _queue = new Queue(q.name, {
        connection: this.connectionOptions,
      });
      this.queues.push(_queue);
    });

    // TODO: Listen events
    if (!this.events) {
      // this.onQueueEvents();
    }

    return this.queues;
  }

  private onQueueEvents() {
    // TODO: Add events
    this.events = new QueueEvents(`queue-events`, {
      connection: this.connectionOptions,
    });
  }

  private async offQueueEvents() {
    if (!this.events) return;

    await this.events.close();
    await this.events.disconnect();
  }

  startWorkers(groupName: string | null = null) {
    let _queueMapsValues = Object.values(this._queueMap).filter((qp) => {
      if (groupName) {
        return qp.groupName === groupName;
      }
      return qp;
    });

    _queueMapsValues.forEach((qp) => {
      let exists = this.workers.find((w) => w.name === qp.name);
      if (!exists) {
        // Initialize worker instance
        let _w = new Worker(qp.name, qp.action, {
          connection: this.connectionOptions,
        });
        this.workers.push(_w);
      }
    });
  }

  // Shutdown all
  async shutdown() {
    // await this.offQueueEvents();
    // Off all workers
    let $closeWorkers = this.workers.map((w) => {
      return w.close();
    });
    await Promise.all($closeWorkers);

    // Off all queues

    let $closeQueues = this.queues.map((q) => {
      return q.close();
    });
    await Promise.all($closeQueues);
    console.log("closed workers");
    let c = await this.workers[0].client;
    await c.quit();
  }

  // Add job

  async addJob<K extends keyof T>(
    name: K,
    jobname: string,
    payload: T[K] extends IQueueProcess<infer P> ? P : never
  ) {
    // Check item exists on `this._queueMap`
    let qMapItem = this._queueMap[name];

    if (!qMapItem) {
      console.warn(`Queue ${String(name)} not found.`);
      return null;
    }
    // Get queue
    let queue = this.queues.find((q) => q.name === qMapItem.name);

    if (!queue) {
      console.warn(`Queue ${String(name)} not initialized.`);
      return null;
    }

    let job = await queue.add(jobname, payload);

    return job;
  }

  // Get queues
  getQueues() {
    return this.queues;
  }

  // Get workers
  getWorkers() {
    return this.workers;
  }
}
