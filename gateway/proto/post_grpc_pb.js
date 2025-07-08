// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var post_pb = require('./post_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_post_AuthStatsResponse(arg) {
  if (!(arg instanceof post_pb.AuthStatsResponse)) {
    throw new Error('Expected argument of type post.AuthStatsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_post_AuthStatsResponse(buffer_arg) {
  return post_pb.AuthStatsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_post_CreatePostRequest(arg) {
  if (!(arg instanceof post_pb.CreatePostRequest)) {
    throw new Error('Expected argument of type post.CreatePostRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_post_CreatePostRequest(buffer_arg) {
  return post_pb.CreatePostRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_post_GetPostByTagIdRequest(arg) {
  if (!(arg instanceof post_pb.GetPostByTagIdRequest)) {
    throw new Error('Expected argument of type post.GetPostByTagIdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_post_GetPostByTagIdRequest(buffer_arg) {
  return post_pb.GetPostByTagIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_post_ListPostsResponse(arg) {
  if (!(arg instanceof post_pb.ListPostsResponse)) {
    throw new Error('Expected argument of type post.ListPostsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_post_ListPostsResponse(buffer_arg) {
  return post_pb.ListPostsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_post_PostResponse(arg) {
  if (!(arg instanceof post_pb.PostResponse)) {
    throw new Error('Expected argument of type post.PostResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_post_PostResponse(buffer_arg) {
  return post_pb.PostResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_post_UserIdRequest(arg) {
  if (!(arg instanceof post_pb.UserIdRequest)) {
    throw new Error('Expected argument of type post.UserIdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_post_UserIdRequest(buffer_arg) {
  return post_pb.UserIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var PostServiceService = exports.PostServiceService = {
  getAuthStats: {
    path: '/post.PostService/GetAuthStats',
    requestStream: false,
    responseStream: false,
    requestType: post_pb.UserIdRequest,
    responseType: post_pb.AuthStatsResponse,
    requestSerialize: serialize_post_UserIdRequest,
    requestDeserialize: deserialize_post_UserIdRequest,
    responseSerialize: serialize_post_AuthStatsResponse,
    responseDeserialize: deserialize_post_AuthStatsResponse,
  },
  createPost: {
    path: '/post.PostService/CreatePost',
    requestStream: false,
    responseStream: false,
    requestType: post_pb.CreatePostRequest,
    responseType: post_pb.PostResponse,
    requestSerialize: serialize_post_CreatePostRequest,
    requestDeserialize: deserialize_post_CreatePostRequest,
    responseSerialize: serialize_post_PostResponse,
    responseDeserialize: deserialize_post_PostResponse,
  },
  listPosts: {
    path: '/post.PostService/ListPosts',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: post_pb.ListPostsResponse,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_post_ListPostsResponse,
    responseDeserialize: deserialize_post_ListPostsResponse,
  },
  getPostsByTagId: {
    path: '/post.PostService/GetPostsByTagId',
    requestStream: false,
    responseStream: false,
    requestType: post_pb.GetPostByTagIdRequest,
    responseType: post_pb.ListPostsResponse,
    requestSerialize: serialize_post_GetPostByTagIdRequest,
    requestDeserialize: deserialize_post_GetPostByTagIdRequest,
    responseSerialize: serialize_post_ListPostsResponse,
    responseDeserialize: deserialize_post_ListPostsResponse,
  },
};

exports.PostServiceClient = grpc.makeGenericClientConstructor(PostServiceService, 'PostService');
