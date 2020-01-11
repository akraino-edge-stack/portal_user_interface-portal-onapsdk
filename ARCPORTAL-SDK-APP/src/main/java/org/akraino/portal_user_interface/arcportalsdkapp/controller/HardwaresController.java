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

import org.akraino.portal_user_interface.arcportalsdkapp.service.HardwaresService;
import org.akraino.portal_user_interface.arcportalsdkapp.util.Consts;
import org.apache.commons.httpclient.HttpException;
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

@Controller
@RequestMapping("/api/v1/hardware")
public class HardwaresController extends RestrictedBaseController {

    private static final EELFLoggerDelegate LOGGER = EELFLoggerDelegate.getLogger(HardwaresController.class);

    @Autowired
    HardwaresService service;

    public HardwaresController() {
        super();
    }

    @RequestMapping(value = { "/" }, method = RequestMethod.GET)
    public ResponseEntity getHardwares() {
        try {
            return new ResponseEntity<>(service.getHardwares(), HttpStatus.OK);
        } catch (HttpException e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve 'Hardwares' collection. " + UserUtils.getStackTrace(e));
            String error = e.getMessage().substring(e.getMessage().indexOf("{"));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve 'Hardwares' collection. " + UserUtils.getStackTrace(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Consts.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = { "/{id}" }, method = RequestMethod.GET)
    public ResponseEntity getHardware(@PathVariable("id") String uuid) {
        try {
            return new ResponseEntity<>(service.getHardware(uuid), HttpStatus.OK);
        } catch (HttpException e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve 'Hardware' collection. " + UserUtils.getStackTrace(e));
            String error = e.getMessage().substring(e.getMessage().indexOf("{"));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve 'Hardware' collection. " + UserUtils.getStackTrace(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Consts.INTERNAL_SERVER_ERROR);
        }
    }
}
