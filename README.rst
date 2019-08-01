
Akraino Regional Controller Portal
========

Introduction
------------

TBD

Scope
-----

TBD

Prerequisites:
~~~~~~~~~~~~~~

In order for the ARC portal to be functional, the following items are taken for granted:

- An appropriate mariadb instance is up and running (look at the Database subsection).

Developer's guide
-----------------

Download the project
~~~~~~~~~~~~~~~~~~~~

.. code-block:: console

    git clone "https://gerrit.akraino.org/r/portal_user_interface/portal-onapsdk"


Prerequisites
~~~~~~~~~~~~~

- Tools

In order to setup the development environment, the following tools are needed:
- JDK 1.8
- Maven
- docker

Execute the commands below in order to install these tools (note that the PROXY_IP and PROXY_PORT variables must be substituted with the ones that are used by the hosting operating system)

If the host is behind a proxy, define this proxy using the following commands:

.. code-block:: console
    sudo touch /etc/apt/apt.conf.d/proxy.conf
    sudo sh -c 'echo "Acquire::http::proxy \"http://<PROXY_IP>:<PROXY_PORT>/\";" >> /etc/apt/apt.conf.d/proxy.conf'
    sudo sh -c 'echo "Acquire::https::proxy \"https://<PROXY_IP>:<PROXY_PORT>/\";" >> /etc/apt/apt.conf.d/proxy.conf'
    sudo sh -c 'echo "Acquire::ftp::proxy \"ftp://<PROXY_IP>:<PROXY_PORT>/\";" >> /etc/apt/apt.conf.d/proxy.conf'
    sudo apt-get update
    export http_proxy=http://<PROXY_IP>:<PROXY_PORT>
    export https_proxy=http://<PROXY_IP>:<PROXY_PORT>

Install jdk and maven using the following commands:

.. code-block:: console
    sudo apt install default-jdk
    sudo apt install maven

If the host is behind a proxy, configure this proxy for maven:

.. code-block:: console
    nano ~/.m2/settings.xml
    <Paste the following lines>

    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
     <proxies>
      <proxy>
       <active>true</active>
       <protocol>http</protocol>
       <host><PROXY_IP></host>
       <port><PROXY_PORT></port>
       <nonProxyHosts>127.0.0.1|localhost</nonProxyHosts>
      </proxy>
      <proxy>
       <id>https</id>
       <active>true</active>
       <protocol>https</protocol>
       <host><PROXY_IP></host>
       <port><PROXY_PORT></port>
       <nonProxyHosts>127.0.0.1|localhost</nonProxyHosts>
      </proxy>
     </proxies>
    </settings>

    <Save and exit from nano>

Install docker using the following commands:

.. code-block:: console
    sudo apt install docker.io
    sudo groupadd docker
    sudo gpasswd -a $USER docker
    newgrp docker

If the host is behind a proxy, configure docker to use this proxy:

.. code-block:: console
    mkdir /etc/systemd/system/docker.service.d
    sudo nano /etc/systemd/system/docker.service.d/http-proxy.conf
    <Paste the following lines>

    [Service]
    Environment="HTTP_PROXY=http://<PROXY_IP>:<PROXY_PORT>/"

    <Save and exit from nano>

    sudo systemctl daemon-reload
    sudo systemctl restart docker

- Database

A mariadb database instance is needed with the appropriate databases and tables in order for the back-end system to store and retrieve data.

The pom.xml file supports the creation of an appropriate docker image for development purposes. The initialization scripts reside under the db-scripts directory.

Also, a script has been developed, namely portal-onapsdk/docker-scripts/mariadb/deploy.sh which easily deploys the container. This script accepts the following items as input parameters:

CONTAINER_NAME, name of the container, default value is akraino-portal-onapsdk-mariadb
MARIADB_ROOT_PASSWORD, the desired mariadb root user password, this variable is required
ARC_PORTAL_ADMIN_PASSWORD, the desired ARC portal password for the admin user, this variable is required
ARC_PORTAL_AKRAINO_PASSWORD, the desired ARC portal password for the akraino user, this variable is required
REGISTRY, registry of the mariadb image, default value is akraino
NAME, name of the mariadb image, default value is portal-onapsdk
TAG_PRE, first part of the image version, default value is mariadb
TAG_VER, last part of the image version, default value is latest
MARIADB_HOST_PORT, port on which mariadb is exposed on host, default value is 3309

Currently, two users are supported for the ARC portal, namely admin (full privileges) and akraino (limited privileges). Their passwords must be defined in the database.

In order to build and deploy the image using only the required parameters, the below instructions should be followed:

The mariadb root user password (currently the ARC portal connects to the database using root privileges), the ARC portal admin password and the ARC portal akraino password should be configured using the appropriate variables and the following commands should be executed:

.. code-block:: console

    cd portal-onapsdk
    mvn docker:build -Ddocker.filter=akraino/portal-onapsdk:dev-mariadb-latest
    cd docker-scripts/mariadb
    ./deploy.sh TAG_PRE=dev-mariadb MARIADB_ROOT_PASSWORD=<root user password> ARC_PORTAL_ADMIN_PASSWORD=<ARC portal admin user password> ARC_PORTAL_AKRAINO_PASSWORD=<ARC portal akraino user password>

