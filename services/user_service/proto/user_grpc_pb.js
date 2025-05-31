// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var user_pb = require('./user_pb.js');

function serialize_user_UserIdRequest(arg) {
  if (!(arg instanceof user_pb.UserIdRequest)) {
    throw new Error('Expected argument of type user.UserIdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_UserIdRequest(buffer_arg) {
  return user_pb.UserIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_UserInfoResponse(arg) {
  if (!(arg instanceof user_pb.UserInfoResponse)) {
    throw new Error('Expected argument of type user.UserInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_UserInfoResponse(buffer_arg) {
  return user_pb.UserInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var UserServiceService = exports.UserServiceService = {
  getUserInfo: {
    path: '/user.UserService/GetUserInfo',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UserIdRequest,
    responseType: user_pb.UserInfoResponse,
    requestSerialize: serialize_user_UserIdRequest,
    requestDeserialize: deserialize_user_UserIdRequest,
    responseSerialize: serialize_user_UserInfoResponse,
    responseDeserialize: deserialize_user_UserInfoResponse,
  },
};

exports.UserServiceClient = grpc.makeGenericClientConstructor(UserServiceService, 'UserService');
