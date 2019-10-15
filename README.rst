
Akraino Regional Controller Portal
==================================

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

The portal-onapsdk/ONAP-SDK-APP/pom.xml file supports the creation of an appropriate docker image for development purposes. The initialization scripts reside under the portal-onapsdk/ONAP-SDK-APP/db-scripts directory.

Also, a script has been developed, namely portal-onapsdk/ONAP-SDK-APP/docker-scripts/mariadb/deploy.sh which easily deploys the container. This script accepts the following items as input parameters:

CONTAINER_NAME, name of the container, default value is akraino-portal-onapsdk-mariadb
MARIADB_ROOT_PASSWORD, the desired mariadb root user password, this variable is required
MARIADB_USER, the mariadb user, the default value is 'akraino'
MARIADB_PASSWORD, the desired mariadb user password, this variable is required
REGISTRY, registry of the mariadb image, default value is akraino
NAME, name of the mariadb image, default value is portal-onapsdk
TAG_PRE, first part of the image version, default value is mariadb
TAG_VER, last part of the image version, default value is latest

In order to build and deploy the image using only the required parameters, the below instructions should be followed:

The mariadb root password and the mariadb user password (currently the ARC portal connects to the database using the akraino user) should be configured using the appropriate variables and the following commands should be executed (the user should override default variables based on requirements):

.. code-block:: console

    cd portal-onapsdk
    mvn -f ./ONAP-SDK-APP/ docker:build -Ddocker.filter=akraino/portal-onapsdk:dev-mariadb-latest
    cd ONAP-SDK-APP/docker-scripts/mariadb
    ./deploy.sh --TAG_PRE dev-mariadb --MARIADB_ROOT_PASSWORD <mariadb root user password> --MARIADB_PASSWORD <mariadb akraino user password>

In order to retrieve the IP of the mariadb container, the following command should be executed:

.. code-block:: console

    docker inspect <name of the mariadb container>

Furthermore, the TAG_PRE variable should be defined because the default value is 'mariadb' (note that the 'dev-mariadb' is used for development purposes - look at pom.xml file).

If the database must be re-deployed (it is assumed that the corresponding mariadb container has been stopped and deleted) while the persistent storage already exists (currently, the 'akraino-portal-onapsdk-mariadb' docker volume is used), a different approach should be used after the image building process.

To this end, another script has been developed, namely portal-onapsdk/docker-scripts/mariadb/deploy_with_existing_storage.sh which easily deploys the container. This script accepts the following as input parameters:

CONTAINER_NAME, the name of the container, default value is akraino-portal-onapsdk-mariadb
REGISTRY, the registry of the mariadb image, default value is akraino
NAME, the name of the mariadb image, default value is portal-onapsdk
TAG_PRE, the first part of the image version, default value is mariadb
TAG_VER, the last part of the image version, default value is latest

In order to deploy the image using only the required parameters and the existing persistent storage, the below instructions should be followed:

In order to deploy the image using only the required parameters and the existing persistent storage, the below instructions should be followed (the user should override the default variables based on the requirements):

.. code-block:: console

    cd portal-onapsdk/docker-scripts/mariadb
    ./deploy_with_existing_persistent_storage.sh --TAG_PRE dev-mariadb

