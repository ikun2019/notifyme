const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const { UserServiceClient } = require('../../../proto/user_grpc_pb');

const caCert = fs.readFileSync('/ssl/ca/ca.crt');

const client = new UserServiceClient('user_service:50051', grpc.credentials.createSsl(caCert));

module.exports = client;