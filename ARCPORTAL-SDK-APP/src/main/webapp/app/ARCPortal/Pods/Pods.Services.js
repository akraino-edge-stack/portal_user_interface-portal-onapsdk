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
        .factory(
                'podsSvc',
                function() {
                    var svc = [];
                    svc.getNodesOfAnEdgeSite = function(edgeSite, storedNodes) {
                        var nodes = [];
                        angular.forEach(edgeSite.nodes, function(nodeId) {
                            angular.forEach(storedNodes, function(node) {
                                if (nodeId.toString().trim() === node.uuid
                                        .toString().trim()) {
                                    nodes.push(node);
                                }
                            });
                        });
                        return nodes;
                    };
                    svc.getNodesOfARack = function(rackName, nodesOfEdgeSite,
                            hardwares) {
                        var nodesOfRack = [];
                        angular
                                .forEach(
                                        nodesOfEdgeSite,
                                        function(nodeOfEdgeSite) {
                                            if (nodeOfEdgeSite.yaml
                                                    && nodeOfEdgeSite.yaml.rack_location
                                                    && nodeOfEdgeSite.yaml.rack_location.name
                                                            .toString().trim() === rackName
                                                            .toString().trim()) {
                                                var tempNode = nodeOfEdgeSite;
                                                angular
                                                        .forEach(
                                                                hardwares,
                                                                function(
                                                                        hardware) {
                                                                    if (hardware.uuid
                                                                            .toString()
                                                                            .trim() === nodeOfEdgeSite.hardware
                                                                            .toString()
                                                                            .trim()) {
                                                                        tempNode.hardware = hardware;
                                                                    }
                                                                });
                                                nodesOfRack.push(tempNode);
                                            }
                                        });
                        return nodesOfRack;
                    };
                    svc.constructHtmlRepresentationOfNodes = function(
                            currentNodes, rackName, slot) {
                        var currentHtmlCode = '';
                        if (currentNodes && currentNodes.length > 0) {
                            if (currentNodes.length > 1
                                    && !currentNodes[0].hardware.yaml.yaml.rack_layout.chassis) {
                                /* eslint-disable no-console */
                                console
                                        .log("Warning: Multiple rack mounted nodes on the same slot!");
                                /* eslint-enable no-console */
                            }
                            if (currentNodes[0].hardware.yaml.yaml.rack_layout.chassis) {
                                // chassis mounted
                                var height = parseInt(currentNodes[0].hardware.yaml.yaml.rack_layout.chassis.height
                                        .slice(0, -1));
                                var units = parseInt(currentNodes[0].hardware.yaml.yaml.rack_layout.chassis.units);
                                for (var index = 1; index <= units; index++) {
                                    var nodeOfUnit = '';
                                    angular
                                            .forEach(
                                                    currentNodes,
                                                    function(currentNode) {
                                                        if (parseInt(currentNode.yaml.rack_location.unit) == index) {
                                                            nodeOfUnit = currentNode;
                                                        }
                                                    });
                                    if (nodeOfUnit) {
                                        if (index & 1) {
                                            // odd
                                            currentHtmlCode = currentHtmlCode
                                                    + '<div>';
                                            currentHtmlCode = currentHtmlCode
                                                    + '<svg width="70" height="50" style="display:inline-block;"> <rect style="fill:rgb(93, 184, 91);stroke-width:3;stroke:rgb(0,0,0)" height="40" width="200"></rect></svg>'
                                                    + '<div class="tooltip">Details<span class="tooltiptext"><p>Node name: '
                                                    + nodeOfUnit.name + '</p>'
                                                    + '<p>Hardware: '
                                                    + nodeOfUnit.hardware.name
                                                    + '</p>' + '<p>Rack: '
                                                    + rackName + '</p>'
                                                    + '<p>Rack position: '
                                                    + slot + '</p>'
                                                    + '<p>Unit: ' + index
                                                    + '</p>'
                                                    + '<p>Occupied slots: '
                                                    + height + '</p>'
                                                    + '</span>' + '</div>';
                                        } else {
                                            // even
                                            currentHtmlCode = currentHtmlCode
                                                    + '<svg width="70" height="50" style="display:inline-block;"> <rect style="fill:rgb(93, 184, 91);stroke-width:3;stroke:rgb(0,0,0)" height="40" width="200"></rect></svg>'
                                                    + '<div class="tooltip">Details<span class="tooltiptext"><p>Node name: '
                                                    + nodeOfUnit.name + '</p>'
                                                    + '<p>Hardware: '
                                                    + nodeOfUnit.hardware.name
                                                    + '</p>' + '<p>Rack: '
                                                    + rackName + '</p>'
                                                    + '<p>Rack position: '
                                                    + slot + '</p>'
                                                    + '<p>Unit: ' + index
                                                    + '</p>'
                                                    + '<p>Occupied slots: '
                                                    + height + '</p>'
                                                    + '</span>' + '</div>';
                                            currentHtmlCode = currentHtmlCode
                                                    + '</div>';
                                        }
                                    } else {
                                        if (index & 1) {
                                            // odd
                                            currentHtmlCode = currentHtmlCode
                                                    + '<div>';
                                            currentHtmlCode = currentHtmlCode
                                                    + '<svg width="70" height="50" style="display:inline-block;"> <rect style="fill:rgb(239, 240, 246);stroke-width:3;stroke:rgb(0,0,0)" height="40" width="200"></rect></svg>'
                                                    + '<div class="tooltip">Details<span class="tooltiptext"><p> Free unit'
                                                    + '</p>' + '<p>Rack: '
                                                    + rackName + '</p>'
                                                    + '<p>Rack position: '
                                                    + slot + '</p>'
                                                    + '<p>Unit: ' + index
                                                    + '</p>' + '</span>'
                                                    + '</div>';
                                        } else {
                                            // even
                                            currentHtmlCode = currentHtmlCode
                                                    + '<svg width="70" height="50" style="display:inline-block;"> <rect style="fill:rgb(239, 240, 246);stroke-width:3;stroke:rgb(0,0,0)" height="40" width="200"></rect></svg>'
                                                    + '<div class="tooltip">Details<span class="tooltiptext"><p> Free unit'
                                                    + '</p>' + '<p>Rack: '
                                                    + rackName + '</p>'
                                                    + '<p>Rack position: '
                                                    + slot + '</p>'
                                                    + '<p>Unit: ' + index
                                                    + '</p>' + '</span>'
                                                    + '</div>';
                                            currentHtmlCode = currentHtmlCode
                                                    + '</div>';
                                        }
                                    }
                                }
                                if (units & 1) {
                                    currentHtmlCode = currentHtmlCode
                                            + '</div>';
                                }
                            } else {
                                // rack mounted
                                var height = parseInt(currentNodes[0].hardware.yaml.yaml.rack_layout.height
                                        .slice(0, -1));
                                var nodeHeight = 50;
                                for (var index = 1; index < height; index++) {
                                    nodeHeight = nodeHeight + 50;
                                }
                                currentHtmlCode = currentHtmlCode
                                        + '<div>'
                                        + '<svg width="200" height="'
                                        + nodeHeight.toString()
                                        + '" style="display:inline-block;"> <rect style="fill:rgb(93, 184, 91);stroke-width:3;stroke:rgb(0,0,0)" height="'
                                        + (nodeHeight - 10).toString()
                                        + '" width="200"></rect></svg>'
                                        + '<div class="tooltip">Details<span class="tooltiptext"><p>Node name: '
                                        + currentNodes[0].name + '</p>'
                                        + '<p>Hardware: '
                                        + currentNodes[0].hardware.name
                                        + '</p>' + '<p>Rack: ' + rackName
                                        + '</p>' + '<p>Rack position: ' + slot
                                        + '</p>' + '<p>Occupied slots: '
                                        + height + '</p>' + '</span>'
                                        + '</div>' + '</div>';
                            }
                        } else {
                            currentHtmlCode = currentHtmlCode
                                    + '<div> <svg width="200" height="50" style="display:inline-block;"> <rect style="fill:rgb(239, 240, 246);stroke-width:3;stroke:rgb(0,0,0)" height="40" width="200"></rect> </svg>'
                                    + '<div class="tooltip">Details<span class="tooltiptext"><p> Free Slot'
                                    + '</p>' + '<p>Rack: ' + rackName + '</p>'
                                    + '<p>Rack position: ' + slot + '</p>'
                                    + '</span>' + '</div>';
                            currentHtmlCode = currentHtmlCode + '</div>';
                        }
                        return currentHtmlCode;
                    };
                    svc.getHeight = function(currentNodes) {
                        var height = 1;
                        if (currentNodes && currentNodes.length > 0) {
                            if (currentNodes.length > 1
                                    && !currentNodes[0].hardware.yaml.yaml.rack_layout.chassis) {
                                /* eslint-disable no-console */
                                console
                                        .log("Warning: Multiple rack mounted nodes on the same slot!");
                                /* eslint-enable no-console */
                            }
                            if (currentNodes[0].hardware.yaml.yaml.rack_layout.chassis) {
                                height = parseInt(currentNodes[0].hardware.yaml.yaml.rack_layout.chassis.height
                                        .slice(0, -1));
                            } else {
                                height = parseInt(currentNodes[0].hardware.yaml.yaml.rack_layout.height
                                        .slice(0, -1));
                            }
                        }
                        return height;
                    };
                    return svc;
                });