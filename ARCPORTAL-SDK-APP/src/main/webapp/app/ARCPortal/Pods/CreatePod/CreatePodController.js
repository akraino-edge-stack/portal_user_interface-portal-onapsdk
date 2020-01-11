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
                        $scope.regions = [];
                        $scope.loadingRegions = true;
                        $scope.hardwares = [];
                        $scope.loadingHardwares = true;
                        $scope.nodes = [];
                        $scope.loadingNodes = true;
                        $scope.data = {};
                        $scope.validEdgeSites = [];
                        $scope.validBlueprints = [];
                        $scope.configFile = '';
                        $scope.enhancedBlueprints = [];

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
                                            angular
                                                    .forEach(
                                                            $scope.blueprints,
                                                            function(blueprint) {
                                                                blueprint.name = blueprint.name
                                                                        + " Version: "
                                                                        + blueprint.version;
                                                                $scope.enhancedBlueprints
                                                                        .push(blueprint);
                                                            });
                                            restAPISvc
                                                    .getRestAPI(
                                                            "/api/v1/hardware/",
                                                            function(response) {
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
                    }

                    $scope.selectedRegionChange = function() {
                        $scope.data.selectedEdgeSite = '';
                        $scope.validEdgeSites = [];
                        $scope.data.selectedBlueprint = '';
                        $scope.validBlueprints = [];
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
                        angular
                                .forEach(
                                        $scope.enhancedBlueprints,
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
                    }

                    $scope.cancel = function() {
                        $modalInstance.close();
                    }

                    $scope.uploadConfigFile = function($fileContent) {
                        try {
                            $scope.configFile = jsyaml.load($fileContent);
                        } catch (e) {
                            try {
                                $scope.configFile = JSON.parse(JSON
                                        .stringify($fileContent));
                            } catch (e2) {
                                confirm("This file format is not supported");
                                return;
                            }
                        }
                    }

                    $scope.createPod = function() {
                        if (!$scope.configFile) {
                            confirm("You must upload a config file");
                            return;
                        }
                        if (!$scope.configFile.yaml) {
                            if (!$scope.data || !$scope.data.selectedPodName
                                    || !$scope.data.selectedPodDescription
                                    || !$scope.data.selectedRegion
                                    || !$scope.data.selectedEdgeSite
                                    || !$scope.data.selectedBlueprint) {
                                confirm("You must specify all data fields");
                                return;
                            }
                        }
                        var pod = '';
                        if (!$scope.configFile.yaml) {
                            pod = {
                                "name" : $scope.data.selectedPodName,
                                "description" : $scope.data.selectedPodDescription,
                                "blueprint" : $scope.data.selectedBlueprint.uuid,
                                "edgesite" : $scope.data.selectedEdgeSite.uuid,
                                "yaml" : $scope.configFile
                            };
                        } else {
                            pod = $scope.configFile;
                        }
                        var isPodNameUnique = true;
                        angular.forEach($scope.pods, function(storedPod) {
                            if (storedPod.edgesite.trim() === pod.edgesite
                                    .trim()) {
                                if (storedPod.name.trim() === pod.name.trim()) {
                                    isPodNameUnique = false;
                                }
                            }
                        });
                        if (!isPodNameUnique) {
                            confirm("Pod name: "
                                    + pod.name
                                    + " is already used in edge site: "
                                    + generalSvc.retrieveName($scope.edgeSites,
                                            pod.edgesite));
                            return;
                        }
                        $scope.creatingPod = true;
                        restAPISvc
                                .postRestAPI(
                                        "/api/v1/pod/",
                                        pod,
                                        function(response) {
                                            $scope.creatingPod = false;
                                            if (response.status == 200
                                                    || response.status == 201) {
                                                confirm("POD: "
                                                        + pod.name
                                                        + " has been created successfully");
                                            } else {
                                                var errorMessage = JSON
                                                        .stringify(response.data.message);
                                                var messages = errorMessage
                                                        .split(' ');
                                                errorMessage = '';
                                                for (var index = 0; index < messages.length; index++) {
                                                    var temp = messages[index];
                                                    if ((messages[index]
                                                            .match(/-/g) || []).length == 4) {
                                                        temp = generalSvc
                                                                .retrieveName(
                                                                        $scope.pods,
                                                                        messages[index]
                                                                                .replace(
                                                                                        '"',
                                                                                        ''));
                                                        if (!temp) {
                                                            temp = generalSvc
                                                                    .retrieveName(
                                                                            $scope.edgeSites,
                                                                            messages[index]
                                                                                    .replace(
                                                                                            '"',
                                                                                            ''));
                                                            if (!temp) {
                                                                temp = generalSvc
                                                                        .retrieveName(
                                                                                $scope.enhancedBlueprints,
                                                                                messages[index]
                                                                                        .replace(
                                                                                                '"',
                                                                                                ''));
                                                                if (!temp) {
                                                                    temp = generalSvc
                                                                            .retrieveName(
                                                                                    $scope.nodes,
                                                                                    messages[index]
                                                                                            .replace(
                                                                                                    '"',
                                                                                                    ''));
                                                                }
                                                            }
                                                        }
                                                    }
                                                    errorMessage = errorMessage
                                                            + " " + temp;
                                                }
                                                var text2 = "Failed to create POD: "
                                                        + pod.name;
                                                confirm(text2 + ". "
                                                        + errorMessage);
                                            }
                                            $modalInstance.close();
                                            $window.location.href = appContext
                                                    + "/pods";
                                        });
                    }
                });