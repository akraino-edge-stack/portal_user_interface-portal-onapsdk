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
package org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.pod;

import org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources.IResource;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.fasterxml.jackson.databind.JsonNode;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class Pod implements IResource {

    private static final String PATH = "/pod";

    @JsonProperty("name")
    private String name;

    @JsonProperty("blueprint")
    private String blueprint;

    @JsonProperty("description")
    private String description;

    @JsonProperty("url")
    private String url;

    @JsonProperty("uuid")
    private String uuid;

    @JsonProperty("edgesite")
    private String edgesite;

    @JsonProperty("state")
    private String state;

    @JsonProperty("yaml")
    private JsonNode yaml;

    public Pod() {

    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBlueprint() {
        return this.blueprint;
    }

    public void setBlueprint(String blueprint) {
        this.blueprint = blueprint;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUuid() {
        return this.uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getEdgesite() {
        return this.edgesite;
    }

    public void setEdgesite(String edgesite) {
        this.edgesite = edgesite;
    }

    public String getState() {
        return this.state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public JsonNode getYaml() {
        return this.yaml;
    }

    public void setYaml(JsonNode yaml) {
        this.yaml = yaml;
    }

    @Override
    public String getPath() {
        return PATH;
    }

}
