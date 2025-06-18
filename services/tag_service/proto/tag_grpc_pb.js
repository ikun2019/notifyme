// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var tag_pb = require('./tag_pb.js');

function serialize_tag_GetAllTagsRequest(arg) {
  if (!(arg instanceof tag_pb.GetAllTagsRequest)) {
    throw new Error('Expected argument of type tag.GetAllTagsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_tag_GetAllTagsRequest(buffer_arg) {
  return tag_pb.GetAllTagsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_tag_GetAllTagsResponse(arg) {
  if (!(arg instanceof tag_pb.GetAllTagsResponse)) {
    throw new Error('Expected argument of type tag.GetAllTagsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_tag_GetAllTagsResponse(buffer_arg) {
  return tag_pb.GetAllTagsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_tag_GetOrCreateTagsRequest(arg) {
  if (!(arg instanceof tag_pb.GetOrCreateTagsRequest)) {
    throw new Error('Expected argument of type tag.GetOrCreateTagsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_tag_GetOrCreateTagsRequest(buffer_arg) {
  return tag_pb.GetOrCreateTagsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_tag_GetOrCreateTagsResponse(arg) {
  if (!(arg instanceof tag_pb.GetOrCreateTagsResponse)) {
    throw new Error('Expected argument of type tag.GetOrCreateTagsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_tag_GetOrCreateTagsResponse(buffer_arg) {
  return tag_pb.GetOrCreateTagsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var TagServiceService = exports.TagServiceService = {
  getOrCreateTags: {
    path: '/tag.TagService/GetOrCreateTags',
    requestStream: false,
    responseStream: false,
    requestType: tag_pb.GetOrCreateTagsRequest,
    responseType: tag_pb.GetOrCreateTagsResponse,
    requestSerialize: serialize_tag_GetOrCreateTagsRequest,
    requestDeserialize: deserialize_tag_GetOrCreateTagsRequest,
    responseSerialize: serialize_tag_GetOrCreateTagsResponse,
    responseDeserialize: deserialize_tag_GetOrCreateTagsResponse,
  },
  getAllTags: {
    path: '/tag.TagService/GetAllTags',
    requestStream: false,
    responseStream: false,
    requestType: tag_pb.GetAllTagsRequest,
    responseType: tag_pb.GetAllTagsResponse,
    requestSerialize: serialize_tag_GetAllTagsRequest,
    requestDeserialize: deserialize_tag_GetAllTagsRequest,
    responseSerialize: serialize_tag_GetAllTagsResponse,
    responseDeserialize: deserialize_tag_GetAllTagsResponse,
  },
};

exports.TagServiceClient = grpc.makeGenericClientConstructor(TagServiceService, 'TagService');
