const express = require('express');

// * API Security
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const client = require('prom-client');

// * Import router
const usersRouter = require('./router/users.router');
const postsRouter = require('./router/posts.router');

// * Expressの初期化
const app = express();

// * Expressの設定
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.set('trust proxy', 1);

// * API Security Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(helmet());
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});
app.use(limiter);

// * Prometheus メトリクス設定
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5] // 秒数単位の範囲
});
register.registerMetric(httpRequestDuration);
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    });
    end({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode,
    });
  });
  next();
});

// * routing
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

require('./utils/kafka/kafkaToRedis');

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// * Launch
const server = app.listen(8000, () => {
  console.log('🟢 gateway gRPC Server is running');
});

// * Graceful shut down
const shutdown = () => {
  server.close(() => {
    console.log('🟢 Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);