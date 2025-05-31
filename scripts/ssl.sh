#!/bin/bash

TYPE=$1
shift
NODES=("$@")
CA_DIR=/ssl/ca

mkdir -p ${CA_DIR}

if [ ! -f "${CA_DIR}/ca.key" ]; then
  echo "🛜 Generating ca.key..."
  openssl genrsa -out ${CA_DIR}/ca.key 4096
  openssl req -new -x509 -key ${CA_DIR}/ca.key -out ${CA_DIR}/ca.crt -days 365 -subj "/CN=Shared CA"
  echo "✅ CA created"
else
  echo "✅ CA already exists"
fi

if [ "$TYPE" == "client" ]; then
  for CN in "${NODES[@]}"; do
    mkdir -p /ssl/${CN}
    openssl genrsa -out /ssl/${CN}/${CN}.key 4096
    openssl req -new -key /ssl/${CN}/${CN}.key -out /ssl/${CN}/${CN}.csr -subj "/CN=${CN}"
    openssl x509 -req -in /ssl/${CN}/${CN}.csr -CA ${CA_DIR}/ca.crt -CAkey ${CA_DIR}/ca.key -CAcreateserial -out /ssl/${CN}/${CN}.crt -days 365
  done
elif [ "$TYPE" == "grpc" ]; then
  echo "🛜 Generation gRPC ssl"
  for CN in "${NODES[@]}"; do
    mkdir -p /ssl/${CN}
    openssl genrsa -out /ssl/${CN}/${CN}.key 4096
    openssl req -new -key /ssl/${CN}/${CN}.key -out /ssl/${CN}/${CN}.csr -subj "/CN=${CN}"
    openssl x509 -req -extfile <(printf "subjectAltName=DNS:${CN}") \
      -days 365 \
      -in /ssl/${CN}/${CN}.csr -CA ${CA_DIR}/ca.crt -CAkey ${CA_DIR}/ca.key -CAcreateserial -out /ssl/${CN}/${CN}.crt
  done
  echo "✅ gRPC created"
fi