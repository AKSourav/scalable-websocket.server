# Scalable WebSocket Event Hub

A high-performance, event-driven WebSocket notification system built with the `ws` package and Redis pub/sub, designed for horizontal scalability.

## Architecture Overview

The system implements an event-driven architecture where each WebSocket connection is treated as an independent event emitter/listener, allowing for non-blocking I/O operations and high concurrency.

![System Design](/assets/design.png)

## Key Features

- **Event-Driven Architecture**: Non-blocking I/O operations using Node.js event emitters
- **Horizontal Scalability**: Multiple server instances can handle increasing load
- **Real-time Communication**: Core WebSocket (`ws`) implementation for efficient bi-directional communication
- **Connection Management**: Robust user session tracking and management
- **Message Broadcasting**: Redis pub/sub for cross-instance message distribution
- **TypeScript**: Type-safe implementation with improved developer experience

## Technical Stack

- **WebSocket**: Core `ws` package for lightweight and efficient WebSocket implementation
- **Redis Pub/Sub**: For cross-instance message broadcasting
- **Express**: HTTP server for WebSocket upgrade handling
- **TypeScript**: For type safety and better code organization

## Implementation Details

### WebSocket Server Setup
```typescript
import { WebSocket, WebSocketServer } from "ws";

const io = new WebSocketServer({
  noServer: true,
  path: "/notification",
});

// Event-driven connection handling
io.on("connection", async (socket: WebSocket) => {
  // Connection events
});
```

### Event Handling
```typescript
// Message event handling
socket.on("message", async (data: Buffer) => {
  const message = data.toString();
  const redisClient = await getRedisClient();
  await redisClient.publish("channel", message);
});

// Connection cleanup
socket.on("close", async () => {
  userManager.disconnect(socket);
});

```
```typescript
// Message event handling from other servers
this.redisClient = redis.createClient({
    url:process.env.REDIS_URL || "redis://default:password@localhost:6379"
});
const subscriber = this.redisClient.duplicate();
await subscriber.connect();
await subscriber.subscribe('channel', (message: string) => {
    message = JSON.parse(message);
    console.log("redis message: ",message);
    });
```

## Scaling Considerations

1. **Horizontal Scaling**
   - Multiple server instances can run simultaneously
   - Load balancer distributes WebSocket connections
   - Redis pub/sub ensures message delivery across instances

2. **Connection Management**
   - User Manager tracks active connections
   - Efficient cleanup on disconnection
   - Session persistence across server restarts

3. **Performance Optimization**
   - Non-blocking I/O operations
   - Efficient message broadcasting
   - Connection pooling for Redis

## Getting Started

1. **Prerequisites**
   ```bash
   Node.js >= 14
   Redis Server
   TypeScript >= 4.x
   ```

2. **Installation**
   ```bash
   # Clone repository
   git clone <repository-url>

   # Install dependencies
   npm install

   # Configure environment
   cp .env.example .env
   ```

3. **Configuration**
   ```env
   REDIS_URL=redis://localhost:6379
   WS_PORT=3000
   ```

4. **Running the Server**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request