#!/bin/bash
set -euo pipefail
: "${LAN_IP:?Export LAN_IP before running}"
: "${INTERNAL_NAME:=studyia.escolamobile.com.br}"
cd "$(dirname "$0")/.."
mkdir -p certs
if [ -e certs/ca.key ] || [ -e certs/server.key ]; then
  echo 'Certificates already exist. Preserve the existing CA and keys.' >&2
  exit 1
fi
umask 077
openssl req -x509 -newkey rsa:3072 -nodes -sha256 -days 3650 \
  -keyout certs/ca.key -out certs/ca.crt -subj '/CN=StudyIA Internal CA' \
  -addext 'basicConstraints=critical,CA:TRUE' \
  -addext 'keyUsage=critical,keyCertSign,cRLSign'
openssl req -new -newkey rsa:3072 -nodes -sha256 \
  -keyout certs/server.key -out certs/server.csr -subj "/CN=$INTERNAL_NAME"
printf 'subjectAltName=DNS:%s,DNS:db,IP:%s\nbasicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\nextendedKeyUsage=serverAuth\n' \
  "$INTERNAL_NAME" "$LAN_IP" > certs/server.ext
openssl x509 -req -in certs/server.csr -CA certs/ca.crt -CAkey certs/ca.key \
  -CAcreateserial -out certs/server.crt -days 365 -sha256 -extfile certs/server.ext
chmod 644 certs/ca.crt certs/server.crt
echo 'Trust ca.crt on client devices. Never distribute ca.key or server.key.'
