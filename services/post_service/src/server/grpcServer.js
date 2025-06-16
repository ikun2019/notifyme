const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const { PostServiceService } = require('../../proto/post_grpc_pb');
const { getPostCountByAuthor, createPost, listPosts, getPostsByTagId } = require('../impl/post.impl');
const { connectKafka } = require('../utils/kafka/kafkaProducer');

const shutdown = (server) => {
  if (server) {
    server.tryShutdown(() => {
      console.log('🔴 PostSevice gRPC server is shut down');
    });
  }
}

exports.startServer = () => {
  const caCert = fs.readFileSync('/ssl/ca/ca.crt');
  const serverKey = fs.readFileSync('/ssl/post_service/post_service.key');
  const serverCert = fs.readFileSync('/ssl/post_service/post_service.crt');

  const server = new grpc.Server();
  const creds = grpc.ServerCredentials.createSsl(caCert, [{
    private_key: serverKey,
    cert_chain: serverCert
  }], true);

  server.addService(PostServiceService, {
    getPostCountByAuthor: getPostCountByAuthor,
    createPost: createPost,
    listPosts: listPosts,
    getPostsByTagId: getPostsByTagId,
  });

  server.bindAsync('0.0.0.0:50051', creds, (err) => {
    if (err) return shutdown(server);
    connectKafka();
    server.start();
    console.log('🟢 PostService gRPC server is running');
  });

  process.on('SIGINT', () => shutdown(server));
  process.on('SIGTERM', () => shutdown(server));
}