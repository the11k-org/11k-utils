# Distributed Tracing Logger and Axios Wrapper

This project provides a custom logger for distributed tracing in Node.js applications, along with middleware and an Axios wrapper that automatically includes a tracing ID for propagating requests across services.

## Features

- **Distributed Tracing Logger**: Logs messages with a tracing ID that propagates across services.
- **Express Middleware**: Middleware for generating and propagating tracing IDs in HTTP requests.
- **Axios Wrapper**: Automatically adds tracing IDs to outgoing HTTP requests.

## Installation

1. Install the package:

```bash
npm install 11k-utils
```

## Usage

### 1. Logger Class

The `Logger` class is used to create log entries with a tracing ID. This ID helps track requests as they pass through different services.

- **`Logger.setTracingId(tracingId, callback)`**: Sets a tracing ID and runs the provided callback within its context. If no ID is provided, a new one is generated.
- **`logger.getLogger()`**: Returns a logger instance that includes the tracing ID.

Example:

```typescript
import { Logger } from './src/logger/logger';

Logger.setTracingId(undefined, () => {
  const logger = new Logger().getLogger();
  logger.info('Request started');
});
```

### 2. Tracing Middleware

The `tracingMiddleware` automatically generates a tracing ID if none is provided and propagates it through subsequent requests.

To use it in an Express application:

```typescript
import express from 'express';
import { tracingMiddleware } from './src/logger/tracingMiddleware';
import { Logger } from './src/logger/logger';

const app = express();
app.use(tracingMiddleware);

app.get('/example', (req, res) => {
  const logger = new Logger().getLogger();
  logger.info('Handling /example route');
  res.send('Hello, world!');
});
```

### 3. Axios Wrapper

The `AxiosWrapper` ensures that every outgoing HTTP request contains the tracing ID in the headers (`X-Tracing-ID`). This helps maintain the tracing context across service calls.

Example:

```typescript
import { axiosInstance } from './src/axios/axios';

async function exampleServiceCall() {
  try {
    const response = await axiosInstance.get('http://some-external-service');
    console.log(response.data);
  } catch (error) {
    console.error('Error making request:', error);
  }
}
```

### 4. Full Example

```typescript
import express from 'express';
import { tracingMiddleware } from './src/logger/tracingMiddleware';
import { Logger } from './src/logger/logger';
import { axiosInstance } from './src/axios/axios';

const app = express();
app.use(tracingMiddleware);

app.get('/service', async (req, res) => {
  const logger = new Logger().getLogger();
  logger.info('Received request at /service');
  await axiosInstance.get('http://another-service');
  logger.info('Completed request to another service');
  res.send('Service completed');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Notes

- **Tracing Context**: The tracing ID is propagated using `AsyncLocalStorage`, ensuring that every log within the lifecycle of a request has the same tracing ID.
- **Axios Interceptor**: The Axios interceptor adds the `X-Tracing-ID` header to all outgoing requests, enabling tracing across distributed services.

## License

This project is licensed under the MIT License.
