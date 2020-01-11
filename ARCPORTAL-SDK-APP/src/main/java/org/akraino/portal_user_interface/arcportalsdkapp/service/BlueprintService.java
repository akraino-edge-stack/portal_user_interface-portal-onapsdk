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

import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.ArcExecutorClient;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.blueprint.Blueprint;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.blueprint.Blueprints;
import org.akraino.portal_user_interface.arcportalsdkapp.util.Consts;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.api.client.ClientResponse;

@Service
public class BlueprintService extends AbstractArcService {

    private final String arcUrl;
    private final String arcUser;
    private final String arcPassword;

    public BlueprintService() {
        super();
        arcUrl = System.getenv(Consts.ENV_NAME_ARC_URL);
        arcUser = System.getenv(Consts.ENV_NAME_ARC_USER);
        arcPassword = System.getenv(Consts.ENV_NAME_ARC_PASSWORD);
    }

    public Blueprints getBlueprints() throws Exception {
        try {
            ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
            ClientResponse response = client.get(new Blueprints(), null);
            return this.handleGetResponse(response, Blueprints.class);
        } catch (Exception e) {
            throw new Exception(constructJsonErrorMessage(e.getMessage()));
        }
    }

    public Blueprint getBlueprint(String uuid) throws Exception {
        ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
        try {
            ClientResponse response = client.get(new Blueprint(), uuid);
            return this.handleGetResponse(response, Blueprint.class);
        } catch (Exception e) {
            throw new Exception(constructJsonErrorMessage(e.getMessage()));
        }
    }

    public Blueprint saveBlueprint(String blueprint) throws Exception {
        try {
            ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
            ClientResponse response = client.post(blueprint, "/blueprint");
            String uuid = this.getUuid(response);
            ObjectMapper mapper = new ObjectMapper();
            mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
            mapper.setSerializationInclusion(Include.NON_NULL);
            Blueprint blueprintObj = mapper.readValue(blueprint, Blueprint.class);
            blueprintObj.setUuid(uuid);
            return blueprintObj;
        } catch (Exception e) {
            throw new Exception(constructJsonErrorMessage(e.getMessage()));
        }
    }
}