Finally, if the database must be re-deployed (it is assumed that the corresponding mariadb container has been stopped and deleted) and the old persistent storage must be deleted, the used docker volume should be first deleted (note that all database's data will be lost).

To this end, after the image build process, the following commands should be executed (the user should override the default variables based on the requirements):

.. code-block:: console

    docker volume rm akraino-portal-onapsdk-mariadb
    cd portal-onapsdk/docker-scripts/mariadb
    ./deploy.sh --TAG_PRE dev-mariadb --MARIADB_ROOT_PASSWORD <mariadb root user password> --MARIADB_PASSWORD <mariadb akraino user password>

Compiling
~~~~~~~~~

.. code-block:: console

    cd portal-onapsdk
    mvn clean install

Deploying
~~~~~~~~~

The portal-onapsdk/ONAP-SDK-APP/pom.xml file supports the building of an appropriate ARC portal container image using the produced war file. Also, a script has been developed, namely portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal/deploy.sh which easily deploys the container.

This script accepts the following as input parameters:

CONTAINER_NAME, the name of the container, default value is akraino-portal-onapsdk-arcportal
DB_IP_PORT, the IP and port of the mariadb instance, this variable is required
MARIADB_USER, the mariadb user, the default value is 'akraino'
MARIADB_PASSWORD, the mariadb user password, this variable is required
REGISTRY, the registry of the ARC portal image, default value is akraino
NAME, the name of the ARC portal image, default value is portal-onapsdk
TAG_PRE, the first part of the image version, default value is arcportal
TAG_VER, the last part of the image version, default value is latest
ARC_URL, the URL of the ARC, this variable is required
ARC_PROXY, the proxy needed in order for the ARC to be reachable, default value is none
ARC_USER, the user of the ARC, this variable is required
ARC_PASSWORD, the password of the ARC user, this variable is required
CERTDIR, the directory where the SSL certificates can be found, default value is the working directory where self signed certificates exist only for demo purposes
ENCRYPTION_KEY, the key that should be used by the AES algorithm for encrypting passwords stored in database, this variable is required
ARCPORTAL_ADMIN_PASSWORD, the desired ARC portal password for the admin user, this variable is required
TRUST_ALL, the variable that defines whether the ARC portal should trust all certificates or not, default value is false
HOST_PORT, port of the hosting OS that will be used for exposing https port (i.e. 443) of the ARC portal container, default value is 10000

So, for a functional ARC portal, the following prerequisites are needed:

- The mariadb container in up and running state
- The Akraino Regional Controller in up and running state

Then, the following commands can be executed in order to build and deploy the ARC portal container (the user should override the default variables based on requirements):

.. code-block:: console

    cd portal-onapsdk
    mvn -f ./ONAP-SDK-APP/ docker:build -Ddocker.filter=akraino/portal-onapsdk:dev-arcportal-latest
    cd ONAP-SDK-APP/docker-scripts/arcportal
    ./deploy.sh --TAG_PRE dev-arcportal --DB_IP_PORT <IP and port of the mariadb> --MARIADB_PASSWORD <mariadb akraino password> --ENCRYPTION_KEY <encryption key> --ARCPORTAL_ADMIN_PASSWORD <ARC portal admin user password> --ARC_URL <ARC URL> --ARC_USER <ARC user> --ARC_PASSWORD <ARC password> --ARC_PROXY <Proxy for reaching ARC>

The contents of the DB_IP_PORT, encryption key and ARC_URL can be for example '172.17.0.3:3306', 'AGADdG4D04BKm2IxIWEr8o==' and 'https://10.0.2.15:443', respectively.

Currently, one user is supported by the ARC portal, namely admin (full privileges). Its password is initialized during ARC portal. Currently, the creation/modification of users using the ARC portal is not supported.

Furthermore, the TAG_PRE variable should be defined as the default value is 'arcportal' (note that the 'dev-arcportal' is used for development purposes - look at pom.xml file).

If no proxy exists, the ARC_PROXY variable should not be defined.

The ARC portal should be available in the following url:

    https://<IP of the ARC portal container>/

As far as the SSL certificates are concerned, self-signed built-in certificates exist in the 'portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal/' directory which are used by default. It should be noted that these
certificates should be used only for demo purposes. If a user wants to use different ones which are more appropriate for a production environment, the directory that contains these new
certificates must be defined using the 'CERTDIR' parameter of the 'portal-onapsdk/ONAP-SDK-APP/docker-scripts/deploy.sh' script. It should be noted that the certificates must have specific names, that are 'bluval.crt'
and 'bluval.key' for the certificate and the key respectively.

User's guide
-----------------

TBD

Limitations
-----------

TBD