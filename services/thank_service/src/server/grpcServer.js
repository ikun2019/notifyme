const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const { ThankServiceService } = require('../../proto/thank_grpc_pb');
const { getThanksCountForUser } = require('../impl/thank.impl');

const shutdown = (server) => {
  if (server) {
    server.tryShutdown(() => {
      console.log('🔴 Thank gRPC server is shut down');
    });
  }
};
exports.startServer = () => {
  const caCert = fs.readFileSync('/ssl/ca/ca.crt');
  const serverKey = fs.readFileSync('/ssl/thank_service/thank_service.key');
  const serverCert = fs.readFileSync('/ssl/thank_service/thank_service.crt');

  const server = new grpc.Server();
  const creds = grpc.ServerCredentials.createSsl(caCert, [{
    private_key: serverKey,
    cert_chain: serverCert
  }], true);

  server.addService(ThankServiceService, {
    GetThanksCountForUser: getThanksCountForUser,
  });

  server.bindAsync('0.0.0.0:50051', creds, (err) => {
    if (err) return shutdown(server);
    server.start();
    console.log('🟢 Thank gRPC server is running');
  });

  process.on('SIGINT', () => shutdown(server));
  process.on('SIGTERM', () => shutdown(server));
};