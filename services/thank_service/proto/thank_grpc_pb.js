// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var thank_pb = require('./thank_pb.js');

function serialize_thank_ThanksCountResponse(arg) {
  if (!(arg instanceof thank_pb.ThanksCountResponse)) {
    throw new Error('Expected argument of type thank.ThanksCountResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_thank_ThanksCountResponse(buffer_arg) {
  return thank_pb.ThanksCountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_thank_UserIdRequest(arg) {
  if (!(arg instanceof thank_pb.UserIdRequest)) {
    throw new Error('Expected argument of type thank.UserIdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_thank_UserIdRequest(buffer_arg) {
  return thank_pb.UserIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var ThankServiceService = exports.ThankServiceService = {
  getThanksCountForUser: {
    path: '/thank.ThankService/GetThanksCountForUser',
    requestStream: false,
    responseStream: false,
    requestType: thank_pb.UserIdRequest,
    responseType: thank_pb.ThanksCountResponse,
    requestSerialize: serialize_thank_UserIdRequest,
    requestDeserialize: deserialize_thank_UserIdRequest,
    responseSerialize: serialize_thank_ThanksCountResponse,
    responseDeserialize: deserialize_thank_ThanksCountResponse,
  },
};

exports.ThankServiceClient = grpc.makeGenericClientConstructor(ThankServiceService, 'ThankService');
