const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const { UserServiceService } = require('../../proto/user_grpc_pb');
const { getUserInfo } = require('../impl/user.impl');

const shutdown = (server) => {
  if (server) {
    server.tryShutdown(() => {
      console.log('🔴 UserService gRPC server is shut down.');
    });
  }
};

exports.startServer = () => {
  const caCert = fs.readFileSync('/ssl/ca/ca.crt');
  const serverKey = fs.readFileSync('/ssl/post_service/post_service.key');
  const serverCert = fs.readFileSync('/ssl/post_service/post_service.crt');

  const server = new grpc.Server();
  const creds = grpc.ServerCredentials.createSsl(caCert, [{
    private_key: serverKey,
    cert_chain: serverCert
  }]);

  server.addService(UserServiceService, {
    getUserInfo: getUserInfo
  });

  server.bindAsync('0.0.0.0:50051', creds, (err) => {
    if (err) return shutdown(server);
    server.start();
    console.log('🟢 UserService gRPC server is running.');
  });

  process.on('SIGINT', () => shutdown(server));
  process.on('SIGTERM', () => shutdown(server));
};