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

app.controller('CreateEdgeSiteController', function($scope, restAPISvc, $modalInstance, $q, createEdgeSiteSvc) {

    initialize();

    function initialize() {
        $scope.retrieveHardware = createEdgeSiteSvc.retrieveHardware;

        $scope.regions = [];
        $scope.selectedRegions = [];
        $scope.selectedNodes = [];
        $scope.loadingRegions = true;
        $scope.hardwares = [];
        $scope.loadingHardwares = true;
        $scope.rackSlots = Array.from(Array(42).keys()).map(x => ++x);
        $scope.chassisUnits = [];
        $scope.chassisMounted = false;
        $scope.data = {};

        restAPISvc.getRestAPI("/api/v1/region/", function(data) {
            if (data) {
                $scope.regions = data.regions;
            } else {
                confirm("No regions found");
            }
            $scope.loadingRegions = false;
        });

        restAPISvc.getRestAPI("/api/v1/hardware/", function(data) {
            if (data) {
                angular.forEach(data.hardware, function(hardware) {
                    if (hardware.yaml) {
                        $scope.hardwares.push(hardware);
                    }
                });
            } else {
                confirm("No hardware found");
            }
            $scope.loadingHardwares = false;
        });
    }

    $scope.selectedHardwareChange = function () {
        $scope.data.selectedRackSlot = '';
        $scope.data.selectedChassisUnit = '';
        $scope.chassisUnits = [];
        if ($scope.data.selectedHardware.yaml && $scope.data.selectedHardware.yaml.yaml && $scope.data.selectedHardware.yaml.yaml.rack_layout
                && $scope.data.selectedHardware.yaml.yaml.rack_layout.chassis) {
            $scope.chassisMounted = true;
            $scope.chassisUnits = Array.from(Array($scope.data.selectedHardware.yaml.yaml.rack_layout.chassis.units-1).keys()).map(x => ++x);
        }
        else {
            $scope.chassisMounted = false;
        }
    }

    $scope.addSelectedRegion = function(selectedRegion) {
        var exist = false;
        angular.forEach($scope.selectedRegions, function(region) {
            if (region.uuid.trim() === selectedRegion.uuid.trim()) {
                exist = true;
            }
        });
        if (!exist) {
            $scope.selectedRegions.push(selectedRegion);
        }
    }

    $scope.deleteSelectedRegion = function(selectedRegion) {
        var index = $scope.selectedRegions.indexOf(selectedRegion);
        $scope.selectedRegions.splice(index, 1);
    }

    $scope.addSelectedNode = function() {
        if (!$scope.data.nodeName || !$scope.data.nodeDescription
                || !$scope.data.selectedHardware
                || !$scope.data.rackName || !$scope.data.selectedRackSlot || ($scope.chassisMounted && !$scope.data.selectedChassisUnit)) {
            confirm("You must specify all data fields");
            return;
        }
        var yaml = '';
        if ($scope.chassisMounted) {
            yaml = {"rack_location": {"name" :  $scope.data.rackName, "slot":$scope.data.selectedRackSlot, "unit": $scope.data.selectedChassisUnit } };
        } else {
            yaml = {"rack_location": {"name" :  $scope.data.rackName, "slot":$scope.data.selectedRackSlot } };
        }
        var node = {
                "name" : $scope.data.nodeName,
                "description" : $scope.data.nodeDescription,
                "hardware" : $scope.data.selectedHardware.uuid,
                "yaml": yaml
        };
        $scope.selectedNodes.push(node);
    }

    $scope.deleteSelectedNode = function(node) {
        var index = $scope.selectedNodes.indexOf(node);
        $scope.selectedNodes.splice(index, 1);
    }

    $scope.cancel = function() {
        $modalInstance.close();
    }

    $scope.create = function() {
        if (!$scope.data.edgeSiteName || !$scope.selectedRegions || $scope.selectedRegions.length < 1
                || !$scope.selectedNodes || $scope.selectedNodes.length < 1) {
            confirm("You must specify all data fields");
            return;
        }
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
                                                            data) {
                                                        if (data) {
                                                            nodeUuids.push(data.uuid);
                                                            var text = "Node: "
                                                                    + node.name
                                                                    + " created successfully";
                                                            confirm(text);
                                                        } else {
                                                            var text2 = "Failed to create node: "
                                                                    + node.name
                                                            confirm(text2);
                                                        }
                                                    }));
                        });
        $q
                .all(promises)
                .then(
                        function() {
                            confirm("All nodes have been created");
                            var regionUuids = [];
                            angular.forEach($scope.selectedRegions, function(region) {
                                regionUuids.push(region.uuid);
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
                                    function(
                                            data) {
                                        if (data) {
                                            var text = "Edge Site: "
                                                    + edgeSite.name
                                                    + " created successfully";
                                            confirm(text);
                                        } else {
                                            var text2 = "Failed to create edge site: "
                                                    + edgeSite.name
                                            confirm(text2);
                                        }
                                    });
                            initialize();
                        });
    }

});
