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
package org.akraino.portal_user_interface.arcportalsdkapp.client.arc.resources;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class NestedYaml {

    @JsonProperty("rack_layout")
    private RackLayout rack_layout;

    public class RackLayout {

        @JsonProperty("height")
        private String height;

        @JsonProperty("chassis")
        private Chassis chassis;

        public class Chassis {

            @JsonProperty("layout")
            private String layout;

            @JsonProperty("units")
            private Integer units;

            @JsonProperty("height")
            private String height;

            public Chassis() {

            }

            public String getLayout() {
                return this.layout;
            }

            public void setLayout(String layout) {
                this.layout = layout;
            }

            public Integer getUnits() {
                return this.units;
            }

            public void setUnits(Integer units) {
                this.units = units;
            }

            public String getHeight() {
                return this.height;
            }

            public void setHeight(String height) {
                this.height = height;
            }

        }

        public RackLayout() {

        }

        public String getHeight() {
            return this.height;
        }

        public void setHeight(String height) {
            this.height = height;
        }

        public Chassis getChassis() {
            return this.chassis;
        }

        public void setChassis(Chassis chassis) {
            this.chassis = chassis;
        }

    }

    public NestedYaml() {

    }

    public RackLayout getrack_layout() {
        return this.rack_layout;
    }

    public void setrack_layout(RackLayout rack_layout) {
        this.rack_layout = rack_layout;
    }

}
