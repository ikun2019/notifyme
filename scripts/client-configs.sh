#!/bin/bash
BROKERS=("kafka1" "kafka2" "kafka3")
BASE_DIR=./ssl

for BROKER in "${BROKERS[@]}"; do
  CONFIG_PATH="${BASE_DIR}/${BROKER}/client-ssl.properties"
  echo "🛜 Generating ${CONFIG_PATH}"
  mkdir -p ${BASE_DIR}/${BROKER}
  cat > "${CONFIG_PATH}" <<EOF
security.protocol=SSL
ssl.truststore.location=/ssl/${BROKER}/${BROKER}.truststore.jks
ssl.truststore.password=${PASSWORD}
ssl.keystore.location=/ssl/${BROKER}/${BROKER}.keystore.jks
ssl.keystore.password=${PASSWORD}
ssl.key.password=${PASSWORD}
EOF
  echo "✅ ${CONFIG_PATH} created"
done