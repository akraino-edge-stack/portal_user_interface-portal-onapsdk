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

app
        .factory(
                'edgeSiteSvc',
                function() {
                    var svc = [];
                    svc.formulateRegion = function(regions, allRegions) {
                        if (regions.length > 1) {
                            return 'Multiple'
                        }
                        var result = null;
                        angular.forEach(allRegions, function(region) {
                            if (region.uuid.toString().trim() === regions[0]
                                    .toString().trim()) {
                                result = region.name;
                            }
                        });
                        return result;
                    };
                    svc.calculateNumberOfRacks = function(nodes, edgeSite) {
                        var rackNames = [];
                        if (angular.isObject(edgeSite.nodes)) {
                            angular
                                    .forEach(
                                            edgeSite.nodes,
                                            function(nodeId) {
                                                angular
                                                        .forEach(
                                                                nodes,
                                                                function(
                                                                        nodeData) {
                                                                    if (nodeData.uuid === nodeId) {
                                                                        if (angular
                                                                                .isObject(nodeData.yaml)
                                                                                && angular
                                                                                        .isObject(nodeData.yaml.rack_location)) {
                                                                            if (rackNames
                                                                                    .indexOf(nodeData.yaml.rack_location.name) === -1) {
                                                                                rackNames
                                                                                        .push(nodeData.yaml.rack_location.name);
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                            });
                        }
                        return rackNames.length;
                    };
                    svc.findPod = function(edgeSite, pods) {
                        var desiredPod = {};
                        if (!pods) {
                            return desiredPod;
                        }
                        angular
                                .forEach(
                                        pods,
                                        function(pod) {
                                            if (pod.edgesite.toString().trim() === edgeSite.uuid
                                                    .toString().trim()) {
                                                desiredPod = pod;
                                            }
                                        });
                        return desiredPod;
                    };
                    svc.findBlueprint = function(pod, blueprints) {
                        var desiredBlueprint = {};
                        if (!blueprints || !pod || !pod.blueprint) {
                            return desiredBlueprint;
                        }
                        angular
                                .forEach(
                                        blueprints,
                                        function(blueprint) {
                                            if (pod.blueprint.toString().trim() === blueprint.uuid
                                                    .toString().trim()) {
                                                desiredBlueprint = blueprint;
                                            }
                                        });
                        return desiredBlueprint;
                    };
                    return svc;
                });
