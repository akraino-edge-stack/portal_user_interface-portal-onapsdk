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
                        if (!currentNodes || currentNodes.length == 0) {
                            return currentHtmlCode;
                        }
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
                            var chassisHeightForRect = 20 * height;
                            var chassisYAxisForRect = 831 - (slot - 1) * 20
                                    - (height - 1) * 20;
                            var chassisHeightForG = 15 * height;
                            var chassisYAxisForG = 833 - (slot - 1) * 20.1
                                    - (height - 1) * 20.1;
                            currentHtmlCode = currentHtmlCode
                                    + '<rect style="fill:#eeeeee;stroke:#36393d" pointer-events="none" height="'
                                    + chassisHeightForRect.toString()
                                    + '" width="168"'
                                    + ' y="'
                                    + chassisYAxisForRect.toString()
                                    + '" x="33" /> <g transform="translate(58.5,'
                                    + chassisYAxisForG.toString()
                                    + ')">'
                                    + '<switch> <foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="'
                                    + chassisHeightForG.toString()
                                    + '" width="116"'
                                    + ' pointer-events="all" style="overflow:visible;"> <xhtml:div style="display: inline-block; font-size: 23px; font-family: Verdana; color: rgb(255, 255, 255);'
                                    + ' line-height: 1.2; vertical-align: top; width: 117px; white-space: nowrap; overflow-wrap: normal; text-align: center;">'
                                    + '<xhtml:div style="display:inline-block;text-align:inherit;text-decoration:inherit;white-space:normal;">Chassis</xhtml:div> </xhtml:div>'
                                    + '</foreignObject> <text style="font-size:23px;font-family:Verdana;text-anchor:middle;fill:#ffffff" font-size="23px" y="25" x="58">Chassis</text></switch></g>';
                            currentHtmlCode = currentHtmlCode
                                    + '<rect style="fill:#555555;stroke:#666666" pointer-events="none" height="20" width="84" y="'
                                    + (chassisYAxisForRect + (height - 1) * 20)
                                            .toString()
                                    + '" x="33" />'
                                    + '<g transform="translate(39.5,'
                                    + (chassisYAxisForG + (height - 1) * 20.1)
                                            .toString()
                                    + ')">'
                                    + '<switch><foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="14" width="71" pointer-events="all" style="overflow:visible;">'
                                    + '<xhtml:div style="display: inline-block; font-size: 13px; font-family: Verdana; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top; width: 72px;'
                                    + ' white-space: nowrap; overflow-wrap: normal; text-align: center;"> <xhtml:div style="display:inline-block;text-align:inherit;text-decoration:inherit;'
                                    + ' white-space:normal;">Chassis</xhtml:div></xhtml:div></foreignObject><text style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;'
                                    + ' font-size:13px;font-family:Verdana;-inkscape-font-specification:\'Verdana, Normal\';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;'
                                    + ' font-feature-settings:normal;text-align:center;writing-mode:lr;text-anchor:middle;fill:#ffffff;" font-size="13px" y="14" x="36">'
                                    + '<tspan sodipodi:role="line">'
                                    + currentNodes[0].hardware.name
                                    + '</tspan></text></switch></g>';
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
                                    chassisHeightForRect = 20;
                                    chassisHeightForG = 15;
                                    chassisYAxisForRect = 831 - (slot - 1) * 20
                                            - (Math.floor(index / 2)) * 20;
                                    chassisYAxisForG = 833 - (slot - 1) * 20.1
                                            - (Math.floor(index / 2)) * 20.1;
                                    var chassisXaxisForRect = '';
                                    var chassisXaxisForG = '';
                                    if (index & 1) {
                                        // odd
                                        chassisXaxisForRect = 117;
                                        chassisXaxisForG = 123.5
                                    } else {
                                        // even
                                        chassisXaxisForRect = 33;
                                        chassisXaxisForG = 43.5;
                                    }
                                    currentHtmlCode = currentHtmlCode
                                            + '<rect style="fill:#b266ff;stroke:#666666" pointer-events="none" height="'
                                            + chassisHeightForRect.toString()
                                            + '" width="84"'
                                            + ' y="'
                                            + chassisYAxisForRect.toString()
                                            + '" x="'
                                            + chassisXaxisForRect.toString()
                                            + '" />'
                                            + '<g transform="translate('
                                            + chassisXaxisForG.toString()
                                            + ','
                                            + chassisYAxisForG.toString()
                                            + ')">'
                                            + '<switch> <foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility" height="'
                                            + chassisHeightForG.toString()
                                            + '" width="71" pointer-events="all" style="overflow:visible;">'
                                            + '<xhtml:div style="display: inline-block; font-size: 13px; font-family: Verdana; color: rgb(255, 255, 255);'
                                            + ' line-height: 1.2; vertical-align: top; width: 72px; white-space: nowrap; overflow-wrap: normal; text-align: center;">'
                                            + '<xhtml:div style="display:inline-block;text-align:inherit;text-decoration:inherit;white-space:normal;" ng-click="displayHardware(\''
                                            + rackName
                                            + '\','
                                            + '\''
                                            + nodeOfUnit.name
                                            + '\','
                                            + '\''
                                            + nodeOfUnit.hardware.name
                                            + '\','
                                            + '\''
                                            + slot
                                            + '\','
                                            + '\''
                                            + nodeOfUnit.yaml.rack_location.unit
                                            + '\','
                                            + '\''
                                            + height
                                            + '\','
                                            + '\''
                                            + nodeOfUnit.hardware.yaml.yaml.rack_layout.chassis.units
                                            + '\''
                                            + ')">'
                                            + nodeOfUnit.name
                                            + '</xhtml:div>'
                                            + '</xhtml:div></foreignObject><text style="font-size:13px;font-family:Verdana;text-anchor:middle;fill:#ffffff;-inkscape-font-specification:\'Verdana, Normal\';'
                                            + ' font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal;text-align:center;writing-mode:lr;font-variant-ligatures:normal;'
                                            + ' font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;" font-size="13px" y="14" x="36">'
                                            + '<tspan sodipodi:role="line">'
                                            + nodeOfUnit.name
                                            + '</tspan></text></switch></g>';
                                }
                            }
                        } else {
                            // rack mounted
                            var height = parseInt(currentNodes[0].hardware.yaml.yaml.rack_layout.height
                                    .slice(0, -1));
                            var nodeHeightForRect = 20 * height;
                            var nodeYAxisForRect = 831 - (slot - 1) * 20
                                    - (height - 1) * 20;
                            var nodeHeightForG = 15 * height;
                            var nodeYAxisForG = 833 - (slot - 1) * 20.1
                                    - (height - 1) * 20.1;
                            currentHtmlCode = currentHtmlCode
                                    + '<rect style="fill:#005073;stroke:#666666" pointer-events="none" height="'
                                    + nodeHeightForRect.toString()
                                    + ' "width="168" y="'
                                    + nodeYAxisForRect.toString()
                                    + ' "x="33" />';
                            currentHtmlCode = currentHtmlCode
                                    + '<g transform="translate(61.5,'
                                    + nodeYAxisForG.toString()
                                    + ')"><switch>'
                                    + '<foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"'
                                    + ' height="'
                                    + nodeHeightForG.toString()
                                    + '" width="111" pointer-events="all" style="overflow:visible;">'
                                    + '<xhtml:div style="display: inline-block; font-size: 14px; font-family: Verdana; color: rgb(255, 255, 255); line-height: 1.2; vertical-align: top;'
                                    + ' width: 112px; white-space: nowrap; overflow-wrap: normal; text-align: center;">'
                                    + '<xhtml:div style="display:inline-block;text-align:inherit;text-decoration:inherit;white-space:normal;" ng-click="displayHardware(\''
                                    + rackName
                                    + '\','
                                    + '\''
                                    + currentNodes[0].name
                                    + '\','
                                    + '\''
                                    + currentNodes[0].hardware.name
                                    + '\','
                                    + '\''
                                    + slot
                                    + '\','
                                    + '\''
                                    + 'N/A'
                                    + '\','
                                    + '\''
                                    + height
                                    + '\','
                                    + '\''
                                    + 'N/A'
                                    + '\''
                                    + ')">'
                                    + currentNodes[0].name
                                    + '</xhtml:div>'
                                    + '</xhtml:div>'
                                    + '</foreignObject> <text style="font-size:14px;font-family:Verdana;text-anchor:middle;fill:#ffffff;-inkscape-font-specification:\'Verdana, Normal\';'
                                    + ' font-weight:normal;font-style:normal;font-stretch:normal;font-variant:normal;text-align:center;writing-mode:lr;font-variant-ligatures:normal;'
                                    + ' font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;"'
                                    + ' font-size="14px" y="15" x="56"><tspan sodipodi:role="line">'
                                    + currentNodes[0].name
                                    + '</tspan></text></switch></g>';
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