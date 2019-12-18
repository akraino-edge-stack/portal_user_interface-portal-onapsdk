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
package org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.blueprint;

import java.util.List;

import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.IResource;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class Blueprints implements IResource {

    private static final String PATH = "/blueprint";

    @JsonProperty("blueprints")
    private List<Blueprint> blueprints;

    public Blueprints() {

    }

    public List<Blueprint> getBlueprints() {
        return this.blueprints;
    }

    public void setBlueprints(List<Blueprint> blueprints) {
        this.blueprints = blueprints;
    }

    public static String getPath() {
        return PATH;
    }

}
