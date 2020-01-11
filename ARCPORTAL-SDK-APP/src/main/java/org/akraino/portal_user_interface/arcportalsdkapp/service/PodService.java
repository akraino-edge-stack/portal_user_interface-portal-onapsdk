/*
 * Copyright (c) 2020 AT&T Intellectual Property. All rights reserved.
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

import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.ArcExecutorClient;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.pod.Pod;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.pod.Pods;
import org.akraino.portal_user_interface.arcportalsdkapp.util.Consts;
import org.apache.commons.httpclient.HttpException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.api.client.ClientResponse;

@Service
public class PodService extends AbstractArcService {

    private final String arcUrl;
    private final String arcUser;
    private final String arcPassword;

    public PodService() {
        arcUrl = System.getenv(Consts.ENV_NAME_ARC_URL);
        arcUser = System.getenv(Consts.ENV_NAME_ARC_USER);
        arcPassword = System.getenv(Consts.ENV_NAME_ARC_PASSWORD);
    }

    public Pods getPods() throws Exception {
        ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
        ClientResponse response = client.get(new Pods(), null);
        return this.handleGetResponse(response, Pods.class);
    }

    public Pod getPod(String uuid) throws Exception {
        ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
        ClientResponse response = client.get(new Pod(), null);
        return this.handleGetResponse(response, Pod.class);
    }

    public Pod savePod(String pod) throws Exception {
        ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
        ClientResponse response = client.post(pod, "/pod");
        String uuid = this.getUuid(response);
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        mapper.setSerializationInclusion(Include.NON_NULL);
        Pod podObj = mapper.readValue(pod, Pod.class);
        podObj.setUuid(uuid);
        return podObj;
    }

    public Boolean deletePod(String uuid) throws Exception {
        ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
        ClientResponse response = client.delete(new Pod(), uuid);
        if (response.getStatus() == 200 || response.getStatus() == 202 || response.getStatus() == 204) {
            return true;
        }
        throw new HttpException(response.getEntity(String.class));
    }

}
