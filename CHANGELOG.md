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

## [0.0.3-SNAPSHOT] - 18 December 2019
### Added
- Blueprint page is supported

### Changed
- The bug in free slot calculation algorithm has been fixed
- Service functions have been moved from CreateEdgeSiteController.js to CreateEdgeSite.Service.js
- The version of Jackson has been updated to 2.9.9

### Removed

## [0.0.4-SNAPSHOT] - 24 January 2020
### Added
- POD page is supported
- POD and Blueprint data is supported in Edge Site page
- Sanity checks for unique names
- The uuids are translated into names in confirmation messages
- Cancel button in 'upload Blueprint' page
- ATT fonts are included in the war file
- The user is notified in case of regional controller connectivity issues
- Graphical representation of nodes in racks
- Various js and css from the Internet have been added to the source code

### Changed
- Only one hardware profile is required for finding the appropriate edge sites
- Modal popups width is set to 1000
- When a complete POD configuration file is used, there is no need for all data fields to be defined in 'create POD' page
- Cookie domain has been removed
- ResponseEntinty in MVC controllers has been parameterized

### Removed

## [0.1.0-SNAPSHOT] - 28 January 2020
### Added

### Changed
- The building and deployment procedures have been modified in order to be aligned with CI/CD requirements.

### Removed

## [0.1.1-SNAPSHOT] - 31 January 2020
### Added
- The status of each POD is displayed in the POD page as well.
- Upload button has been added in the 'Upload Blueprint Page'.

### Changed
- All the uuids of error messages are converted to the corresponding names.

### Removed
- The 'ETE Testing' and 'RIC XApps' pages have been removed.

## [0.1.2-SNAPSHOT] - 04 February 2020
### Added

### Changed
- Execute permission has been assigned to all shell scripts.

### Removed

## [0.1.3-SNAPSHOT] - 05 February 2020
### Added

### Changed

### Removed
- The maven 'deploy' build lifecycle has been removed.

## [0.1.4-SNAPSHOT] - 07 February 2020
### Added

### Changed
- The command that creates the hard link is modified to also rename the war file in order for the correct URL to be used.

### Removed

## [0.1.5-SNAPSHOT] - 13 February 2020
### Added

### Changed
- The node representation in POD page is enhanced by using scalable vector graphics (svg)

### Removed
