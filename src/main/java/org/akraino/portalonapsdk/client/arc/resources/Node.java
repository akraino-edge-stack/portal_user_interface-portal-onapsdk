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
package org.akraino.portalonapsdk.client.arc.resources;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class Node implements IResource {

    private static final String PATH = "/node";

    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;

    @JsonProperty("uuid")
    private String uuid;

    @JsonProperty("url")
    private String url;

    @JsonProperty("hardware")
    private String hardware;

    @JsonProperty("yaml")
    private Yaml yaml;

    public class Yaml {

        @JsonProperty("rack_location")
        private RackLocation rack_location;

        public Yaml() {

        }

        public RackLocation getrack_location() {
            return this.rack_location;
        }

        public void setrack_location(RackLocation rack_location) {
            this.rack_location = rack_location;
        }

        public class RackLocation {

            @JsonProperty("name")
            private String name;

            @JsonProperty("slot")
            private Integer slot;

            @JsonProperty("unit")
            private Integer unit;

            public RackLocation() {

            }

            public String getName() {
                return this.name;
            }

            public void setName(String name) {
                this.name = name;
            }

            public Integer getSlot() {
                return this.slot;
            }

            public void setSlot(Integer slot) {
                this.slot = slot;
            }

            public Integer getUnit() {
                return this.slot;
            }

            public void setUnit(Integer unit) {
                this.unit = unit;
            }

        }
    }

    public Node() {

    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getHardware() {
        return this.hardware;
    }

    public void setHardware(String hardware) {
        this.hardware = hardware;
    }

    public Yaml getYaml() {
        return this.yaml;
    }

    public void setYaml(Yaml yaml) {
        this.yaml = yaml;
    }

    public static String getPath() {
        return PATH;
    }
}
