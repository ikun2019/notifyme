// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var user_pb = require('./user_pb.js');

function serialize_user_FollowTagRequest(arg) {
  if (!(arg instanceof user_pb.FollowTagRequest)) {
    throw new Error('Expected argument of type user.FollowTagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_FollowTagRequest(buffer_arg) {
  return user_pb.FollowTagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_FollowTagResponse(arg) {
  if (!(arg instanceof user_pb.FollowTagResponse)) {
    throw new Error('Expected argument of type user.FollowTagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_FollowTagResponse(buffer_arg) {
  return user_pb.FollowTagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_GetFollowTagRequest(arg) {
  if (!(arg instanceof user_pb.GetFollowTagRequest)) {
    throw new Error('Expected argument of type user.GetFollowTagRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_GetFollowTagRequest(buffer_arg) {
  return user_pb.GetFollowTagRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_GetFollowTagResponse(arg) {
  if (!(arg instanceof user_pb.GetFollowTagResponse)) {
    throw new Error('Expected argument of type user.GetFollowTagResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_GetFollowTagResponse(buffer_arg) {
  return user_pb.GetFollowTagResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_UpdateUserRequest(arg) {
  if (!(arg instanceof user_pb.UpdateUserRequest)) {
    throw new Error('Expected argument of type user.UpdateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_UpdateUserRequest(buffer_arg) {
  return user_pb.UpdateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

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

function serialize_user_UserProfileResponse(arg) {
  if (!(arg instanceof user_pb.UserProfileResponse)) {
    throw new Error('Expected argument of type user.UserProfileResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_UserProfileResponse(buffer_arg) {
  return user_pb.UserProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_user_UserStatsResponse(arg) {
  if (!(arg instanceof user_pb.UserStatsResponse)) {
    throw new Error('Expected argument of type user.UserStatsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_user_UserStatsResponse(buffer_arg) {
  return user_pb.UserStatsResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
  getUserStats: {
    path: '/user.UserService/GetUserStats',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UserIdRequest,
    responseType: user_pb.UserStatsResponse,
    requestSerialize: serialize_user_UserIdRequest,
    requestDeserialize: deserialize_user_UserIdRequest,
    responseSerialize: serialize_user_UserStatsResponse,
    responseDeserialize: deserialize_user_UserStatsResponse,
  },
  createUserProfile: {
    path: '/user.UserService/CreateUserProfile',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UserIdRequest,
    responseType: user_pb.UserProfileResponse,
    requestSerialize: serialize_user_UserIdRequest,
    requestDeserialize: deserialize_user_UserIdRequest,
    responseSerialize: serialize_user_UserProfileResponse,
    responseDeserialize: deserialize_user_UserProfileResponse,
  },
  updateUserProfile: {
    path: '/user.UserService/UpdateUserProfile',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UpdateUserRequest,
    responseType: user_pb.UserInfoResponse,
    requestSerialize: serialize_user_UpdateUserRequest,
    requestDeserialize: deserialize_user_UpdateUserRequest,
    responseSerialize: serialize_user_UserInfoResponse,
    responseDeserialize: deserialize_user_UserInfoResponse,
  },
  followTag: {
    path: '/user.UserService/FollowTag',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.FollowTagRequest,
    responseType: user_pb.FollowTagResponse,
    requestSerialize: serialize_user_FollowTagRequest,
    requestDeserialize: deserialize_user_FollowTagRequest,
    responseSerialize: serialize_user_FollowTagResponse,
    responseDeserialize: deserialize_user_FollowTagResponse,
  },
  unFollowTag: {
    path: '/user.UserService/UnFollowTag',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.FollowTagRequest,
    responseType: user_pb.FollowTagResponse,
    requestSerialize: serialize_user_FollowTagRequest,
    requestDeserialize: deserialize_user_FollowTagRequest,
    responseSerialize: serialize_user_FollowTagResponse,
    responseDeserialize: deserialize_user_FollowTagResponse,
  },
  getFollowTag: {
    path: '/user.UserService/GetFollowTag',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.GetFollowTagRequest,
    responseType: user_pb.GetFollowTagResponse,
    requestSerialize: serialize_user_GetFollowTagRequest,
    requestDeserialize: deserialize_user_GetFollowTagRequest,
    responseSerialize: serialize_user_GetFollowTagResponse,
    responseDeserialize: deserialize_user_GetFollowTagResponse,
  },
};

exports.UserServiceClient = grpc.makeGenericClientConstructor(UserServiceService, 'UserService');
