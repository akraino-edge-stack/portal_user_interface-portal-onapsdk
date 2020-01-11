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
                'PodsController',
                function($scope, restAPISvc, $modal, NgTableParams, generalSvc,
                        $sce, podsSvc) {

                    initialize();

                    function initialize() {
                        $scope.retrieveName = generalSvc.retrieveName;
                        $scope.selectedPodUuid = '';
                        $scope.selectedPod = '';
                        $scope.edgeSites = [];
                        $scope.pods = [];
                        $scope.blueprints = [];
                        $scope.loadingEdgeSites = true;
                        $scope.loadingBlueprints = true;
                        $scope.nodes = [];
                        $scope.loadingNodes = true;
                        $scope.hardwares = [];
                        $scope.loadingHardwares = true;
                        $scope.guiOfNodes = {};
                        $scope.displayNode = podsSvc.displayNode;
                        $scope.hideNode = podsSvc.hideNode;

                        restAPISvc
                                .getRestAPI(
                                        "/api/v1/checkConnectivity/",
                                        function(response) {
                                            if (response.status == 200) {
                                                restAPISvc
                                                        .getRestAPI(
                                                                "/api/v1/edgesite/",
                                                                function(
                                                                        response) {
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
                                                                                            $scope.blueprints = response.data.blueprints;
                                                                                        } else {
                                                                                            confirm("No Blueprints found");
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
                                                                                                                                                "/api/v1/pod/",
                                                                                                                                                function(
                                                                                                                                                        response) {
                                                                                                                                                    $scope.pods = response.data.pods;
                                                                                                                                                    $scope.tableParams = new NgTableParams(
                                                                                                                                                            {
                                                                                                                                                                page : 1,
                                                                                                                                                                count : 5
                                                                                                                                                            },
                                                                                                                                                            {
                                                                                                                                                                dataset : $scope.pods
                                                                                                                                                            });
                                                                                                                                                });
                                                                                                                            });
                                                                                                        });
                                                                                    });
                                                                });
                                            } else {
                                                $scope.loadingEdgeSites = false;
                                                $scope.loadingBlueprints = false;
                                                confirm("Regional controller is not reachable. "
                                                        + JSON
                                                                .stringify(response.data));
                                                return;
                                            }
                                        });
                    }

                    $scope.refreshPods = function() {
                        initialize();
                    }

                    $scope.setClickedRow = function(pod) {
                        $scope.selectedPodUuid = pod.uuid;
                        $scope.selectedPod = pod;
                        var edgeSiteOfPod = '';
                        angular.forEach($scope.edgeSites, function(edgeSite) {
                            if (edgeSite.uuid.trim() === pod.edgesite.trim()) {
                                edgeSiteOfPod = edgeSite;
                            }
                        });
                        if (!edgeSiteOfPod) {
                            confirm("No Edge Site found for the selected POD");
                            return;
                        }
                        var nodesOfEdgeSite = podsSvc.getNodesOfAnEdgeSite(
                                edgeSiteOfPod, $scope.nodes);
                        var rackNames = [];
                        angular
                                .forEach(
                                        nodesOfEdgeSite,
                                        function(node) {
                                            if (node.yaml
                                                    && node.yaml.rack_location) {
                                                if (rackNames
                                                        .indexOf(node.yaml.rack_location.name) == -1) {
                                                    rackNames
                                                            .push(node.yaml.rack_location.name);
                                                }
                                            }
                                        });
                        var htmlCode = '';
                        angular
                                .forEach(
                                        rackNames,
                                        function(rackName) {
                                            var nodesOfRack = podsSvc
                                                    .getNodesOfARack(rackName,
                                                            nodesOfEdgeSite,
                                                            $scope.hardwares);
                                            htmlCode = htmlCode
                                                    + '<div style="display:inline-block;">';
                                            htmlCode = htmlCode
                                                    + '<font size="5">'
                                                    + rackName + '</font>';
                                            for (var index = 1; index <= 42; index++) {
                                                var currentNodes = [];
                                                angular
                                                        .forEach(
                                                                nodesOfRack,
                                                                function(
                                                                        nodeOfRack) {
                                                                    if (parseInt(nodeOfRack.yaml.rack_location.slot) == index) {
                                                                        currentNodes
                                                                                .push(nodeOfRack);
                                                                    }
                                                                });
                                                htmlCode = htmlCode
                                                        + podsSvc
                                                                .constructHtmlRepresentationOfNodes(
                                                                        currentNodes,
                                                                        rackName,
                                                                        index);
                                                index = index
                                                        + podsSvc
                                                                .getHeight(currentNodes)
                                                        - 1;
                                            }
                                            htmlCode = htmlCode + '</div>';
                                        });
                        $scope.guiOfNodes = $sce.trustAsHtml(htmlCode);
                    }

                    $scope.openCreatePodModal = function() {
                        $modal
                                .open({
                                    templateUrl : 'app/ARCPortal/Pods/CreatePod/CreatePodModal.html',
                                    controller : 'CreatePodController',
                                    size : 'sm',
                                    scope : $scope
                                });
                    };

                });