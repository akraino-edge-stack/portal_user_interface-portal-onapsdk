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
import org.akraino.portal_user_interface.arcportalsdkapp.util.Consts;
import org.apache.commons.httpclient.HttpException;
import org.springframework.stereotype.Service;

import com.sun.jersey.api.client.ClientResponse;

@Service
public class CheckConnectivityService extends AbstractArcService {

    private final String arcUrl;
    private final String arcUser;
    private final String arcPassword;

    public CheckConnectivityService() {
        arcUrl = System.getenv(Consts.ENV_NAME_ARC_URL);
        arcUser = System.getenv(Consts.ENV_NAME_ARC_USER);
        arcPassword = System.getenv(Consts.ENV_NAME_ARC_PASSWORD);
    }

    public Boolean checkConnectivity() throws Exception {
        try {
            ArcExecutorClient client = ArcExecutorClient.getInstance(arcUser, arcPassword, arcUrl);
            ClientResponse response = client.checkConnectivity();
            if (response.getStatus() != 401) {
                throw new HttpException(constructJsonErrorMessage(response.getEntity(String.class)));
            }
            return true;
        } catch (Exception e) {
            throw new Exception(constructJsonErrorMessage(e.getMessage()));
        }
    }

}
