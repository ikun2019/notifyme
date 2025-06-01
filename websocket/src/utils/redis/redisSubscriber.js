const Redis = require('ioredis');

const redisSub = new Redis({ host: 'redis', port: 6379 });

function subscribeToChannel(callback) {
  redisSub.subscribe('post_notifications', (err, count) => {
    if (err) {
      console.error('❌ Redis sbscription error:', err);
      process.exit(1);
    };
    console.log(`🟢 Subscribed to ${count} Redis channels`);
  });

  redisSub.on('message', (channel, message) => {
    callback(message);
  });
}

module.exports = { subscribeToChannel };