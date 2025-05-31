#!/bin/bash

PROTO=$1

echo "🧹 Cleaning previous generated files"
rm -f ./${PROTO}_service/proto/${PROTO}_pb.js
rm -f ./${PROTO}_service/proto/${PROTO}_grpc_pb.js
rm -f ./gateway/proto/${PROTO}_pb.js
rm -f ./gateway/proto/${PROTO}_grpc_pb.js

echo "🛜 Generation gRPC proto"
grpc_tools_node_protoc -I ./proto \
  --js_out=import_style=commonjs:./${PROTO}_service/proto \
  --grpc_out=grpc_js:./${PROTO}_service/proto \
  ./proto/${PROTO}.proto

echo "🛜 Copying generated files to gateway"
mkdir -p ./gateway/proto
cp ./${PROTO}_service/proto/${PROTO}_pb.js ./gateway/proto
cp ./${PROTO}_service/proto/${PROTO}_grpc_pb.js ./gateway/proto

echo "✅ Completed gen.sh"