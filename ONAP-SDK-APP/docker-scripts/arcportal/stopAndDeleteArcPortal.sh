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

set -x

# Containers names
CON_NAME_ARC_PORTAL="arc_portal"
CON_NAME_ARC_PORTAL_MARIADB="arc_portal_mariadb"

DOCKER_VOLUME_NAME="arc_portal_mariadb"

while [ $# -gt 0 ]; do
   if [[ $1 == *"--"* ]]; then
        v="${1/--/}"
        declare $v="$2"
   fi
   shift
done

docker stop $CON_NAME_ARC_PORTAL
docker rm $CON_NAME_ARC_PORTAL
docker stop $CON_NAME_ARC_PORTAL_MARIADB
docker rm $CON_NAME_ARC_PORTAL_MARIADB

if [ ! -z "$DOCKER_VOLUME_NAME" ]
  then
      docker volume rm $DOCKER_VOLUME_NAME
fi