In order to retrieve the IP of the mariadb container, the following command should be executed:

.. code-block:: console

    docker inspect <name of the mariadb container>

Furthermore, the TAG_PRE variable should be defined because the default value is 'mariadb' (note that the 'dev-mariadb' is used for development purposes - look at pom.xml file).

If the database must be re-deployed (it is assumed that the corresponding mariadb container has been stopped and deleted) while the persistent storage already exists (currently, the 'akraino-portal-onapsdk-mariadb' docker volume is used), a different approach should be used after the image building process.

To this end, another script has been developed, namely portal-onapsdk/docker-scripts/mariadb/deploy_with_existing_storage.sh which easily deploys the container. This script accepts the following as input parameters:

CONTAINER_NAME, the name of the container, default value is akraino-portal-onapsdk-mariadb
MARIADB_ROOT_PASSWORD, the desired mariadb root user password, this variable is required
REGISTRY, the registry of the mariadb image, default value is akraino
NAME, the name of the mariadb image, default value is portal-onapsdk
TAG_PRE, the first part of the image version, default value is mariadb
TAG_VER, the last part of the image version, default value is latest
MARIADB_HOST_PORT, the port on which mariadb is exposed on host, default value is 3309

In order to deploy the image using only the required parameters and the existing persistent storage, the below instructions should be followed:

The mariadb root user password (currently the ARC portal connects to the database using root privileges) should be configured using the appropriate variable and the following commands should be executed:

.. code-block:: console

    cd portal-onapsdk/docker-scripts/mariadb
    ./deploy_with_existing_persistent_storage.sh TAG_PRE=dev-mariadb MARIADB_ROOT_PASSWORD=<root user password>

Finally, if the database must be re-deployed (it is assumed that the corresponding mariadb container has been stopped and deleted) and the old persistent storage must be deleted, the used docker volume should be first deleted (note that all database's data will be lost).

To this end, after the image build process, the following commands should be executed:

.. code-block:: console

    docker volume rm akraino-portal-onapsdk-mariadb
    cd portal-onapsdk/docker-scripts/mariadb
    ./deploy.sh TAG_PRE=dev-mariadb MARIADB_ROOT_PASSWORD=<root user password> ARC_PORTAL_ADMIN_PASSWORD=<ARC portal admin user password> ARC_PORTAL_AKRAINO_PASSWORD=<ARC portal akraino user password>

Compiling
~~~~~~~~~

.. code-block:: console

    cd portal-onapsdk
    mvn clean package

Deploying
~~~~~~~~~

The pom.xml file supports the building of an appropriate container image using the produced war file. Also, a script has been developed, namely portal-onapsdk/docker-scripts/portal-onapsdk/deploy.sh which easily deploys the container.

This script accepts the following as input parameters:

CONTAINER_NAME, the name of the contaner, default value is akraino-portal-onapsdk-arcportal
DB_IP_PORT, the IP and port of the maridb instance, this variable is required
MARIADB_ROOT_PASSWORD, the mariadb root user password, this variable is required
HOST_PORT, the port on host machine that the ARC portal will consume, default value is 8080
REGISTRY, the registry of the mariadb image, default value is akraino
NAME, the name of the ARC portal image, default value is portal-onapsdk
TAG_PRE, the first part of the image version, default value is arcportal
TAG_VER, the last part of the image version, default value is latest
ARC_URL, the URL of the ARC, this variable is required
ARC_PROXY, the proxy needed in order for the ARC to be reachable, default value is none
ARC_USER, the user of the ARC, this variable is required
ARC_PASSWORD, the password of the ARC user, this variable is required

In order to build the image using only the required parameters, the following data is needed:

- The mariadb root user password (look at the Database subsection)
- The IP and port of the mariadb
- The URL of the ARC
- The ARC user
- The ARC user password

Then, the following commands can be executed in order to build and deploy the UI container:

.. code-block:: console

    cd portal-onapsdk
    mvn docker:build -Ddocker.filter=akraino/portal-onapsdk:dev-arcportal-latest
    cd docker-ss/portal-onapsdk
    ./deploy.sh TAG_PRE=dev-arcportal DB_IP_PORT=<IP and port of the mariadb> MARIADB_ROOT_PASSWORD=<mariadb root password> ARC_URL=<ARC URL> ARC_USER=<ARC user> ARC_PASSWORD=<ARC password>

The content of the DB_IP_PORT can be for example '172.17.0.3:3306'.

The content of the ARC_URL can be for example 'https://10.0.2.15:443'.

Furthermore, the TAG_PRE variable should be defined as the default value is 'arcportal' (note that the 'dev-arcportal' is used for development purposes - look at pom.xml file).

If no proxy exists, the ARC_PROXY variable should not be defined.

The ARC portal should be available in the following url:

    http://localhost:8080/AECARCPortal/


User's guide
-----------------

TBD

Limitations
-----------

TBD