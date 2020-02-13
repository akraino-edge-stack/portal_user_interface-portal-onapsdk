
Akraino Regional Controller Portal
==================================

Introduction
------------

TBD

Scope
-----

TBD

Database
--------

A mariadb database instance is needed with the appropriate databases and tables in order for the back-end system to store and retrieve data.

For the production mode, there is already an appropriate database image uploaded in the 'nexus3.akraino.org'.

Also, for the development mode, the portal-onapsdk/ONAP-SDK-APP/pom.xml file supports the creation of an appropriate docker image. The initialization scripts reside under the portal-onapsdk/ONAP-SDK-APP/docker/mariadb directory.

Finally, the portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal/deployArcPortal.sh script handles the deployment of this database (refer to the Appendix).

Installation / Deployment guide
-------------------------------

Prerequisites
~~~~~~~~~~~~~

- Tools

In order to setup the production environment, the following tools are needed:
- docker

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

Deployment
~~~~~~~~~~

The following commands should be executed:

.. code-block:: console

    cd portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal
    ./deployArcPortal.sh --MARIADB_ROOT_PASSWORD <desired root user password of the MariaDB> --MARIADB_PASSWORD <desired MariaDB password for the akraino user> --ENCRYPTION_KEY <desired encryption key> --ARCPORTAL_ADMIN_PASSWORD <desired admin password of the ARC portal> --ARC_URL <URL of the regional controller> --ARC_USER <user of the regional controller> --ARC_PASSWORD <user password of the regional controller> --TRUST_ALL <whether all SSL certificates should be trusted or not> --HOST_PORT <an unused port on the hosting machine>

Refer to Appendix where more details about the deployment script are explained.

The ARC portal should be available in the following url:

    https://<IP of the ARC portal container>/

It should be noted that if the user wants to use the IP of the hosting machine, the ARC portal should be available in the following url:

    https://<IP of the hosting machine>:<HOST_PORT>/

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


Compiling
~~~~~~~~~

In order to compile the project, the user should execute the following commands:

.. code-block:: console

    cd portal-onapsdk
    mvn clean install

The portal-onapsdk/ONAP-SDK-APP/pom.xml file supports the building of appropriate ARC portal and MariaDB docker images for the development mode.

For this purpose, the following commands should be executed:

.. code-block:: console

    cd portal-onapsdk
    mvn -f ./ONAP-SDK-APP/ docker:build

Deployment
~~~~~~~~~~

It should be noted that the compilation commands must be executed prior to deployment.

The following commands should be executed:

.. code-block:: console

    cd portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal
    ./deployArcPortal.sh --REGISTRY akraino-dev --TAG_VER latest --MARIADB_ROOT_PASSWORD <desired root user password of the MariaDB> --MARIADB_PASSWORD <desired MariaDB password for the akraino user> --ENCRYPTION_KEY <desired encryption key> --ARCPORTAL_ADMIN_PASSWORD <desired admin password of the ARC portal> --ARC_URL <URL of the regional controller> --ARC_USER <user of the regional controller> --ARC_PASSWORD <user password of the regional controller> --TRUST_ALL <whether all SSL certificates should be trusted or not> --HOST_PORT <an unused port on the hosting machine>

Refer to Appendix where more details about the deployment script are explained.

The ARC portal should be available in the following url:

    https://<IP of the ARC portal container>/

It should be noted that if the user wants to use the IP of the hosting machine, the ARC portal should be available in the following url:

    https://<IP of the hosting machine>:<HOST_PORT>/

Limitations
-----------

The following limitations exist:

- Currently, one user is supported by the ARC portal, namely admin (full privileges). Its password is initialized during ARC portal deployment.
- The creation/modification of users using the ARC portal is not supported.
- The redirection URL which is used in cases of session timeouts and unauthorized access can be defined only before compilation. This URL is defined by the content of the 'ecomp_redirect_url' variable
  which is stored in 'ONAP-SDK-APP/src/main/resources/portal.properties' file.

Appendix
--------

Deployment and deletion scripts
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The deployment script, namely the 'portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal/deployArcPortal.sh', handles the whole deployment of the ARC portal and MariaDB containers.

This script accepts the following as input parameters:

