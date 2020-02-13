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

app.factory('createEdgeSiteSvc', [function () {
    var svc = [];
    svc.getFreeSlots = function (hardwareUnderStudy, rackName, selectedNodes, hardwares) {
        var freeSlots = Array.from(Array(40).keys()).map(x => ++x);
        var filteredNodes = [];
        // Try to find out which nodes occupy slots in the given rack
        angular.forEach(selectedNodes, function (node) {
            if (node.yaml && node.yaml.rack_location && node.yaml.rack_location.name) {
                if (node.yaml.rack_location.name.toString().trim() === rackName) {
                    filteredNodes.push(node);
                }
            }
        });
        angular.forEach(filteredNodes, function (filteredNode) {
            nodeHardware = '';
            angular.forEach(hardwares, function (hardware) {
                if (hardware.uuid.toString().trim() === filteredNode.hardware.toString().trim()) {
                    nodeHardware = hardware;
                }
            });
            if (nodeHardware && nodeHardware.yaml && nodeHardware.yaml.yaml && nodeHardware.yaml.yaml.rack_layout) {
                if (nodeHardware.yaml.yaml.rack_layout.chassis) {
                    if (hardwareUnderStudy.yaml.yaml.rack_layout.chassis) {
                        // Exclude chassis slots if they are occupied by a
                        // node which uses different hardware profile
                        if (nodeHardware.uuid.toString().trim() !== hardwareUnderStudy.uuid.toString().trim()) {
                            var startSlot = parseInt(filteredNode.yaml.rack_location.slot);
                            var offset = parseInt(nodeHardware.yaml.yaml.rack_layout.chassis.height.slice(0, -1));
                            _excludeSlots(startSlot, offset, freeSlots);
                        } else {
                            // Exclude the corresponding slots if the chassis is
                            // fully occupied
                            var noNodesInChassis = 0;
                            angular.forEach(filteredNodes, function (filteredNode2) {
                                if (filteredNode2.yaml.rack_location.slot === filteredNode.yaml.rack_location.slot) {
                                    noNodesInChassis++;
                                }
                            });
                            if (noNodesInChassis === nodeHardware.yaml.yaml.rack_layout.chassis.units) {
                                var startSlot = parseInt(filteredNode.yaml.rack_location.slot);
                                var offset = parseInt(nodeHardware.yaml.yaml.rack_layout.chassis.height.slice(0, -1));
                                _excludeSlots(startSlot, offset, freeSlots);
                            }
                            else {
                                // Exclude all slots of the chassis except the
                                // first one
                                var startSlot = parseInt(filteredNode.yaml.rack_location.slot) + 1;
                                var offset = parseInt(nodeHardware.yaml.yaml.rack_layout.chassis.height.slice(0, -1)) - 1;
                                _excludeSlots(startSlot, offset, freeSlots);
                            }
                        }
                    }
                    else {
                        // Exclude the slots occupied by the whole chassis
                        var startSlot = parseInt(filteredNode.yaml.rack_location.slot);
                        var offset = parseInt(nodeHardware.yaml.yaml.rack_layout.chassis.height.slice(0, -1));
                        _excludeSlots(startSlot, offset, freeSlots);
                    }
                }
                else {
                    var startSlot = parseInt(filteredNode.yaml.rack_location.slot);
                    var offset = parseInt(nodeHardware.yaml.yaml.rack_layout.height.slice(0, -1));
                    _excludeSlots(startSlot, offset, freeSlots);
                }
            }
        });
        // Exclude free slots in which the hardware profile does not fit
        var height = '';
        if (hardwareUnderStudy.yaml.yaml.rack_layout.chassis) {
            height = hardwareUnderStudy.yaml.yaml.rack_layout.chassis.height;
        } else {
            height = hardwareUnderStudy.yaml.yaml.rack_layout.height;
        }
        notAppropriateSlots = [];
        index = 0;
        while (index < freeSlots.length) {
            index2=0;
            while (index2 < parseInt(height.slice(0, -1))) {
                if(freeSlots.indexOf(freeSlots[index] + index2) === -1) {
                        if (!hardwareUnderStudy.yaml.yaml.rack_layout.chassis ||
                                (hardwareUnderStudy.yaml.yaml.rack_layout.chassis && (!_isOccupiedByChassis(filteredNodes, freeSlots[index]) || (index2>0 && _isOccupiedByChassis(filteredNodes, freeSlots[index]+index2))))) {
                            notAppropriateSlots.push(freeSlots[index]);
                        }
                        break;
                }
                index2++;
            }
            index++;
        }
        angular.forEach(notAppropriateSlots, function (notAppropriateSlot) {
            var index = freeSlots.indexOf(notAppropriateSlot);
            freeSlots.splice(index, 1);
        });
        return freeSlots;
    };
    svc.getFreeUnits = function (hardwareUnderStudy, rackName, selectedRackSlot, selectedNodes) {
        var freeUnits = Array.from(Array(hardwareUnderStudy.yaml.yaml.rack_layout.chassis.units).keys()).map(x => ++x);
        var filteredNodes = [];
        // Try to find out which nodes occupy slots in the given rack
        angular.forEach(selectedNodes, function (node) {
            if (node.yaml && node.yaml.rack_location && node.yaml.rack_location.name) {
                if (node.yaml.rack_location.name.toString().trim() === rackName) {
                    filteredNodes.push(node);
                }
            }
        });
        // Exclude occupied units of the selected chassis
        notAppropriateUnits = [];
        angular.forEach(filteredNodes, function (filteredNode) {
            if (filteredNode.yaml.rack_location.slot === selectedRackSlot) {
                notAppropriateUnits.push(filteredNode.yaml.rack_location.unit);
            }
        });
        angular.forEach(notAppropriateUnits, function (notAppropriateUnit) {
            var index = freeUnits.indexOf(notAppropriateUnit);
            freeUnits.splice(index, 1);
        });
        return freeUnits;
    };
    return svc;
    function _excludeSlots(startSlot, offset, freeSlots) {
        for (var i = startSlot; i < startSlot + offset; i++) {
            var index = freeSlots.indexOf(i);
            if (index !== -1) {
                freeSlots.splice(index, 1);
            }
        }
    }
    function _isOccupiedByChassis(filteredNodes, rackSlot) {
        var result = false;
        angular.forEach(filteredNodes, function (filteredNode) {
            if (filteredNode.yaml.rack_location.slot == rackSlot && filteredNode.yaml.rack_location.unit) {
                result = true;
            }
        });
        return result;
    }
}]);
