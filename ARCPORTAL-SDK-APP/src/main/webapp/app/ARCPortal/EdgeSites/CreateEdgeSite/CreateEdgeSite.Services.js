/*
 * Copyright (c) 2019 AT&T Intellectual Property. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var app = angular.module('EdgeSites');

app.factory('createEdgeSiteSvc', [ function() {
    var svc = [];
    svc.retrieveHardware = function(node, hardwares) {
        var name = '';
        angular.forEach(hardwares, function(hardware) {
            if (hardware.uuid.toString().trim() === node.hardware.toString().trim()) {
                name = hardware.name;
            }
        });
        return name;
    };
    return svc;
} ]);
