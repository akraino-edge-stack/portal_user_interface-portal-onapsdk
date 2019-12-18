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

var app = angular.module('Blueprints');

app.factory('generalSvc', function() {
    var svc = [];
    svc.getHardwareProfile = function(hardwares, profile) {
        var hardware = '';
        angular.forEach(hardwares, function(hardwareData) {
            if (profile.uuid
                    && hardwareData.uuid.toString().trim() === profile.uuid
                            .toString().trim()) {
                hardware = hardwareData;
            } else if (profile.name
                    && hardwareData.name.toString().trim() === profile.name
                            .toString().trim()) {
                hardware = hardwareData;
            }
        });
        return hardware;
    };
    return svc;
});