const { Kafka } = require('kafkajs');
const fs = require('fs');
const redisPub = require('../redis/redisPub');

const kafka = new Kafka({
  clientId: 'redis_publisher',
  brokers: ["kafka1:9092", "kafka2:9092", "kafka3:9092"],
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync('/ssl/ca/ca.crt', 'utf-8')],
    key: fs.readFileSync('/ssl/gateway/gateway.key', 'utf-8'),
    cert: fs.readFileSync('/ssl/gateway/gateway.crt', 'utf-8')
  }
});

const consumer = kafka.consumer({ groupId: 'redis-publisher-group' });

async function run() {
  await consumer.connect();
  console.log('🟢 Kafka consumer connected');
  await consumer.subscribe({ topic: 'post-created', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      // Redisへpublish
      await redisPub.publish('post_notifications', value);
    }
  });
}

run().catch(console.error);