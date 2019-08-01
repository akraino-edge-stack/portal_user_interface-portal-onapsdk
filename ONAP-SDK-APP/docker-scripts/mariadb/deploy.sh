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

# Use this script if the persistent storage does not exist

set -ex

DOCKER_VOLUME_NAME="akraino-portal-onapsdk-mariadb"
# Container name
CONTAINER_NAME="akraino-portal-onapsdk-mariadb"
# Container input variables
MARIADB_ROOT_PASSWORD=""
MARIADB_USER="akraino"
MARIADB_PASSWORD=""
# Image data
REGISTRY=akraino
NAME=portal-onapsdk
TAG_PRE=mariadb
TAG_VER=latest

while [ $# -gt 0 ]; do
   if [[ $1 == *"--"* ]]; then
        v="${1/--/}"
        declare $v="$2"
   fi
   shift
done

if [ -z "$MARIADB_ROOT_PASSWORD" ]
  then
    echo "ERROR: You must specify the mariadb database root password"
    exit 1
fi

if [ -z "$MARIADB_PASSWORD" ]
  then
    echo "ERROR: You must specify the mariadb database user password"
    exit 1
fi

IMAGE="$REGISTRY"/"$NAME":"$TAG_PRE"-"$TAG_VER"
chmod 0444 "/$(pwd)/mariadb.conf"
docker run --detach --name $CONTAINER_NAME -v $DOCKER_VOLUME_NAME:/var/lib/mysql -v "$(pwd)/mariadb.conf:/etc/mysql/conf.d/my.cnf" -e MYSQL_ROOT_PASSWORD="$MARIADB_ROOT_PASSWORD" -e MYSQL_DATABASE="akraino_arcportal" -e MYSQL_USER="$MARIADB_USER" -e MYSQL_PASSWORD="$MARIADB_PASSWORD" $IMAGE
sleep 10

