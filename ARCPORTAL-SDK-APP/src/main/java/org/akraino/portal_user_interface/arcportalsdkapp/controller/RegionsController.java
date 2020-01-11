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

package org.akraino.portal_user_interface.arcportalsdkapp.controller;

import org.akraino.portal_user_interface.arcportalsdkapp.service.RegionsService;
import org.akraino.portal_user_interface.arcportalsdkapp.util.Utils;
import org.onap.portalsdk.core.controller.RestrictedBaseController;
import org.onap.portalsdk.core.logging.logic.EELFLoggerDelegate;
import org.onap.portalsdk.core.web.support.UserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/api/v1/region")
public class RegionsController extends RestrictedBaseController {

    private static final EELFLoggerDelegate LOGGER = EELFLoggerDelegate.getLogger(RegionsController.class);

    @Autowired
    RegionsService service;
    private ObjectMapper mapper;

    public RegionsController() {
        super();
        this.mapper = new ObjectMapper();
    }

    @RequestMapping(value = { "/" }, method = RequestMethod.GET)
    public ResponseEntity<String> getRegions() {
        try {
            String body = mapper.writeValueAsString(service.getRegions());
            return new ResponseEntity<>(body, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve regions. " + UserUtils.getStackTrace(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Utils.constructJsonErrorMessage(e.getMessage()));
        }
    }

    @RequestMapping(value = { "/{id}" }, method = RequestMethod.GET)
    public ResponseEntity<String> getRegion(@PathVariable("id") String uuid) {
        try {
            String body = mapper.writeValueAsString(service.getRegion(uuid));
            return new ResponseEntity<>(body, HttpStatus.OK);
        } catch (Exception e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve region. " + UserUtils.getStackTrace(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Utils.constructJsonErrorMessage(e.getMessage()));
        }
    }
}
