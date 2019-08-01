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

var app = angular.module('AECEdgeSites');

app.controller('AECEdgeSitesController', function ($scope, restAPISvc,
    generalSvc, $modal, NgTableParams) {

    initialize();

    function initialize() {
        $scope.selectedEdgeSiteName = null;
        $scope.selectedEdgeSite = null;
        $scope.findRegionName = generalSvc.findRegionName;
        $scope.formulateRegion = generalSvc.formulateRegion;
        $scope.allRegions = [];
        $scope.locations = [];
        $scope.nodes = [];

        restAPISvc.getRestAPI("/api/v1/region/", function (regionData) {
            $scope.allRegions = regionData.regions;
            angular.forEach($scope.allRegions, function (region) {
                $scope.locations.push(region.name);
            });
            restAPISvc.getRestAPI("/api/v1/node/", function (nodes) {
                if (nodes && nodes.nodes) {
                    $scope.nodes = nodes.nodes;
                }
                restAPISvc.getRestAPI("/api/v1/edgesite/", function (edgeSiteData) {
                    var data = edgeSiteData.edgeSites;
                    $scope.tableParams = new NgTableParams({ page: 1, count: 5 }, { dataset: data });
                });
            });
        });
    }

    $scope.refreshEdgeSites = function () {
        initialize();
    }

    $scope.setClickedRow = function (edgeSite) {
        $scope.selectedEdgeSiteName = edgeSite.name;
        $scope.selectedEdgeSite = edgeSite;
    }

    $scope.calculateNumberOfRacks = function (edgeSite) {
        var rackNames = [];
        if (angular.isObject(edgeSite.nodes)) {
            angular.forEach(edgeSite.nodes,
                function (nodeId) {
                    angular.forEach($scope.nodes, function (nodeData) {
                        if (nodeData.uuid === nodeId) {
                            if (angular.isObject(nodeData.yaml) && angular.isObject(nodeData.yaml.rack_location)) {
                                if (rackNames.indexOf(nodeData.yaml.rack_location.name) === -1) {
                                    rackNames.push(nodeData.yaml.rack_location.name);
                                }
                            }
                        }
                    });
                });
        }
        return rackNames.length;
    }

    $scope.openCreateEdgeSiteModal = function () {
        /*var modalInstance = $modal.open({
            templateUrl: 'app/AECARCPortal/EdgeSites/CreateEdgeSite/CreateEdgeSiteModal.html',
            controller: 'AECCreateEdgeSiteController'
        });*/
    };

});
