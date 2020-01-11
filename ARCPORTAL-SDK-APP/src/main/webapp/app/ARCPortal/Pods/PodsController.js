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

app.controller('PodsController', function($scope, restAPISvc, $modal,
        NgTableParams, generalSvc) {

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

        restAPISvc.getRestAPI("/api/v1/checkConnectivity/", function(response) {
            if (response.status == 200) {
                restAPISvc.getRestAPI("/api/v1/edgesite/", function(response) {
                    $scope.loadingEdgeSites = false;
                    if (response.status == 200) {
                        $scope.edgeSites = response.data.edgeSites;
                    } else {
                        confirm("No Edge Sites found");
                    }
                    restAPISvc.getRestAPI("/api/v1/blueprint/", function(
                            response) {
                        $scope.loadingBlueprints = false;
                        if (response.status == 200) {
                            $scope.blueprints = response.data.blueprints;
                        } else {
                            confirm("No Blueprints found");
                        }
                        restAPISvc.getRestAPI("/api/v1/pod/",
                                function(response) {
                                    $scope.pods = response.data.pods;
                                    $scope.tableParams = new NgTableParams({
                                        page : 1,
                                        count : 5
                                    }, {
                                        dataset : $scope.pods
                                    });
                                });
                    });
                });
            } else {
                $scope.loadingEdgeSites = false;
                $scope.loadingBlueprints = false;
                confirm("Regional controller is not reachable. "
                        + JSON.stringify(response.data));
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
    }

    $scope.openCreatePodModal = function() {
        $modal.open({
            templateUrl : 'app/ARCPortal/Pods/CreatePod/CreatePodModal.html',
            controller : 'CreatePodController',
            size : 'sm',
            scope : $scope
        });
    };

});