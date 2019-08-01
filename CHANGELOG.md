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