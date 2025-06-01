const { Kafka } = require('kafkajs');
const fs = require('fs');

const kafka = new Kafka({
  clientId: 'post_service',
  brokers: ["kafka1:9092", "kafka2:9092", "kafka3:9092"],
  ssl: {
    rejectUnauthorized: true,
    ca: [fs.readFileSync('/ssl/ca/ca.crt', 'utf-8')],
    key: fs.readFileSync('/ssl/post_service/post_service.key', 'utf-8'),
    cert: fs.readFileSync('/ssl/post_service/post_service.crt', 'utf-8')
  }
});

const producer = kafka.producer();

// * Kafka起動メソッド
const connectKafka = async () => {
  try {
    await producer.connect();
    console.log('🟢 Kafka producer connected');
  } catch (error) {
    console.error('❌ Kafka producer connection failed:', error.message);
  }
};

// * Kafkaへ通知を送信するメソッド
const sendPostCreatedEvent = async (topic, post) => {
  try {
    await producer.send({
      topic,
      messages: [{
        key: post.id,
        value: JSON.stringify({
          postId: post.id,
          authorId: post.authorId,
          content: post.content,
          imageUrl: post.imageUrl,
          link: post.link,
          createdAt: post.createdAt,
          tagIds: post.tags?.map(t => t.tagId) || []
        })
      }]
    });
  } catch (error) {
    console.error('❌ Failed to sendPostCreatedEvent to Kafka:', error.message);
  }
};

module.exports = {
  connectKafka,
  sendPostCreatedEvent
};