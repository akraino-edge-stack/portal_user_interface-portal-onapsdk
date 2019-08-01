#!/bin/bash
#
# Copyright (c) 2019 AT&T Intellectual Property.  All other rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -ex

# Container name
CONTAINER_NAME="akraino-portal-onapsdk-arcportal"
# Image data
REGISTRY=akraino
NAME=portal-onapsdk
TAG_PRE=arcportal
TAG_VER=latest
# Container input parameters
MARIADB_USER="akraino"
MARIADB_PASSWORD=""
DB_IP_PORT=""
ARC_URL=""
ARC_PROXY=""
ARC_USER=""
ARC_PASSWORD=""
CERTDIR=$(pwd)
ENCRYPTION_KEY=""
ARCPORTAL_ADMIN_PASSWORD=""
TRUST_ALL="false"

while [ $# -gt 0 ]; do
   if [[ $1 == *"--"* ]]; then
        v="${1/--/}"
        declare $v="$2"
   fi
   shift
done

if [ -z "$DB_IP_PORT" ]
  then
    echo "ERROR: You must specify the database connection ip and port"
    exit 1
fi

if [ -z "$MARIADB_PASSWORD" ]
  then
    echo "ERROR: You must specify the mariadb user password"
    exit 1
fi

if [ -z "$ARC_URL" ]
  then
    echo "ERROR: You must specify the regional controller url"
    exit 1
fi

if [ -z "$ARC_USER" ]
  then
    echo "ERROR: You must specify the regional controller user name"
    exit 1
fi

if [ -z "$ARC_PASSWORD" ]
  then
    echo "ERROR: You must specify the regional controller user password"
    exit 1
fi

if [ -z "$ENCRYPTION_KEY" ]
  then
    echo "ERROR: You must specify the encryption key"
    exit 1
fi

if [ -z "$ARCPORTAL_ADMIN_PASSWORD" ]
  then
    echo "ERROR: You must specify the UI admin password"
    exit 1
fi

echo "Note: If there is a password already stored in database, the supplied ARCPORTAL_ADMIN_PASSWORD will be ignored."

IMAGE="$REGISTRY"/"$NAME":"$TAG_PRE"-"$TAG_VER"
docker run --detach --name $CONTAINER_NAME -v "$(pwd)/server.xml:/usr/local/tomcat/conf/server.xml" -v "$CERTDIR/arcportal.key:/usr/local/tomcat/arcportal.key" -v "$CERTDIR/arcportal.crt:/usr/local/tomcat/arcportal.crt" -v "$(pwd)/root_index.jsp:/usr/local/tomcat/webapps/ROOT/index.jsp" -e DB_IP_PORT="$DB_IP_PORT" -e MARIADB_USER="$MARIADB_USER" -e MARIADB_PASSWORD="$MARIADB_PASSWORD" -e ARC_URL="$ARC_URL" -e ARC_PROXY="$ARC_PROXY" -e ARC_USER="$ARC_USER" -e ARC_PASSWORD="$ARC_PASSWORD" -e ENCRYPTION_KEY="$ENCRYPTION_KEY" -e ARCPORTAL_ADMIN_PASSWORD="$ARCPORTAL_ADMIN_PASSWORD" -e TRUST_ALL="$TRUST_ALL" $IMAGE
sleep 10
