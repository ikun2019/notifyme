#!/bin/bash

TYPE=$1
shift
NODES=("$@")
CA_DIR=/ssl/ca

mkdir -p ${CA_DIR}

# 自己署名認証局の作成
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
elif [ "$TYPE" == "broker" ]; then
  for CN in "${NODES[@]}"; do
    mkdir -p /ssl/${CN}
    openssl genrsa -out /ssl/${CN}/${CN}.key 4096
    openssl req -new -key /ssl/${CN}/${CN}.key -out /ssl/${CN}/${CN}.csr -subj "/CN=${CN}"
    openssl x509 -req -in /ssl/${CN}/${CN}.csr -CA ${CA_DIR}/ca.crt -CAkey ${CA_DIR}/ca.key -CAcreateserial -out /ssl/${CN}/${CN}.crt -days 365 -sha256 -extfile <(printf "subjectAltName=DNS:${CN}")
    echo "✅ Kafka証明書の作成完了"
  # pkcs12に変更
    openssl pkcs12 -export \
      -in /ssl/${CN}/${CN}.crt \
      -inkey /ssl/${CN}/${CN}.key \
      -out /ssl/${CN}/${CN}.p12 \
      -name kafka-broker \
      -CAfile ${CA_DIR}/ca.crt \
      -caname root \
      -passout pass:${PASSWORD}
    # JKSに変換
    keytool -importkeystore \
      -destkeystore /ssl/${CN}/${CN}.keystore.jks \
      -deststorepass ${PASSWORD} \
      -destkeypass ${PASSWORD} \
      -srckeystore /ssl/${CN}/${CN}.p12 \
      -srcstoretype PKCS12 \
      -srcstorepass ${PASSWORD} \
      -alias kafka-broker \
      -noprompt
    # CA証明書の変換
    keytool -import -trustcacerts -noprompt \
      -alias CARoot \
      -file ${CA_DIR}/ca.crt \
      -keystore /ssl/${CN}/${CN}.truststore.jks \
      -storepass ${PASSWORD}
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