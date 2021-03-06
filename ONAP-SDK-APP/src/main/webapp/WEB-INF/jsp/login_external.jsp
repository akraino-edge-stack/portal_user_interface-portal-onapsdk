<%--
Copyright (c) 2019 AT&T Intellectual Property. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--%>
<%@ page import="org.onap.portalsdk.core.util.SystemProperties"%>
<!DOCTYPE html>
<%
	// Name is defined by app; do not throw if missing
	final String appDisplayName = SystemProperties.containsProperty(SystemProperties.APP_DISPLAY_NAME)
			? SystemProperties.getProperty(SystemProperties.APP_DISPLAY_NAME)
			: SystemProperties.APP_DISPLAY_NAME;
%>

<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        html {
            font-family: Verdana, Arial, Helvetica, sans-serif;
        }

        body {
            padding-top: 15px;
        }

        .logo {
            position: fixed;
            left: 15px;
            top: 15px;
            z-index: -1;
        }

        .loginError {
            font-size: 18px;
            color: red;
            text-align: center;
        }

        .login {
            font-size: 16px;
            display: block;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            width: 100%;
        }

        .login input[type=submit] {
            font-size: 16px;
        }

        .terms {
            font-size: 10px;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }

        .terms a {
            font-size: 10px;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }
    </style>
</head>

<body>

    <div class="login">
        <img src="static/fusion/images/logo_akraino_edge_stack.png" alt="Akraino" width="400&quot;" height="114"
            border="0" />
        <h2>
            <%=appDisplayName%>
        </h2>
        <br />
        <form action="login_external" method="POST">
            <label for="loginId">Login ID:</label>
            <input id="loginId" name="loginId" type="text"
                style="width: 140px;height:25px;border-radius:7px;font-size:18px;padding-left:5px;" maxlength="30">
            <br />
            <br />
            <label for="password">Password:</label>
            <input id="password" name="password" type="password"
                style="width: 140px;height:25px;border-radius:7px;font-size:18px;padding-left:5px;" maxlength="30">
            <br />
            <br />
            <input type="hidden" id="redirectUrl" name="redirectUrl" value="${param.redirectUrl}">
            <input id="loginBtn" type="submit" alt="Login" value="Login">
        </form>
    </div>
    <br />
    <br />
    <div class="loginError">${model.error}</div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <div id="footer">
        <p>
            <div class="terms">

            </div>
    </div>
</body>

</html>