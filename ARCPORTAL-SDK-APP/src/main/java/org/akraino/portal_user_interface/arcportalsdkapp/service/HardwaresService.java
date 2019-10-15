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
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.ArcExecutorClient;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.Hardware;
import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.Hardwares;
import org.akraino.portal_user_interface.arcportalsdkapp.util.Consts;
import org.apache.jcs.access.exception.InvalidArgumentException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.UniformInterfaceException;

@Service
public class HardwaresService {

    private final String arcUrl;
    private final String arcUser;
    private final String arcPassword;

    public HardwaresService() {
        arcUrl = System.getenv(Consts.ENV_NAME_ARC_URL);
        arcUser = System.getenv(Consts.ENV_NAME_ARC_USER);
        arcPassword = System.getenv(Consts.ENV_NAME_ARC_PASSWORD);
    }

    public Hardwares getHardwares() throws KeyManagementException, ClientHandlerException, UniformInterfaceException,
            InvalidArgumentException, NoSuchAlgorithmException, JsonParseException, JsonMappingException, IOException {
        ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
        return client.get(Hardwares.class, null);
    }

    public Hardware getHardware(String uuid)
            throws KeyManagementException, ClientHandlerException, UniformInterfaceException, InvalidArgumentException,
            NoSuchAlgorithmException, JsonParseException, JsonMappingException, IOException {
        ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
        return client.get(Hardware.class, uuid);
    }

}
