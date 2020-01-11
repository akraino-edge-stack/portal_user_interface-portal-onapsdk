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
                'EdgeSitesController',
                function($scope, restAPISvc, generalSvc, $modal, NgTableParams,
                        edgeSiteSvc) {

                    initialize();

                    function initialize() {
                        $scope.calculateNumberOfRacks = edgeSiteSvc.calculateNumberOfRacks;
                        $scope.selectedEdgeSiteUuid = '';
                        $scope.selectedEdgeSite = '';
                        $scope.findRegionName = generalSvc.retrieveName;
                        $scope.formulateRegion = edgeSiteSvc.formulateRegion;
                        $scope.locations = [];
                        $scope.allRegions = [];
                        $scope.loadingRegions = true;
                        $scope.nodes = [];
                        $scope.loadingNodes = true;
                        $scope.pods = [];
                        $scope.loadingPods = true;
                        $scope.blueprints = [];
                        $scope.loadingBlueprints = true;
                        $scope.decommissioningPod = false;
                        $scope.edgeSites = [];

                        restAPISvc
                                .getRestAPI(
                                        "/api/v1/checkConnectivity/",
                                        function(response) {
                                            if (response.status == 200) {
                                                restAPISvc
                                                        .getRestAPI(
                                                                "/api/v1/region/",
                                                                function(
                                                                        response) {
                                                                    $scope.loadingRegions = false;
                                                                    if (response.status == 200) {
                                                                        $scope.allRegions = response.data.regions;
                                                                    } else {
                                                                        confirm("No regions found");
                                                                    }
                                                                    angular
                                                                            .forEach(
                                                                                    $scope.allRegions,
                                                                                    function(
                                                                                            region) {
                                                                                        $scope.locations
                                                                                                .push(region.name);
                                                                                    });
                                                                    restAPISvc
                                                                            .getRestAPI(
                                                                                    "/api/v1/node/",
                                                                                    function(
                                                                                            response) {
                                                                                        $scope.loadingNodes = false;
                                                                                        if (response.status == 200
                                                                                                && response.data.nodes) {
                                                                                            $scope.nodes = response.data.nodes;
                                                                                        } else {
                                                                                            confirm("No Nodes found");
                                                                                        }
                                                                                        restAPISvc
                                                                                                .getRestAPI(
                                                                                                        "/api/v1/pod/",
                                                                                                        function(
                                                                                                                response) {
                                                                                                            $scope.loadingPods = false;
                                                                                                            if (response.status == 200
                                                                                                                    && response.data.pods) {
                                                                                                                $scope.pods = response.data.pods;
                                                                                                            } else {
                                                                                                                confirm("No pods found");
                                                                                                            }
                                                                                                            restAPISvc
                                                                                                                    .getRestAPI(
                                                                                                                            "/api/v1/blueprint/",
                                                                                                                            function(
                                                                                                                                    response) {
                                                                                                                                $scope.loadingBlueprints = false;
                                                                                                                                if (response.status == 200
                                                                                                                                        && response.data.blueprints) {
                                                                                                                                    $scope.blueprints = response.data.blueprints;
                                                                                                                                } else {
                                                                                                                                    confirm("No blueprints found");
                                                                                                                                }
                                                                                                                                restAPISvc
                                                                                                                                        .getRestAPI(
                                                                                                                                                "/api/v1/edgesite/",
                                                                                                                                                function(
                                                                                                                                                        response) {
                                                                                                                                                    $scope.edgeSites = response.data.edgeSites;
                                                                                                                                                    var data = [];
                                                                                                                                                    angular
                                                                                                                                                            .forEach(
                                                                                                                                                                    response.data.edgeSites,
                                                                                                                                                                    function(
                                                                                                                                                                            edgeSite) {
                                                                                                                                                                        var temp = edgeSite;
                                                                                                                                                                        temp.pod = edgeSiteSvc
                                                                                                                                                                                .findPod(
                                                                                                                                                                                        edgeSite,
                                                                                                                                                                                        $scope.pods);
                                                                                                                                                                        temp.blueprint = edgeSiteSvc
                                                                                                                                                                                .findBlueprint(
                                                                                                                                                                                        temp.pod,
                                                                                                                                                                                        $scope.blueprints);
                                                                                                                                                                        data
                                                                                                                                                                                .push(temp);
                                                                                                                                                                    });
                                                                                                                                                    $scope.tableParams = new NgTableParams(
                                                                                                                                                            {
                                                                                                                                                                page : 1,
                                                                                                                                                                count : 5
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                dataset : data
                                                                                                                                                            });
                                                                                                                                                });
                                                                                                                            });
                                                                                                        });
                                                                                    });
                                                                });
                                            } else {
                                                $scope.loadingRegions = false;
                                                $scope.loadingNodes = false;
                                                $scope.loadingPods = false;
                                                $scope.loadingBlueprints = false;
                                                $scope.decommissioningPod = false;
                                                confirm("Regional controller is not reachable. "
                                                        + JSON
                                                                .stringify(response.data));
                                                return;
                                            }
                                        });
                    }

                    $scope.refreshEdgeSites = function() {
                        initialize();
                    }

                    $scope.setClickedRow = function(edgeSite) {
                        $scope.selectedEdgeSiteUuid = edgeSite.uuid;
                        $scope.selectedEdgeSite = edgeSite;
                    }

                    $scope.decommissionPod = function() {
                        if (!$scope.selectedEdgeSite
                                || !$scope.selectedEdgeSite.pod
                                || !$scope.selectedEdgeSite.pod.uuid) {
                            confirm("Please select an Edge Site with a POD");
                            return;
                        }
                        $scope.decommissioningPod = true;
                        restAPISvc
                                .deleteRestAPI(
                                        "/api/v1/pod/"
                                                + $scope.selectedEdgeSite.pod.uuid,
                                        function(response) {
                                            $scope.decommissioningPod = false;
                                            if (response.status == 200
                                                    || response.status == 202
                                                    || response.status == 204) {
                                                confirm("POD decommissioned successfully");
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
                                                    }
                                                    errorMessage = errorMessage
                                                            + " " + temp;
                                                }
                                                var text2 = "Failed to decommission POD. "
                                                        + errorMessage;
                                                confirm(text2);
                                            }
                                        });
                    }

                    $scope.openCreateEdgeSiteModal = function() {
                        $modal
                                .open({
                                    templateUrl : 'app/ARCPortal/EdgeSites/CreateEdgeSite/CreateEdgeSiteModal.html',
                                    controller : 'CreateEdgeSiteController',
                                    size : 'sm',
                                    scope : $scope
                                });
                    };

                });
