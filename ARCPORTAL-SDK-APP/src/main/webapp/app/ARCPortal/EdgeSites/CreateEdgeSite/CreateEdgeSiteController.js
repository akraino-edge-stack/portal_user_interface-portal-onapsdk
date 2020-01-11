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
        .controller(
                'CreateEdgeSiteController',
                function($scope, restAPISvc, $modalInstance, $q,
                        createEdgeSiteSvc, generalSvc, $window, appContext) {

                    initialize();

                    function initialize() {
                        $scope.creatingEdgeSite = false;
                        $scope.retrieveHardwareName = generalSvc.retrieveName;

                        $scope.selectedRegions = [];
                        $scope.selectedNodes = [];

                        $scope.regions = [];
                        $scope.loadingRegions = true;
                        $scope.hardwares = [];
                        $scope.loadingHardwares = true;

                        $scope.rackSlots = [];
                        $scope.chassisUnits = [];
                        $scope.chassisMounted = false;
                        $scope.hasRackLocation = false;
                        $scope.data = {};

                        restAPISvc
                                .getRestAPI(
                                        "/api/v1/region/",
                                        function(response) {
                                            $scope.loadingRegions = false;
                                            if (response.status == 200) {
                                                $scope.regions = response.data.regions;
                                            } else {
                                                confirm("No regions found");
                                            }
                                            restAPISvc
                                                    .getRestAPI(
                                                            "/api/v1/hardware/",
                                                            function(response) {
                                                                $scope.loadingHardwares = false;
                                                                if (response.status == 200) {
                                                                    $scope.hardwares = response.data.hardware;
                                                                } else {
                                                                    confirm("No hardware found");
                                                                }
                                                            });
                                        });
                    }

                    $scope.selectedHardwareChange = function() {
                        $scope.data.selectedRackName = '';
                        $scope.data.selectedRackSlot = '';
                        $scope.rackSlots = [];
                        $scope.hasRackLocation = false;
                        $scope.data.selectedChassisUnit = '';
                        $scope.chassisUnits = [];
                        $scope.chassisMounted = false;
                        if ($scope.data.selectedHardware.yaml
                                && $scope.data.selectedHardware.yaml.yaml
                                && $scope.data.selectedHardware.yaml.yaml.rack_layout) {
                            $scope.hasRackLocation = true;
                            if ($scope.data.selectedHardware.yaml.yaml.rack_layout.chassis) {
                                $scope.chassisMounted = true;
                            } else {
                                $scope.chassisMounted = false;
                            }
                        }
                        $scope.data.selectedNodeName = '';
                        $scope.data.selectedNodeDescription = '';
                    }

                    $scope.selectedRackNameChange = function() {
                        $scope.data.selectedRackSlot = '';
                        if ($scope.hasRackLocation) {
                            $scope.rackSlots = createEdgeSiteSvc.getFreeSlots(
                                    $scope.data.selectedHardware,
                                    $scope.data.selectedRackName,
                                    $scope.selectedNodes, $scope.hardwares);
                        }
                        $scope.data.selectedChassisUnit = '';
                        $scope.chassisUnits = [];
                        $scope.data.selectedNodeName = '';
                        $scope.data.selectedNodeDescription = '';
                    }

                    $scope.selectedRackSlotChange = function() {
                        if ($scope.chassisMounted) {
                            $scope.data.selectedChassisUnit = '';
                            $scope.chassisUnits = createEdgeSiteSvc
                                    .getFreeUnits($scope.data.selectedHardware,
                                            $scope.data.selectedRackName,
                                            $scope.data.selectedRackSlot,
                                            $scope.selectedNodes);
                        }
                        $scope.data.selectedNodeName = '';
                        $scope.data.selectedNodeDescription = '';
                    }

                    $scope.addSelectedRegion = function(selectedRegion) {
                        var exist = false;
                        angular
                                .forEach(
                                        $scope.selectedRegions,
                                        function(region) {
                                            if (region.uuid.trim() === selectedRegion.uuid
                                                    .trim()) {
                                                exist = true;
                                            }
                                        });
                        if (!exist) {
                            $scope.selectedRegions.push(selectedRegion);
                        }
                    }

                    $scope.deleteSelectedRegion = function(selectedRegion) {
                        var index = $scope.selectedRegions
                                .indexOf(selectedRegion);
                        $scope.selectedRegions.splice(index, 1);
                    }

                    $scope.addSelectedNode = function() {
                        if (!$scope.data.selectedNodeName
                                || !$scope.data.selectedNodeDescription
                                || !$scope.data.selectedHardware
                                || !$scope.data.selectedRackName
                                || ($scope.hasRackLocation && !$scope.data.selectedRackSlot)
                                || ($scope.chassisMounted && !$scope.data.selectedChassisUnit)) {
                            confirm("You must specify all data fields");
                            return;
                        }
                        var node = '';
                        if ($scope.hasRackLocation) {
                            var yaml = '';
                            if ($scope.chassisMounted) {
                                yaml = {
                                    "rack_location" : {
                                        "name" : $scope.data.selectedRackName,
                                        "slot" : $scope.data.selectedRackSlot,
                                        "unit" : $scope.data.selectedChassisUnit
                                    }
                                };
                            } else {
                                yaml = {
                                    "rack_location" : {
                                        "name" : $scope.data.selectedRackName,
                                        "slot" : $scope.data.selectedRackSlot
                                    }
                                };
                            }
                            node = {
                                "name" : $scope.data.selectedNodeName,
                                "description" : $scope.data.selectedNodeDescription,
                                "hardware" : $scope.data.selectedHardware.uuid,
                                "yaml" : yaml
                            };
                        } else {
                            node = {
                                "name" : $scope.data.selectedNodeName,
                                "description" : $scope.data.selectedNodeDescription,
                                "hardware" : $scope.data.selectedHardware.uuid
                            };
                        }
                        $scope.selectedNodes.push(node);
                        $scope.data.selectedHardware = '';
                        $scope.selectedHardwareChange();
                    }

                    $scope.deleteSelectedNode = function(node) {
                        var index = $scope.selectedNodes.indexOf(node);
                        $scope.selectedNodes.splice(index, 1);
                    }

                    $scope.cancel = function() {
                        $modalInstance.close();
                    }

                    $scope.create = function() {
                        if (!$scope.data.edgeSiteName
                                || !$scope.selectedRegions
                                || $scope.selectedRegions.length < 1
                                || !$scope.selectedNodes
                                || $scope.selectedNodes.length < 1) {
                            confirm("You must specify all data fields");
                            return;
                        }
                        $scope.creatingEdgeSite = true;
                        var nodeUuids = [];
                        var promises = [];
                        angular
                                .forEach(
                                        $scope.selectedNodes,
                                        function(node) {
                                            promises
                                                    .push(restAPISvc
                                                            .postRestAPI(
                                                                    "/api/v1/node/",
                                                                    node,
                                                                    function(
                                                                            response) {
                                                                        if (response.status == 200
                                                                                || response.status == 201) {
                                                                            nodeUuids
                                                                                    .push(response.data.uuid);
                                                                        } else {
                                                                            var text2 = "Failed to create node: "
                                                                                    + node.name
                                                                            confirm(text2
                                                                                    + ". "
                                                                                    + JSON
                                                                                            .stringify(response.data));
                                                                        }
                                                                    }));
                                        });
                        $q
                                .all(promises)
                                .then(
                                        function() {
                                            var regionUuids = [];
                                            angular
                                                    .forEach(
                                                            $scope.selectedRegions,
                                                            function(region) {
                                                                regionUuids
                                                                        .push(region.uuid);
                                                            });
                                            var edgeSite = {
                                                "name" : $scope.data.edgeSiteName,
                                                "nodes" : nodeUuids,
                                                "regions" : regionUuids
                                            };
                                            restAPISvc
                                                    .postRestAPI(
                                                            "/api/v1/edgesite/",
                                                            edgeSite,
                                                            function(response) {
                                                                $scope.creatingEdgeSite = false;
                                                                if (response.status == 200
                                                                        || response.status == 201) {
                                                                    var text = "Edge Site: "
                                                                            + edgeSite.name
                                                                            + " created successfully";
                                                                    confirm(text);
                                                                } else {
                                                                    var text2 = "Failed to create edge site: "
                                                                            + edgeSite.name
                                                                    confirm(text2
                                                                            + ". "
                                                                            + JSON
                                                                                    .stringify(response.data));
                                                                }
                                                                $modalInstance
                                                                        .close();
                                                                $window.location.href = appContext
                                                                        + "/edgesites";
                                                            });
                                        });
                    }

                });
