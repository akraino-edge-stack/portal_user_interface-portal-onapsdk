/*
 * Copyright (c) 2019 AT&T Intellectual Property. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
package org.akraino.portal_user_interface.arcportalsdkapp.client.arc;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.MalformedURLException;
import java.net.Proxy;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Nonnull;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;

import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.IResource;
import org.akraino.portal_user_interface.arcportalsdkapp.util.Consts;
import org.apache.commons.httpclient.HttpException;
import org.json.JSONObject;
import org.onap.portalsdk.core.logging.logic.EELFLoggerDelegate;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.json.JSONConfiguration;
import com.sun.jersey.client.urlconnection.HttpURLConnectionFactory;
import com.sun.jersey.client.urlconnection.URLConnectionClientHandler;

public final class ArcExecutorClient {

    private static final EELFLoggerDelegate LOGGER = EELFLoggerDelegate.getLogger(ArcExecutorClient.class);

    private static final List<ArcExecutorClient> ARC_CLIENTS = new ArrayList<>();
    private static final Object LOCK = new Object();
    private final Client client;

    private final String user;
    private final String password;
    private final String baseurl;

    private ArcExecutorClient(@Nonnull String newUser, @Nonnull String newPassword, @Nonnull String newBaseurl) {
        this.user = newUser;
        this.password = newPassword;
        this.baseurl = newBaseurl;
        ClientConfig clientConfig = new DefaultClientConfig();
        clientConfig.getFeatures().put(JSONConfiguration.FEATURE_POJO_MAPPING, Boolean.TRUE);
        this.client = new Client(new URLConnectionClientHandler(new HttpURLConnectionFactory() {
            Proxy proxy = null;

            @Override
            public HttpURLConnection getHttpURLConnection(URL url) throws IOException {
                try {
                    String proxyIp = System.getenv(Consts.ENV_NAME_ARC_PROXY).substring(0,
                            System.getenv(Consts.ENV_NAME_ARC_PROXY).lastIndexOf(Consts.DELIMITER));
                    String proxyPort = System.getenv(Consts.ENV_NAME_ARC_PROXY_PORT)
                            .substring(System.getenv(Consts.ENV_NAME_ARC_PROXY_PORT).lastIndexOf(Consts.DELIMITER) + 1);
                    proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyIp, Integer.parseInt(proxyPort)));
                    return (HttpURLConnection) url.openConnection(proxy);
                } catch (Exception ex) {
                    return (HttpURLConnection) url.openConnection();
                }
            }
        }), clientConfig);
    }

    public static synchronized ArcExecutorClient getInstance(@Nonnull String newUser, @Nonnull String newPassword,
            @Nonnull String newBaseurl) throws MalformedURLException {
        new URL(newBaseurl);
        for (ArcExecutorClient client : ARC_CLIENTS) {
            if (client.getBaseUrl().equals(newBaseurl) && client.getUser().equals(newUser)
                    && client.getPassword().equals(newPassword)) {
                return client;
            }
        }
        ArcExecutorClient client = new ArcExecutorClient(newUser, newPassword, newBaseurl);
        ARC_CLIENTS.add(client);
        return client;
    }

    public String getUser() {
        return this.user;
    }

    public String getPassword() {
        return this.password;
    }

    public String getBaseUrl() {
        return this.baseurl;
    }

    public <T extends IResource> ClientResponse get(@Nonnull T resource, String resourceId)
            throws KeyManagementException, HttpException, ClientHandlerException, UniformInterfaceException,
            NoSuchAlgorithmException {
        synchronized (LOCK) {
            String token = this.getToken();
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Token is: " + token);
            String path = resource.getPath();
            if (resourceId != null) {
                path = path + "/" + resourceId;
            }
            WebResource webResource = this.client.resource(this.getBaseUrl() + Consts.V1_PART_URL + path);
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Request URI of get: " + webResource.getURI().toString());
            WebResource.Builder builder = webResource.getRequestBuilder();
            builder.header(Consts.X_ARC_TOKEN_HEADER, token);
            return builder.accept(MediaType.APPLICATION_JSON).type(MediaType.APPLICATION_JSON)
                    .get(ClientResponse.class);
        }
    }

    public <T extends IResource> ClientResponse post(@Nonnull T resource) throws KeyManagementException, HttpException,
            ClientHandlerException, UniformInterfaceException, NoSuchAlgorithmException {
        synchronized (LOCK) {
            String token = this.getToken();
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Token is: " + token);
            String path = resource.getPath();
            WebResource webResource = this.client.resource(this.getBaseUrl() + Consts.V1_PART_URL + path);
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Request URI of post: " + webResource.getURI().toString());
            WebResource.Builder builder = webResource.getRequestBuilder();
            builder.header(Consts.X_ARC_TOKEN_HEADER, token);
            return builder.accept(MediaType.APPLICATION_JSON).type(MediaType.APPLICATION_JSON)
                    .post(ClientResponse.class, resource);
        }
    }

    public ClientResponse post(@Nonnull String resource, @Nonnull String path) throws KeyManagementException,
            HttpException, ClientHandlerException, UniformInterfaceException, NoSuchAlgorithmException {
        synchronized (LOCK) {
            String token = this.getToken();
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Token is: " + token);
            WebResource webResource = this.client.resource(this.getBaseUrl() + Consts.V1_PART_URL + path);
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Request URI of post: " + webResource.getURI().toString());
            WebResource.Builder builder = webResource.getRequestBuilder();
            builder.header(Consts.X_ARC_TOKEN_HEADER, token);
            return builder.accept(MediaType.APPLICATION_JSON).type(MediaType.APPLICATION_JSON)
                    .post(ClientResponse.class, resource);
        }
    }

    public <T extends IResource> ClientResponse delete(@Nonnull T resource, @Nonnull String uuid)
            throws KeyManagementException, HttpException, ClientHandlerException, UniformInterfaceException,
            NoSuchAlgorithmException {
        synchronized (LOCK) {
            String token = this.getToken();
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Token is: " + token);
            String path = resource.getPath();
            WebResource webResource = this.client.resource(this.getBaseUrl() + Consts.V1_PART_URL + path + "/" + uuid);
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Request URI of deletion: " + webResource.getURI().toString());
            WebResource.Builder builder = webResource.getRequestBuilder();
            builder.header(Consts.X_ARC_TOKEN_HEADER, token);
            return builder.accept(MediaType.APPLICATION_JSON).type(MediaType.APPLICATION_JSON)
                    .delete(ClientResponse.class);
        }
    }

    public ClientResponse checkConnectivity() throws KeyManagementException, HttpException, ClientHandlerException,
            UniformInterfaceException, NoSuchAlgorithmException {
        synchronized (LOCK) {
            WebResource webResource = this.client.resource(this.getBaseUrl() + Consts.V1_PART_URL + "/edgesite");
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Request URI of get: " + webResource.getURI().toString());
            WebResource.Builder builder = webResource.getRequestBuilder();
            return builder.accept(MediaType.APPLICATION_JSON).type(MediaType.APPLICATION_JSON)
                    .get(ClientResponse.class);
        }
    }

    private String getToken() throws HttpException, ClientHandlerException, UniformInterfaceException,
            KeyManagementException, NoSuchAlgorithmException {
        LOGGER.debug(EELFLoggerDelegate.debugLogger, "Attempting to get the token");
        String tokenUri = baseurl + Consts.V1_PART_URL + Consts.LOGIN_PART_URL;
        WebResource webResource = this.client.resource(tokenUri);
        String payload = new JSONObject().put(Consts.JSON_ATTRIBUTE_NAME, user)
                .put(Consts.JSON_ATTRIBUTE_PASSWORD, password).toString();
        ClientResponse response = null;
        response = webResource.type(MediaType.APPLICATION_JSON).post(ClientResponse.class, payload);
        if (response.getStatus() == 201 || response.getStatus() == 200) {
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Successful token retrieval");
            MultivaluedMap<String, String> responseValues = response.getHeaders();
            Iterator<String> iter = responseValues.keySet().iterator();
            while (iter.hasNext()) {
                String key = iter.next();
                if (key.equalsIgnoreCase(Consts.X_ARC_TOKEN_HEADER)) {
                    return responseValues.getFirst(key);
                }
            }
        }
        throw new HttpException(response.getEntity(String.class));
    }

}
