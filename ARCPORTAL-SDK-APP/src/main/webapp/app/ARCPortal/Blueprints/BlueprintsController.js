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

app
        .controller(
                'BlueprintsController',
                function($scope, restAPISvc, $modal, NgTableParams, generalSvc) {

                    initialize();

                    function initialize() {
                        $scope.getHardwareProfile = generalSvc.getHardwareProfile;
                        $scope.selectedBlueprintUuid = '';
                        $scope.selectedBlueprint = '';
                        $scope.allBlueprints = [];
                        $scope.hardwares = [];
                        $scope.loadingHardwares = true;

                        restAPISvc
                                .getRestAPI(
                                        "/api/v1/hardware/",
                                        function(hardware) {
                                            $scope.loadingHardwares = false;
                                            if (hardware) {
                                                $scope.hardwares = hardware.hardware;
                                            } else {
                                                confirm("No hardware profiles found");
                                            }
                                            restAPISvc
                                                    .getRestAPI(
                                                            "/api/v1/blueprint/",
                                                            function(
                                                                    blueprintData) {
                                                                $scope.allBlueprints = blueprintData.blueprints;
                                                                $scope.tableParams = new NgTableParams(
                                                                        {
                                                                            page : 1,
                                                                            count : 5
                                                                        },
                                                                        {
                                                                            dataset : $scope.allBlueprints
                                                                        });

                                                            });
                                        });
                    }

                    $scope.refreshBlueprints = function() {
                        initialize();
                    }

                    $scope.setClickedRow = function(blueprint) {
                        $scope.selectedBlueprintUuid = blueprint.uuid;
                        $scope.selectedBlueprint = blueprint;
                    }

                    $scope.openUploadBlueprintModal = function() {
                        $modal
                                .open({
                                    templateUrl : 'app/ARCPortal/Blueprints/UploadBlueprint/UploadBlueprintModal.html',
                                    controller : 'UploadBlueprintController'
                                });
                    };

                });