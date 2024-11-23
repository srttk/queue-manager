# queue-manager
Simplified BullMQ queues

## Basic Example 

```ts

// `greet.ts` Define you'r queue
import {  IQueueProcess } from "@srttk/queue-manager"
type GreetPayload = {
  name: string
}
export const greet: IQueueProcess<GreetPayload> = {
  name:"greet"
  action: async ({ data }) => {

    console.log(`Hello ${data.name}`)
  }
}

//  `queue.ts` Create QueueManager instance
import { QueueManager } from "@srttk/queue-manager"
import { greet } from './greet'
export default  new QueueManager({ greet })



// `app.ts` : Main app entry point
import queue from "./queue"

async start() {

 // initialize queue manager 
  await queues.registerQueues();
  await queues.startWorkers();

  // Add job to queue
  await queues.addJob("greet", "my-job", { name: "Sarath" });

}

start()


```
