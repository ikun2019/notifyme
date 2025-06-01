const Redis = require('ioredis');

const redisPub = new Redis({ host: 'redis', port: 6379 });

module.exports = redisPub;