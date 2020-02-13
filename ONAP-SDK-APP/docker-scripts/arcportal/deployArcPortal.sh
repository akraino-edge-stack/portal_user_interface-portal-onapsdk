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

# Containers names
CON_NAME_ARC_PORTAL="arc_portal"
CON_NAME_ARC_PORTAL_MARIADB="arc_portal_mariadb"
# Images data
REGISTRY=nexus3.akraino.org:10003
IMAGE_NAME_ARC_PORTAL="akraino/arc_portal"
IMAGE_NAME_ARC_PORTAL_MARIADB="akraino/arc_portal_mariadb"
TAG_VER='0.1.5-SNAPSHOT'
# ARC Portal Container parameters
MARIADB_USER="akraino"
MARIADB_PASSWORD=""
ARC_URL=""
ARC_PROXY=""
ARC_USER=""
ARC_PASSWORD=""
CERTDIR=$(pwd)
ENCRYPTION_KEY=""
ARCPORTAL_ADMIN_PASSWORD=""
TRUST_ALL="false"
HOST_PORT="10000"
# MariaDB Container parameters
DOCKER_VOLUME_NAME="arc_portal_mariadb"
MARIADB_ROOT_PASSWORD=""

while [ $# -gt 0 ]; do
   if [[ $1 == *"--"* ]]; then
        v="${1/--/}"
        declare $v="$2"
   fi
   shift
done

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

if [ -z "$MARIADB_ROOT_PASSWORD" ]
  then
    echo "ERROR: You must specify the mariadb database root password"
    exit 1
fi

IMAGE_ARC_PORTAL_MARIADB="$REGISTRY"/"$IMAGE_NAME_ARC_PORTAL_MARIADB":"$TAG_VER"
docker run --detach --name $CON_NAME_ARC_PORTAL_MARIADB -v $DOCKER_VOLUME_NAME:/var/lib/mysql \
    --env MYSQL_ROOT_PASSWORD="$MARIADB_ROOT_PASSWORD" \
    --env MYSQL_DATABASE="akraino_arcportal" \
    --env MYSQL_USER="$MARIADB_USER" \
    --env MYSQL_PASSWORD="$MARIADB_PASSWORD" $IMAGE_ARC_PORTAL_MARIADB
sleep 10
IP_ARC_PORTAL_MARIADB=`docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $CON_NAME_ARC_PORTAL_MARIADB`

IMAGE_ARC_PORTAL="$REGISTRY"/"$IMAGE_NAME_ARC_PORTAL":"$TAG_VER"
docker run --detach --name $CON_NAME_ARC_PORTAL -p $HOST_PORT:443 -v "$CERTDIR/arcportal.key:/usr/local/tomcat/arcportal.key" -v "$CERTDIR/arcportal.crt:/usr/local/tomcat/arcportal.crt" \
    --env DB_IP_PORT="$IP_ARC_PORTAL_MARIADB:3306" \
    --env MARIADB_USER="$MARIADB_USER" \
    --env MARIADB_PASSWORD="$MARIADB_PASSWORD" \
    --env ARC_URL="$ARC_URL" \
    --env ARC_PROXY="$ARC_PROXY" \
    --env ARC_USER="$ARC_USER" \
    --env ARC_PASSWORD="$ARC_PASSWORD" \
    --env ENCRYPTION_KEY="$ENCRYPTION_KEY" \
    --env ARCPORTAL_ADMIN_PASSWORD="$ARCPORTAL_ADMIN_PASSWORD" \
    --env TRUST_ALL="$TRUST_ALL" $IMAGE_ARC_PORTAL
sleep 10
