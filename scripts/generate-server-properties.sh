#!/bin/bash

BROKERS=("kafka1" "kafka2" "kafka3")
BASE_DIR=./infra

for i in "${!BROKERS[@]}"; do
  BROKER="${BROKERS[$i]}"
  ID=$((i + 1))
  CONFIG_DIR="${BASE_DIR}/${BROKER}/config"
  mkdir -p "${CONFIG_DIR}"
  echo "🛜 Generating server.properties for ${BROKER}"

  cat > "${CONFIG_DIR}/server.properties" << EOF
broker.id=${ID}
zookeeper.connect=zookeeper:2181
listeners=SSL://0.0.0.0:9092
advertised.listeners=SSL://${BROKER}:9092
security.inter.broker.protocol=SSL
ssl.client.auth=required

ssl.keystore.location=/ssl/${BROKER}/${BROKER}.keystore.jks
ssl.keystore.password=${PASSWORD}
ssl.key.password=${PASSWORD}
ssl.truststore.location=/ssl/${BROKER}/${BROKER}.truststore.jks
ssl.truststore.password=${PASSWORD}

auto.create.topics.enable=false
EOF

  echo "✅ ${CONFIG_DIR}/server.properties created"
done