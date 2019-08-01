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
import javax.ws.rs.core.MultivaluedMap;

import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.EdgeSite;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.EdgeSites;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.Hardware;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.Hardwares;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.IResource;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.Node;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.Nodes;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.Region;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.Regions;
import org.apache.commons.httpclient.HttpException;
import org.apache.jcs.access.exception.InvalidArgumentException;
import org.onap.portalsdk.core.logging.logic.EELFLoggerDelegate;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
                    String proxyIp = System.getenv("ARC_PROXY").substring(0,
                            System.getenv("ARC_PROXY").lastIndexOf(":"));
                    String proxyPort = System.getenv("ARC_PROXY")
                            .substring(System.getenv("ARC_PROXY").lastIndexOf(":") + 1);
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

    public <T extends IResource> T get(@Nonnull Class<T> resource, String resourceId)
            throws ClientHandlerException, UniformInterfaceException, InvalidArgumentException, KeyManagementException,
            NoSuchAlgorithmException, JsonParseException, JsonMappingException, IOException {
        synchronized (LOCK) {
            String token = this.getToken();
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Token is: " + token);
            String path = getPath(resource);
            if (resourceId != null) {
                path = path + "/" + resourceId;
            }
            WebResource webResource = this.client.resource(this.getBaseUrl() + "/api/v1" + path);
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Request URI of get: " + webResource.getURI().toString());
            WebResource.Builder builder = webResource.getRequestBuilder();
            builder.header("X-ARC-Token", token);
            ClientResponse response = builder.accept("application/json").type("application/json")
                    .get(ClientResponse.class);
            if (response.getStatus() != 200) {
                throw new HttpException("Get of resource failed : " + response.getStatus() + " and message: "
                        + response.getEntity(String.class));
            }
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Get of resource succeeded");
            String result = response.getEntity(String.class);
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Resource: " + result);
            ObjectMapper mapper = new ObjectMapper();
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
            mapper.setSerializationInclusion(Include.NON_NULL);
            return mapper.readValue(result, resource);
        }
    }

    private String getToken() throws HttpException, ClientHandlerException, UniformInterfaceException,
    KeyManagementException, NoSuchAlgorithmException {
        LOGGER.debug(EELFLoggerDelegate.debugLogger, "Attempting to get the token");
        String tokenUri = baseurl + "/api/v1" + "/login";
        WebResource webResource = this.client.resource(tokenUri);
        String payload = "{\"name\": \"" + user + "\", \"password\":\"" + password + "\"}";
        ClientResponse response = null;
        response = webResource.type("application/json").post(ClientResponse.class, payload);
        if (response.getStatus() == 201 || response.getStatus() == 200) {
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Successful token retrieval");
            MultivaluedMap<String, String> responseValues = response.getHeaders();
            Iterator<String> iter = responseValues.keySet().iterator();
            while (iter.hasNext()) {
                String key = iter.next();
                if (key.equalsIgnoreCase("X-ARC-Token")) {
                    return responseValues.getFirst(key);
                }
            }
        }
        throw new HttpException("Get token attempt towards regional controller failed. HTTP error code: "
                + response.getStatus() + " and message: " + response.getEntity(String.class));
    }

    private static <T extends IResource> String getPath(@Nonnull Class<T> type) throws InvalidArgumentException {
        if (type == EdgeSites.class) {
            return EdgeSites.getPath();
        } else if (type == EdgeSite.class) {
            return EdgeSite.getPath();
        } else if (type == Regions.class) {
            return Regions.getPath();
        } else if (type == Region.class) {
            return Region.getPath();
        } else if (type == Hardwares.class) {
            return Hardwares.getPath();
        } else if (type == Hardware.class) {
            return Hardware.getPath();
        } else if (type == Nodes.class) {
            return Nodes.getPath();
        } else if (type == Node.class) {
            return Node.getPath();
        }
        throw new InvalidArgumentException("The requested resource is not supported");
    }

}