CON_NAME_ARC_PORTAL, the name of the ARC portal container, default value is 'arc_portal'
CON_NAME_ARC_PORTAL_MARIADB, the name of the MariaDB container, default value is 'arc_portal_mariadb'
REGISTRY, the name of the docker registry, default value is 'nexus3.akraino.org:10003'. So, the script will search in Nexus for the docker images. If the user wants to use the local built images (development mode), the content of this parameter should be 'akraino-dev'
IMAGE_NAME_ARC_PORTAL, the name of the ARC portal image, default value is 'akraino/arc_portal'
IMAGE_NAME_ARC_PORTAL, the name of the MariaDB image, default value is 'akraino/arc_portal_mariadb'
TAG_VER, the version of the image, default value is '0.1.0-SNAPSHOT'. If the user wants to use the local built images (development mode), the content of this parameter should be 'latest'
MARIADB_USER, the mariadb user, the default value is 'akraino'
MARIADB_PASSWORD, the mariadb user password, this variable is required
ARC_URL, the URL of the ARC, this variable is required
ARC_PROXY, the proxy needed in order for the ARC to be reachable, default value is none
ARC_USER, the user of the ARC, this variable is required
ARC_PASSWORD, the password of the ARC user, this variable is required
CERTDIR, the directory where the SSL certificates can be found, default value is the working directory where self signed certificates exist only for demo purposes
ENCRYPTION_KEY, the key that should be used by the AES algorithm for encrypting passwords stored in database, this variable is required
ARCPORTAL_ADMIN_PASSWORD, the desired ARC portal password for the admin user, this variable is required
TRUST_ALL, the variable that defines whether the ARC portal should trust all certificates or not, default value is false
HOST_PORT, port of the hosting OS that will be used for exposing https port (i.e. 443) of the ARC portal container (this port must not be used by another process), default value is 10000
DOCKER_VOLUME_NAME, the name of the docker volume that will be used for the MariaDB container, default value is "arc_portal_mariadb"
MARIADB_ROOT_PASSWORD, the desired value for the root password of the MariaDB, this variable is required

All the required variables must be defined by the user as input parameters in the script. The default parameters should be defined only if the user wants to change their value.

For example, the following commands can be executed if a user wants to deploy the local built images (i.e. development mode):

.. code-block:: console

    cd portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal
    ./deployArcPortal.sh --REGISTRY akraino-dev --TAG_VER latest --MARIADB_ROOT_PASSWORD abc123 --MARIADB_PASSWORD akraino123 --ENCRYPTION_KEY AGADdG4D04BKm2IxIWEr8o== --ARCPORTAL_ADMIN_PASSWORD admin --ARC_URL https://10.0.2.15:443 --ARC_USER admin --ARC_PASSWORD admin123 --TRUST_ALL true --HOST_PORT 30000

Another example would be to deploy the containers that are hosted in Nexus. To this end, the following commands should be executed:

.. code-block:: console

    cd portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal
    ./deployArcPortal.sh --MARIADB_ROOT_PASSWORD abc123 --MARIADB_PASSWORD akraino123 --ENCRYPTION_KEY AGADdG4D04BKm2IxIWEr8o== --ARCPORTAL_ADMIN_PASSWORD admin --ARC_URL https://10.0.2.15:443 --ARC_USER admin --ARC_PASSWORD admin123 --TRUST_ALL true --HOST_PORT 30000

If no proxy exists, the ARC_PROXY variable should not be defined.

Then, the ARC portal can be reached at:

    https://<IP of the ARC portal container>/

or:

    https://<IP of the hosting machine>:30000/

As far as the SSL certificates are concerned, self-signed built-in certificates exist in the 'portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal/' directory which are used by default. It should be noted that these
certificates should be used only for demo purposes. If a user wants to use different ones which are more appropriate for a production environment, the directory that contains these new
certificates must be defined using the 'CERTDIR' parameter of the 'portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal/deployArcPortal.sh' script. It should be noted that the certificates must have specific names, that are 'bluval.crt'
and 'bluval.key' for the certificate and the key respectively.

As far as the deletion process is concerned, the deletion script, namely the 'portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal/stopAndDeleteArcPortal.sh', handles the whole deletion procedure.

This script accepts the following as input parameters:

CON_NAME_ARC_PORTAL, the name of the ARC portal container, default value is 'arc_portal'
CON_NAME_ARC_PORTAL_MARIADB, the name of the MariaDB container, default value is 'arc_portal_mariadb'
DOCKER_VOLUME_NAME, the name of the docker volume used my the MariaDB, default value is 'arc_portal_mariadb'

For example, the following command can be executed if a user wants to delete the ARC portal and Mariadb containers together with the used docker volume:

.. code-block:: console

    cd portal-onapsdk/ONAP-SDK-APP/docker-scripts/arcportal
    ./stopAndDeleteArcPortal.sh
