# @srttk/queue-manager

A simplified wrapper around BullMQ for easy queue management in Node.js applications. This package provides a straightforward way to define, manage, and process queues with minimal boilerplate.

## Features

- Simple queue definition interface
- Type-safe queue processing
- Easy worker management
- Simplified job addition API
- Built on top of robust BullMQ infrastructure

## Installation

```bash
npm install @srttk/queue-manager
```

## Basic Usage

### 1. Define Your Queue

Create a queue processor by defining a type for your payload and implementing the `IQueueProcess` interface:

```typescript
// greet.ts
import { IQueueProcess } from "@srttk/queue-manager"

type GreetPayload = {
  name: string
}

export const greet: IQueueProcess<GreetPayload> = {
  name: "greet",
  action: async ({ data }) => {
    console.log(`Hello ${data.name}`)
  }
}
```

### 2. Create QueueManager Instance

Set up your queue manager with your defined queues:

```typescript
// queue.ts
import { QueueManager } from "@srttk/queue-manager"
import { greet } from './greet'

export default new QueueManager({ greet })
```

### 3. Initialize and Use Queues

In your main application entry point:

```typescript
// app.ts
import queue from "./queue"

async function start() {
  // Initialize queue manager
  await queues.registerQueues();
  await queues.startWorkers();

  // Add job to queue
  await queues.addJob("greet", "my-job", { name: "Sarath" });
}

start()
```

## API Reference

### QueueManager

#### Constructor

```typescript
new QueueManager(queues: Record<string, IQueueProcess>)
```

#### Methods

- `registerQueues()`: Initializes all defined queues
- `startWorkers()`: Starts workers for all registered queues
- `addJob(queueName: string, jobId: string, data: any)`: Adds a new job to the specified queue

### IQueueProcess Interface

```typescript
interface IQueueProcess<T> {
  name: string;
  action: (job: { data: T }) => Promise<void>;
}
```

## Configuration

The package uses BullMQ under the hood. You can configure Redis connection settings and other options when initializing the QueueManager (documentation coming soon).

## TypeScript Support

This package is written in TypeScript and includes type definitions. It provides full type safety for your queue payloads and processors.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and feature requests, please use the [GitHub issues page](https://github.com/yourusername/queue-manager/issues).