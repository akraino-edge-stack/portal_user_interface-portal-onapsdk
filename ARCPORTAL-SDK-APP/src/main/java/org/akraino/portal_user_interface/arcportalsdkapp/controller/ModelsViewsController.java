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

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.onap.portalsdk.core.controller.RestrictedBaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class ModelsViewsController extends RestrictedBaseController {

    public ModelsViewsController() {
        super();
    }

    @RequestMapping(value = { "/edgesites" }, method = RequestMethod.GET)
    public ModelAndView edgeSites(HttpServletRequest request) {
        final String defaultViewName = null;
        return new ModelAndView(defaultViewName);
    }

    @RequestMapping(value = { "/blueprints" }, method = RequestMethod.GET)
    public ModelAndView blueprints(HttpServletRequest request) {
        final String defaultViewName = null;
        return new ModelAndView(defaultViewName);
    }

    @RequestMapping(value = { "/pods" }, method = RequestMethod.GET)
    public ModelAndView pods(HttpServletRequest request) {
        final String defaultViewName = null;
        return new ModelAndView(defaultViewName);
    }

    @RequestMapping(value = { "/logout.htm" }, method = RequestMethod.GET)
    public ModelAndView logout() {
        Map<String, Object> model = new HashMap<>();
        return new ModelAndView("logout", "model", model);
    }

    @RequestMapping(value = { "/process_csp" }, method = RequestMethod.GET)
    public ModelAndView processCsp(HttpServletRequest request, HttpServletResponse response) throws Exception {
        return new ModelAndView("redirect:login.htm?redirectUrl=" + request.getParameter("redirectUrl"));
    }

}
