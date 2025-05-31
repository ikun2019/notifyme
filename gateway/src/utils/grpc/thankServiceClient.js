const grpc = require('@grpc/grpc-js');
const fs = require('fs');

const { ThankServiceClient } = require('../../../proto/thank_grpc_pb');

const caCert = fs.readFileSync('/ssl/ca/ca.crt');

const client = new ThankServiceClient('thank_service:50051', grpc.credentials.createSsl(caCert));

module.exports = client;