const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const { PostServiceClient } = require('../../../proto/post_grpc_pb');

const caCert = fs.readFileSync('/ssl/ca/ca.crt');

const client = new PostServiceClient('post_service:50051', grpc.credentials.createSsl(caCert));

module.exports = client;