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

var services = angular.module('App.Services', [ 'App.Config' ]);

services.factory('restAPISvc', [
        '$http',
        'appContext',
        function($http, appContext) {
            var svc = [];
            svc.getRestAPI = function(path, cb) {
                return $http({
                    method : 'GET',
                    url : appContext + path,
                    headers : {
                        'Content-Type' : "application/json",
                        'Accept' : "application/json"
                    }
                }).then(
                        function(response) {
                            cb(response);
                        },
                        function(error) {
                            /* eslint-disable no-console */
                            console.log("Get REST API error: "
                                    + JSON.stringify(error.data));
                            /* eslint-enable no-console */
                            cb(error);
                        });
            };
            svc.postRestAPI = function(path, json, cb) {
                return $http({
                    method : 'POST',
                    url : appContext + path,
                    headers : {
                        'Content-Type' : "application/json",
                        'Accept' : "application/json"
                    },
                    data : json
                }).then(
                        function(response) {
                            cb(response);
                        },
                        function(error) {
                            /* eslint-disable no-console */
                            console.log("Post REST API error: "
                                    + JSON.stringify(error.data));
                            /* eslint-enable no-console */
                            cb(error);
                        });
            };
            svc.deleteRestAPI = function(path, cb) {
                return $http({
                    method : 'DELETE',
                    url : appContext + path,
                    headers : {
                        'Content-Type' : "application/json",
                        'Accept' : "application/json"
                    }
                }).then(
                        function(response) {
                            cb(response);
                        },
                        function(error) {
                            /* eslint-disable no-console */
                            console.log("Delete REST API error: "
                                    + JSON.stringify(error.data));
                            /* eslint-enable no-console */
                            cb(error);
                        });
            };
            return svc;
        } ]);

services.factory('generalSvc', function() {
    var svc = [];
    svc.retrieveName = function(objects, uuid) {
        var name = '';
        angular.forEach(objects, function(object) {
            if (object.uuid.toString().trim() === uuid.toString().trim()) {
                name = object.name;
            }
        });
        return name;
    };
    svc.retrieveUuid = function(objects, name) {
        var uuid = '';
        angular.forEach(objects, function(object) {
            if (object.name.toString().trim() === name.toString().trim()) {
                uuid = object.uuid;
            }
        });
        return uuid;
    };
    return svc;
});