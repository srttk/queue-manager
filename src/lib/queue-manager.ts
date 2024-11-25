import {
  Queue,
  QueueOptions,
  Worker,
  WorkerOptions,
  RedisConnection,
  ConnectionOptions,
  QueueEvents,
  JobsOptions,
} from "bullmq";
import { IQueueProcess } from "./queue-process";

type QueuemanagerConnection = ConnectionOptions | RedisConnection;

type QueueManagerConfig = {
  namespace?: string;
  connection: ConnectionOptions;
};

const DEFAULT_NAMESPACE = "default_queues";

export class QueueManager<T extends Record<string, IQueueProcess>> {
  private _queueMap: T;

  private queues: Queue[] = [];
  private workers: Worker[] = [];

  private config?: QueueManagerConfig;

  public events: QueueEvents;

  private connection: ConnectionOptions;

  private shutdownTriggered: boolean = false;

  constructor(queueMaps: T, config?: QueueManagerConfig) {
    this._queueMap = queueMaps;
    this.config = config;

    if (config?.connection) {
      this.connection = config.connection;
    }
  }

  get namespace() {
    return this?.config?.namespace || DEFAULT_NAMESPACE;
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
      let _options = { ...(q?.options || {}) };
      let _queue = new Queue(q.name, {
        prefix: this.namespace,
        connection: this.connection,
        ..._options,
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
      connection: this.connection,
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
        let _w = new Worker(qp.name, qp.process, {
          connection: this.connection,
          prefix: this.namespace,
        });

        if (qp?.onCompleted) {
          _w.on("completed", qp.onCompleted);
        }

        this.workers.push(_w);
      }
    });
  }

  // Add job

  async addJob<K extends keyof T>(
    name: K,
    jobname: string,
    payload: T[K] extends IQueueProcess<infer P> ? P : never,
    jobOptions?: JobsOptions
  ) {
    // Check item exists on `this._queueMap`
    let qMapItem = this.getFromMapByName(name);

    if (!qMapItem) {
      console.warn(`Queue ${String(name)} not found.`);
      return null;
    }
    // Get queue
    let queue = this.getQueueByName(qMapItem.name);

    if (!queue) {
      console.warn(`Queue ${String(name)} not initialized.`);
      return null;
    }

    let _jobOptions: JobsOptions = {
      ...(qMapItem.defaultJobOptions || {}),
      ...(jobOptions || {}),
    };

    let job = await queue.add(jobname, payload, _jobOptions);

    return job;
  }

  // Get all registered queues
  getQueues() {
    return this.queues;
  }

  // Get queue by name
  getQueue<K extends keyof T>(name: K) {
    let mapItem = this.getFromMapByName(name);
    if (!mapItem) return;

    return this.getQueueByName(mapItem.name);
  }

  // Get all registered workers
  getWorkers() {
    return this.workers;
  }

  // Get worker by name
  getWorker<K extends keyof T>(name: K) {
    let mapItem = this.getFromMapByName(name);
    if (!mapItem) return;

    return this.getWorkerByName(mapItem.name);
  }

  // Get IQueueProcess map item from `this.pmap`
  private getFromMapByName<K extends keyof T>(name: K) {
    let mapItem = this._queueMap[name];
    if (!mapItem) return;
    return mapItem as IQueueProcess;
  }

  // Get initialized Bullmq queue

  private getQueueByName(name: string) {
    let _queue = this.queues.find((queue) => queue.name === name);
    return _queue;
  }

  // Get initialized Bullmq worker
  private getWorkerByName(name: string) {
    let _worker = this.workers.find((worker) => worker.name === name);
    return _worker;
  }

  // Shutdown all
  async shutdown() {
    if (this.shutdownTriggered) {
      return;
    }

    this.shutdownTriggered = true;

    //Pause workers
    if (this.workers?.length) {
      let $pauseWorkers = this.workers.map((w) => {
        return w.pause();
      });
      await Promise.all($pauseWorkers);
    }

    // Off all workers

    if (this.workers?.length) {
      let $closeWorkers = this.workers.map((w) => {
        return w.close();
      });
      await Promise.all($closeWorkers);
    }

    //Off all queues
    if (this.queues?.length) {
      let $closeQueues = this.queues.map((q) => {
        return q.close();
      });
      await Promise.all($closeQueues);
    }
  }
}
