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
package org.akraino.portal_user_interface.arcportalsdkapp.service;

import java.io.IOException;
import java.util.Iterator;

import javax.annotation.Nonnull;
import javax.ws.rs.core.MultivaluedMap;

import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.IResource;
import org.akraino.portal_user_interface.arcportalsdkapp.util.Consts;
import org.apache.commons.httpclient.HttpException;
import org.onap.portalsdk.core.logging.logic.EELFLoggerDelegate;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;

public abstract class AbstractArcService {

    private static final EELFLoggerDelegate LOGGER = EELFLoggerDelegate.getLogger(AbstractArcService.class);

    public AbstractArcService() {
    }

    protected <T extends IResource> T handleGetResponse(ClientResponse response, @Nonnull Class<T> resource)
            throws ClientHandlerException, UniformInterfaceException, JsonParseException, JsonMappingException,
            IOException {
        if (response.getStatus() != 200) {
            throw new HttpException(response.getEntity(String.class));
        }
        LOGGER.debug(EELFLoggerDelegate.debugLogger, "Get of resource succeeded");
        String result = response.getEntity(String.class);
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        mapper.setSerializationInclusion(Include.NON_NULL);
        return mapper.readValue(result, resource);
    }

    protected String getUuid(ClientResponse response)
            throws HttpException, ClientHandlerException, UniformInterfaceException {
        if (response.getStatus() == 201 || response.getStatus() == 200) {
            LOGGER.debug(EELFLoggerDelegate.debugLogger, "Post of resource succeeded");
            MultivaluedMap<String, String> responseValues = response.getHeaders();
            Iterator<String> iter = responseValues.keySet().iterator();
            while (iter.hasNext()) {
                String key = iter.next();
                if (key.equalsIgnoreCase(Consts.LOCATION_KEYWORD)) {
                    return responseValues.getFirst(key).substring(
                            responseValues.getFirst(key).lastIndexOf(Consts.DELIMITER_2) + 1,
                            responseValues.getFirst(key).length());
                }
            }
        }
        throw new HttpException(response.getEntity(String.class));
    }

}
