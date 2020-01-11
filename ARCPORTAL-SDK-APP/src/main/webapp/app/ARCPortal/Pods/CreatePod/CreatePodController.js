/*
 * Copyright (c) 2020 AT&T Intellectual Property. All rights reserved.
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

var app = angular.module('Pods');

app
        .controller(
                'CreatePodController',
                function($scope, restAPISvc, appContext, $modalInstance,
                        $window, generalSvc) {

                    initialize();

                    function initialize() {
                        $scope.creatingPod = false;
                        $scope.pod = '';
                        $scope.regions = [];
                        $scope.loadingRegions = true;
                        $scope.edgeSites = [];
                        $scope.loadingEdgeSites = true;
                        $scope.blueprints = [];
                        $scope.loadingBlueprints = true;
                        $scope.hardwares = [];
                        $scope.loadingHardwares = true;
                        $scope.nodes = [];
                        $scope.loadingNodes = true;
                        $scope.data = {};
                        $scope.validEdgeSites = [];
                        $scope.validBlueprints = [];

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
                                                            "/api/v1/edgesite/",
                                                            function(response) {
                                                                $scope.loadingEdgeSites = false;
                                                                if (response.status == 200) {
                                                                    $scope.edgeSites = response.data.edgeSites;
                                                                } else {
                                                                    confirm("No Edge Sites found");
                                                                }
                                                                restAPISvc
                                                                        .getRestAPI(
                                                                                "/api/v1/blueprint/",
                                                                                function(
                                                                                        response) {
                                                                                    $scope.loadingBlueprints = false;
                                                                                    if (response.status == 200) {
                                                                                        angular
                                                                                                .forEach(
                                                                                                        response.data.blueprints,
                                                                                                        function(
                                                                                                                blueprint) {
                                                                                                            blueprint.name = blueprint.name
                                                                                                                    + " Version: "
                                                                                                                    + blueprint.version;
                                                                                                            $scope.blueprints
                                                                                                                    .push(blueprint);
                                                                                                        });
                                                                                    } else {
                                                                                        confirm("No Blueprints found");
                                                                                    }
                                                                                    restAPISvc
                                                                                            .getRestAPI(
                                                                                                    "/api/v1/hardware/",
                                                                                                    function(
                                                                                                            response) {
                                                                                                        $scope.loadingHardwares = false;
                                                                                                        if (response.status == 200) {
                                                                                                            $scope.hardwares = response.data.hardware;
                                                                                                        } else {
                                                                                                            confirm("No Hardwares found");
                                                                                                        }
                                                                                                        restAPISvc
                                                                                                                .getRestAPI(
                                                                                                                        "/api/v1/node/",
                                                                                                                        function(
                                                                                                                                response) {
                                                                                                                            $scope.loadingNodes = false;
                                                                                                                            if (response.status == 200) {
                                                                                                                                $scope.nodes = response.data.nodes;
                                                                                                                            } else {
                                                                                                                                confirm("No Nodes found");
                                                                                                                            }
                                                                                                                        });
                                                                                                    });
                                                                                });
                                                            });
                                        });
                    }

                    $scope.selectedRegionChange = function() {
                        $scope.data.selectedEdgeSite = '';
                        $scope.validEdgeSites = [];
                        $scope.data.selectedBlueprint = '';
                        $scope.validBlueprints = [];
                        $scope.pod = '';
                        angular
                                .forEach(
                                        $scope.edgeSites,
                                        function(edgeSite) {
                                            angular
                                                    .forEach(
                                                            edgeSite.regions,
                                                            function(region) {
                                                                if (region
                                                                        .toString()
                                                                        .trim() === $scope.data.selectedRegion.uuid
                                                                        .toString()
                                                                        .trim()) {
                                                                    $scope.validEdgeSites
                                                                            .push(edgeSite);
                                                                }
                                                            });
                                        });
                        if (!$scope.validEdgeSites
                                || $scope.validEdgeSites.length === 0) {
                            confirm("No appropriate Edge sites found");
                        }
                    }

                    $scope.selectedEdgeSiteChange = function() {
                        $scope.data.selectedBlueprint = '';
                        $scope.validBlueprints = [];
                        $scope.pod = '';
                        angular
                                .forEach(
                                        $scope.blueprints,
                                        function(blueprint) {
                                            if (blueprint.yaml
                                                    && blueprint.yaml.hardware_profile
                                                    && blueprint.yaml.hardware_profile.or) {
                                                var requiredHardwareUuids = [];
                                                angular
                                                        .forEach(
                                                                blueprint.yaml.hardware_profile.or,
                                                                function(
                                                                        hardware) {
                                                                    if (hardware.uuid) {
                                                                        if (requiredHardwareUuids
                                                                                .indexOf(hardware.uuid) === -1) {
                                                                            requiredHardwareUuids
                                                                                    .push(hardware.uuid);
                                                                        }
                                                                    } else if (hardware.name) {
                                                                        if (requiredHardwareUuids
                                                                                .indexOf(generalSvc
                                                                                        .retrieveUuid(
                                                                                                $scope.hardwares,
                                                                                                hardware.name)) === -1) {
                                                                            requiredHardwareUuids
                                                                                    .push(generalSvc
                                                                                            .retrieveUuid(
                                                                                                    $scope.hardwares,
                                                                                                    hardware.name));
                                                                        }
                                                                    }
                                                                });
                                                var hardwareRequirementFulfilled = false;
                                                angular
                                                        .forEach(
                                                                $scope.data.selectedEdgeSite.nodes,
                                                                function(node) {
                                                                    var nodeObj = '';
                                                                    angular
                                                                            .forEach(
                                                                                    $scope.nodes,
                                                                                    function(
                                                                                            nodeObjRc) {
                                                                                        if (nodeObjRc.uuid
                                                                                                .toString()
                                                                                                .trim() === node
                                                                                                .toString()
                                                                                                .trim()) {
                                                                                            nodeObj = nodeObjRc;
                                                                                        }
                                                                                    });
                                                                    if (nodeObj) {
                                                                        if (requiredHardwareUuids
                                                                                .indexOf(nodeObj.hardware) !== -1) {
                                                                            hardwareRequirementFulfilled = true;
                                                                        }
                                                                    }
                                                                });
                                                if (hardwareRequirementFulfilled) {
                                                    $scope.validBlueprints
                                                            .push(blueprint);
                                                }
                                            }
                                        });
                        if (!$scope.validBlueprints
                                || $scope.validBlueprints.length === 0) {
                            confirm("No appropriate blueprints found");
                        }
                    }

                    $scope.selectedBlueprintChange = function() {
                        $scope.pod = '';
                    }

                    $scope.cancel = function() {
                        $modalInstance.close();
                    }

                    $scope.uploadPod = function($fileContent) {
                        if (!$scope.data || !$scope.data.selectedPodName
                                || !$scope.data.selectedPodDescription
                                || !$scope.data.selectedRegion
                                || !$scope.data.selectedEdgeSite
                                || !$scope.data.selectedBlueprint) {
                            confirm("You must specify all data fields");
                            return;
                        }
                        $scope.pod = '';
                        var payload = '';
                        try {
                            payload = jsyaml.load($fileContent);
                        } catch (e) {
                            try {
                                payload = JSON.parse(JSON
                                        .stringify($fileContent));
                            } catch (e2) {
                                confirm("This file format is not supported");
                                return;
                            }
                        }
                        if (!payload.yaml) {
                            $scope.pod = {
                                "name" : $scope.data.selectedPodName,
                                "description" : $scope.data.selectedPodDescription,
                                "blueprint" : $scope.data.selectedBlueprint.uuid,
                                "edgesite" : $scope.data.selectedEdgeSite.uuid,
                                "yaml" : payload
                            };
                        } else {
                            $scope.pod = payload;
                        }

                    }

                    $scope.createPod = function() {
                        if (!$scope.pod) {
                            confirm("You must first configure correctly a POD");
                            return;
                        }
                        $scope.creatingPod = true;
                        restAPISvc
                                .postRestAPI(
                                        "/api/v1/pod/",
                                        $scope.pod,
                                        function(response) {
                                            $scope.creatingPod = false;
                                            if (response.status == 200
                                                    || response.status == 201) {
                                                confirm("POD: "
                                                        + $scope.pod.name
                                                        + " has been created successfully");
                                            } else {
                                                var text2 = "Failed to create POD: "
                                                        + $scope.pod.name;
                                                confirm(text2
                                                        + ". "
                                                        + JSON
                                                                .stringify(response.data));
                                            }
                                            $modalInstance.close();
                                            $window.location.href = appContext
                                                    + "/pods";
                                        });
                    }
                });