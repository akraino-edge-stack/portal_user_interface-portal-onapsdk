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

import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class Hardware implements IResource {

    private static final String PATH = "/hardware";

    @JsonProperty("name")
    private String name;

    @JsonProperty("description")
    private String description;

    @JsonProperty("uuid")
    private String uuid;

    @JsonProperty("url")
    private String url;

    @JsonProperty("yaml")
    private Yaml yaml;

    public class Yaml {

        @JsonProperty("disk")
        private List<String> disk;

        @JsonProperty("nic")
        private List<String> nic;

        @JsonProperty("ps")
        private String ps;

        @JsonProperty("cpu")
        private String cpu;

        @JsonProperty("lom")
        private String lom;

        @JsonProperty("ram")
        private String ram;

        @JsonProperty("yaml")
        private NestedYaml yaml;

        @JsonProperty("name")
        private String name;

        @JsonProperty("description")
        private String description;

        public Yaml() {

        }

        public List<String> getDisk() {
            return this.disk;
        }

        public void setDisk(List<String> disk) {
            this.disk = disk;
        }

        public List<String> getNic() {
            return this.nic;
        }

        public void setNic(List<String> nic) {
            this.nic = nic;
        }

        public String getPs() {
            return this.ps;
        }

        public void setPs(String ps) {
            this.ps = ps;
        }

        public String getCpu() {
            return this.cpu;
        }

        public void setCpu(String cpu) {
            this.cpu = cpu;
        }

        public String getLom() {
            return this.lom;
        }

        public void setLom(String lom) {
            this.lom = lom;
        }

        public String getRam() {
            return this.ram;
        }

        public void setRam(String ram) {
            this.ram = ram;
        }

        public NestedYaml getYaml() {
            return this.yaml;
        }

        public void setYaml(NestedYaml yaml) {
            this.yaml = yaml;
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

    }

    public Hardware() {

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
