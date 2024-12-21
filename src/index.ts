import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { UserManager } from "./utils/manager.js";
import { getRedisClient } from "./config/redisConfig.js";

const app = express();
const userManager = new UserManager();

const io = new WebSocketServer({
  noServer: true,
  path: "/notification",
});

io.on("connection", async (socket: WebSocket) => {
  userManager.connect(socket);
  socket.send(JSON.stringify({ key: "Value" }));

  socket.on("message", async (data: Buffer) => {
    const message = data.toString();
    console.log(message);
    const redisClient = await getRedisClient();
    await redisClient.connect();
    await redisClient.publish("channel", message);
  });

  socket.on("close", async () => {
    userManager.disconnect(socket);
  });
});

const server = app.listen(3000, () => {
  console.log("Server Running");
});

server.on("upgrade", (request, socket, head) => {
  io.handleUpgrade(request, socket, head, (socket) => {
    io.emit("connection", socket, request);
  });
});
