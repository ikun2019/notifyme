const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const { TagServiceClient } = require('../../../proto/tag_grpc_pb');

const caCert = fs.readFileSync('/ssl/ca/ca.crt');
const clientKey = fs.readFileSync('/ssl/gateway/gateway.key');
const clientCert = fs.readFileSync('/ssl/gateway/gateway.crt');

const client = new TagServiceClient('tag_service:50051', grpc.credentials.createSsl(caCert, clientKey, clientCert));

module.exports = client;