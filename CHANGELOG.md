# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.0.1-SNAPSHOT] - 10 October 2019
### Added
- ONAP portal SDK 2.4.0 is used
- 'ARCPORTAL-SDK-APP' sub-project has been created. All the ARC portal functionality is located in that sub-project
- Edge sites are retrieved and displayed
- HTTPS with self signed certificates
- Redirection of all HTTP requests to the corresponding HTTPS resource
- Default Tomcat page is being bypassed
- Support of AES PKCS#5 for encrypting/decrypting passwords in database
- Prevent XSS attacks
- The user can define whether the UI can trust all SSL certificates or not.
- The mysql user name can be configured.
- Fix of ONAP portal SDK bugs regarding login password ignorance and redirection to ONAP portal
- Contact us URL has been set to null
- 'akraino' database has been renamed to 'akraino_bluvalui'

### Changed
- 'epsdk-app-os' sub-project has been renamed to 'ONAP-SDK-APP'
- The html style sections of 'portal-onapsdk/ARCPORTAL-SDK-APP/src/main/webapp/app/ARCPortal/EdgeSites/EdgeSitesTemplate.html' and 'portal-onapsdk/ARCPORTAL-SDK-APP/src/main/webapp/app/ARCPortal/EdgeSites/CreateEdgeSite/CreateEdgeSiteModal.html' have been placed in separate files under the 'portal-onapsdk/ARCPORTAL-SDK-APP/src/main/webapp/app/css' folder.

### Removed

## [0.0.2-SNAPSHOT] - 06 December 2019
### Added
- Creation of Edge Sites is supported
- Sanity checks for excluding occupied slots and units
- A new file, namely 'ONAP-SDK-APP/arcportal-docker-assembly.xml' has been created which defines the assembly process of the ARC portal docker image
- The user can define a port for exposing ARC portal functionality on the host machine
- ARC portal can handle nodes and hardware in which the rack location information is missing

### Changed
- The files 'server.xml' and index.jsp are embedded inside the ARC portal docker image during build stage
- All static strings are defined in a static library, namely 'org.akraino.portal_user_interface.arcportalsdkapp.util.Consts.java'
- README.rst syntax errors have been fixed

### Removed
