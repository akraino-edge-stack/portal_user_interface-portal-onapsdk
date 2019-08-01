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

# Container name
CONTAINER_NAME="akraino-portal-onapsdk-arcportal"
# Image data
REGISTRY=akraino
NAME=portal-onapsdk
TAG_PRE=arcportal
TAG_VER=latest
# Container input parameters
MARIADB_ROOT_PASSWORD=""
DB_IP_PORT=""
HOST_PORT="8080"
ARC_URL=""
ARC_PROXY=""
ARC_USER=""
ARC_PASSWORD=""

for ARGUMENT in "$@"
do
    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)
    case "$KEY" in
            REGISTRY)              REGISTRY=${VALUE} ;;
            NAME)    NAME=${VALUE} ;;
            TAG_PRE)    TAG_PRE=${VALUE} ;;
            TAG_VER)    TAG_VER=${VALUE} ;;
            MARIADB_ROOT_PASSWORD)    MARIADB_ROOT_PASSWORD=${VALUE} ;;
            DB_IP_PORT)    DB_IP_PORT=${VALUE} ;;
            CONTAINER_NAME)    CONTAINER_NAME=${VALUE} ;;
            HOST_PORT)    HOST_PORT=${VALUE} ;;
            ARC_URL)    ARC_URL=${VALUE} ;;
            ARC_PROXY)    ARC_PROXY=${VALUE} ;;
            ARC_USER)    ARC_USER=${VALUE} ;;
            ARC_PASSWORD)    ARC_PASSWORD=${VALUE} ;;
            *)
    esac
done

if [ -z "$DB_IP_PORT" ]
  then
    echo "ERROR: You must specify the database connection ip and port"
    exit 1
fi

if [ -z "$MARIADB_ROOT_PASSWORD" ]
  then
    echo "ERROR: You must specify the mariadb root user password"
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

IMAGE="$REGISTRY"/"$NAME":"$TAG_PRE"-"$TAG_VER"
docker run --detach --name $CONTAINER_NAME -p:$HOST_PORT:8080 -e DB_IP_PORT="$DB_IP_PORT" -e MARIADB_ROOT_PASSWORD="$MARIADB_ROOT_PASSWORD" -e ARC_URL="$ARC_URL" -e ARC_PROXY="$ARC_PROXY" -e ARC_USER="$ARC_USER" -e ARC_PASSWORD="$ARC_PASSWORD" $IMAGE
sleep 10
