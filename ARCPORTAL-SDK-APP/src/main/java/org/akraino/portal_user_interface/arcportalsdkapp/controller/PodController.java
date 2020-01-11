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

package org.akraino.portal_user_interface.arcportalsdkapp.controller;

import java.net.MalformedURLException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import org.akraino.portal_user_interface.arcportalsdkapp.service.PodService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.sun.jersey.api.client.ClientHandlerException;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.UniformInterfaceException;

@Controller
@RequestMapping("/api/v1/pod")
public class PodController extends RestrictedBaseController {

    private static final EELFLoggerDelegate LOGGER = EELFLoggerDelegate.getLogger(PodController.class);

    @Autowired
    PodService service;

    public PodController() {
        super();
    }

    @RequestMapping(value = { "/" }, method = RequestMethod.GET)
    public ResponseEntity getPods() {
        try {
            return new ResponseEntity<>(service.getPods(), HttpStatus.OK);
        } catch (HttpException e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve pods. " + UserUtils.getStackTrace(e));
            String error = e.getMessage().substring(e.getMessage().indexOf("{"));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve pods. " + UserUtils.getStackTrace(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Consts.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = { "/{id}" }, method = RequestMethod.GET)
    public ResponseEntity getPod(@PathVariable("id") String uuid) {
        try {
            return new ResponseEntity<>(service.getPod(uuid), HttpStatus.OK);
        } catch (HttpException e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve pod. " + UserUtils.getStackTrace(e));
            String error = e.getMessage().substring(e.getMessage().indexOf("{"));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to retrieve pod. " + UserUtils.getStackTrace(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Consts.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = { "/" }, method = RequestMethod.POST)
    public ResponseEntity createPod(@RequestBody String pod) {
        try {
            return new ResponseEntity<>(service.savePod(pod), HttpStatus.CREATED);
        } catch (HttpException e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger, "Creation of pod failed. " + UserUtils.getStackTrace(e));
            String error = e.getMessage().substring(e.getMessage().indexOf("{"));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger, "Creation of pod failed. " + UserUtils.getStackTrace(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Consts.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = { "/{id}" }, method = RequestMethod.DELETE)
    public ResponseEntity deletePod(@PathVariable("id") String uuid) {
        try {
            ClientResponse response = service.deletePod(uuid);
            if (response.getStatus() == 200 || response.getStatus() == 202 || response.getStatus() == 204) {
                LOGGER.debug(EELFLoggerDelegate.debugLogger, "Deletion of POD succeeded");
                return new ResponseEntity<>(true, HttpStatus.OK);
            }
            LOGGER.error(EELFLoggerDelegate.errorLogger, "Error occurred when trying to delete POD.");
            String error = response.getEntity(String.class);
            error = error.substring(error.indexOf("{"));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (KeyManagementException | MalformedURLException | HttpException | ClientHandlerException
                | UniformInterfaceException | NoSuchAlgorithmException e) {
            LOGGER.error(EELFLoggerDelegate.errorLogger,
                    "Error occurred when trying to delete POD. " + UserUtils.getStackTrace(e));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Consts.INTERNAL_SERVER_ERROR);
        }

    }
}
