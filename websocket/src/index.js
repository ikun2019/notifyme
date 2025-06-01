const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');

const { subscribeToChannel } = require('./utils/redis/redisSubscriber');

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server: server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('🟢 WebSocket client connected');
  ws.on('message', (message) => {
    console.log('ws message =>', message);
  })
  ws.on('close', () => {
    console.log('🔴 WebSocket client disconnected');
  });
});

subscribeToChannel((message) => {
  console.log('🔔 Message from Redis:', message);
  console.log('🧾 Connected WebSocket clients:', wss.clients.size);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
});

server.listen(8080, () => {
  console.log('🟢 WebSocket Server is running');
});

const shutdown = () => {
  server.close(() => {
    console.log('🔴 WebSocket server shut down');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);