-- ---------------------------------------------------------------------------------------------------------------
-- This script populates tables in the OPEN-SOURCE version 2.1.0 of the ECOMP SDK application database.
-- The DML COMMON script must be executed first!
-- ---------------------------------------------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS=1;
USE akraino_arcportal;

-- fn_menu
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (1, 'Root', NULL, 10, NULL, 'menu_home', 'N', NULL, NULL, NULL, NULL, 'APP', 'N', NULL); --  we need even though it's inactive
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (5000, 'Sample Pages', 1, 30, 'sample.htm', 'menu_sample', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-documents-book');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (2, 'Home', 1, 10, 'welcome', 'menu_home', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-building-home');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (8, 'Reports', 1, 40, 'report.htm', 'menu_reports', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-misc-piechart');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (9, 'Profile', 1, 90, 'userProfile', 'menu_profile', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-people-oneperson');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (10, 'Admin', 1, 110, 'role_list.htm', 'menu_admin', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-content-star');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (84, 'All Reports', 8, 50, 'report', 'menu_reports', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/reports.png');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) values (87, 'Create Reports', 8, 120, 'report#/report_wizard', 'menu_reports', 'Y', NULL, 'r_action=report.create', NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) values (88, 'Sample Dashboard', 8, 130, 'report_dashboard', 'menu_reports', 'N', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (89, 'Import', 8, 140, 'report#/report_import', 'menu_reports', 'N', null, null, null, null, 'APP', 'N', null);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (94, 'Self', 9, 40,'userProfile#/self_profile', 'menu_profile', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/profile.png');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (101, 'Roles', 10, 20, 'admin#/admin', 'menu_admin', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/users.png');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (102, 'Role Functions', 10, 30, 'admin#/role_function_list', 'menu_admin', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (105, 'Cache Admin', 10, 40, 'admin#/jcs_admin', 'menu_admin', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/cache.png');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (108, 'Usage', 10, 80, 'admin#/usage_list', 'menu_admin', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/users.png');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (121, 'Collaboration', 5000, 100, 'samplePage#/collaborate_list', 'menu_sample', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/bubble.png');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (930, 'Search', 9, 15, 'userProfile', 'menu_admin', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/search_profile.png');
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (150022, 'Menus', 10, 60, 'admin#/admin_menu_edit', 'menu_admin', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', NULL);
INSERT INTO fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (150038,'Notebook',5000,135,'samplePage#/notebook','menu_sample','Y',NULL,NULL,NULL,NULL,'APP','N',NULL);
insert into fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (21, 'Edge Sites', 1, 10, 'edgesites', 'menu_tab', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-building-home');
insert into fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (22, 'Resources', 1, 10, 'report.html', 'menu_tab', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', 'icon-building-home');
insert into fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (23, 'PODs', 22, 10, 'pods', 'menu_tab', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/reports.png');
insert into fn_menu (MENU_ID, LABEL, PARENT_ID, SORT_ORDER, ACTION, FUNCTION_CD, ACTIVE_YN, SERVLET, QUERY_STRING, EXTERNAL_URL, TARGET, MENU_SET_CD, SEPARATOR_YN, IMAGE_SRC) VALUES (24, 'Blueprints', 22, 10, 'blueprints', 'menu_tab', 'Y', NULL, NULL, NULL, NULL, 'APP', 'N', '/static/fusion/images/reports.png');


-- fn_user
Insert into fn_user (USER_ID,ORG_ID,MANAGER_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE,FAX,CELLULAR,EMAIL,ADDRESS_ID,ALERT_METHOD_CD,HRID,ORG_USER_ID,ORG_CODE,LOGIN_ID,LOGIN_PWD,LAST_LOGIN_DATE,ACTIVE_YN,CREATED_ID,CREATED_DATE,MODIFIED_ID,MODIFIED_DATE,IS_INTERNAL_YN,ADDRESS_LINE_1,ADDRESS_LINE_2,CITY,STATE_CD,ZIP_CODE,COUNTRY_CD,LOCATION_CLLI,ORG_MANAGER_USERID,COMPANY,DEPARTMENT_NAME,JOB_TITLE,TIMEZONE,DEPARTMENT,BUSINESS_UNIT,BUSINESS_UNIT_NAME,COST_CENTER,FIN_LOC_CODE,SILO_STATUS) values (1,null,null,'admin',null,'User',null,null,null,'admin@email.com',null,null,null,'admin',null,'admin','admin_password',str_to_date('24-OCT-16','%d-%M-%Y'),'Y',null,str_to_date('17-OCT-16','%d-%M-%Y'),1,str_to_date('24-OCT-16','%d-%M-%Y'),'N',null,null,null,'NJ',null,'US',null,null,null,null,null,10,null,null,null,null,null,null);


-- fn_app
Insert into fn_app (APP_ID,APP_NAME,APP_IMAGE_URL,APP_DESCRIPTION,APP_NOTES,APP_URL,APP_ALTERNATE_URL,APP_REST_ENDPOINT,ML_APP_NAME,ML_APP_ADMIN_ID,MOTS_ID,APP_PASSWORD,OPEN,ENABLED,THUMBNAIL,APP_USERNAME,UEB_KEY,UEB_SECRET,UEB_TOPIC_NAME) VALUES (1,'Default',null,'Some Default Description','Some Default Note',null,null,null,'ECPP','?','1','JuCerIRKt/faEcx8QdgncLEEv+IOZjpHe7Pi5DEPqKs=','N','N',null,'Default',null,null,'ECOMP-PORTAL-INBOX');

-- fn_user_role
Insert into fn_user_role (USER_ID,ROLE_ID,PRIORITY,APP_ID) values (1,1,null,1);

commit;
