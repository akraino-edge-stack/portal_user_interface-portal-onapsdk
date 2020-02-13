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
                        $scope.alert = window.alert;

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
                                            htmlCode = htmlCode
                                                    + '<div style="display:inline-block;" class="ng-scope"></div><div style="display:inline-block;" class="ng-scope"></div>';
                                            htmlCode = htmlCode
                                                    + '<div style="display:inline-block;">';
                                            htmlCode = htmlCode
                                                    + '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
                                                    + '<svg xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"'
                                                    + ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"'
                                                    + ' xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"'
                                                    + ' style="background-color: rgb(255, 255, 255);" version="1.1" width="211px" height="891px" viewBox="-0.5 -0.5 211 891"'
                                                    + ' content="&lt;mxfile modified=&quot;2020-01-28T20:55:34.464Z&quot; host=&quot;wiki.web.att.com&quot; agent=&quot;Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:68.0) Gecko/20100101 Firefox/68.0&quot; etag=&quot;PIYyUn2C0yyIrywpbACC&quot; pages=&quot;1&quot; version=&quot;11.2.1&quot; type=&quot;atlas&quot;&gt;&lt;mxAtlasLibraries/&gt;&lt;diagram id=&quot;0798d791-2b5d-c323-ed4c-f627a79ff595&quot; name=&quot;Page-1&quot;&gt;7Vnfd6I4FP5rfLQHCCA+Dv7ozGx3dk+d7p7dtyhRMgbiCbHq/vWbQEAw0aLV9kWop/AluST3++5NIB0wSLaPDK7i32mESMexom0HDDuOY7uO05F/VrQrEMdy/QJZMBypWntggv9DCrQUusYRyhoVOaWE41UTnNE0RTPewCBjdNOsNqek+dQVXCANmMwg0dG/ccTjAg08a49/RXgRl0+2LVUyhbPlgtF1qp7XccA8P4riBJa2VP0shhHd1CAw6oABo5QXV8l2gIh0bum2ot34SGnVb4ZS3qaBIuoVkrUa+rPojmN54vcsxiL+9VRP+a70TsYZXaIBJZTlAPDzowPCmCdEQLa4fEWMY+HRJzhF5E+aYY5pKso4XYlSItGwclbNlnLX3sAXghey4ZRyThNRQNec4FQ8v+TeEmDlSHkTwSxG0b5kJTuebBdSrQ9MPPURpYhB8iD0w6GwJZ4d1q7zAcwoIXCV4Wk+bGlpFmMSPcGd6IBApB0BJpAtcPqE5hIDoEKelTz6FfJTjnzo2BUQqhENJe8hR1tu8mm6ToY4k01hNkNSWOGCwCyrupngmergHBNSM2Hlh6zPYISFIkxunothqwB0gLo32YCKBtEFnvuLHBBbFegaVLKUjKJtDVKafEQ0QZztRBVV6oKihcof3aAfFMBmH41VsohrkRj4CoQqAywq2/soEBcqEMxBAbSguCwEDj3Ein5WriS5aMJsBWc4XSgJ2d5JNR9QXNFoDAopqVNy2VNvBzr147GiXifUOZdQ0CS0VESNTtsPdDrt4Ap0/vscPk3G20m4JrNwN/zx+v3xt24pnlMka6Hg+4OBITMVKe1Ywqvy1tGA0UKrpiEjrwciGOSHlI2myiCwQ2DIAClNUQ0eYiasF91KKZOcKGPl9OcYMmmK+IayZfaQ0BRzao79d0vFaqsV91Za6WtS+cJwxqGcHG3PmmjCyee0KmQ3MeZoIoJclm6E55oM16PQMyfraX4aot+Tp5H4Mh1dnxDgtiTEuQIf4ykcf+uiF4e/RLuvk39S+3nStfVVyz1BX5lkvyXJ4BoTrpHlFrOwXDyu2g++el+A09KCdY5Tem2nrWvMWkafuJpPfqDtOpMLds+yu5PR+1JRpWr7hCiPR1ZzxrBNC1LP6pWLzDFMMJGe/QuxCKbwQO+uSe/yME2YugZOSurtqPi03OZdrPqzRtw+FHbNAb/lmJulA19zzCAWAsVZuT54t+itmuitt0QPfNAHURvRo/xoJXrTC9i7Re8dkcD5or8Ztz2NW7hMaYRENz6D2/YJLXR8PyenRUL7XG5VaeA2ZjRXj+qyxodku+Ao8cGd+FsSb0jnH0q8/kqliK8+jN6Jvy7xn8W04UNLGeP9O9VXn7g/llv7KLf6rsGd24u4vXnCfskQ+2P6S36UcKz8i0jR1FLmCU6XHfUmMpY7X+J1c/yK0UZeP0D12TAv+SbZtW3f9VzP7ysJnFYQqI1aSc6oGftCzdTfXm2TZqoNjkOF5OfxT6ctVvPGbRPD/spoVDZUI3eNQjp7F6UXNOZ8Ea76Lopr2ES5QETitqajEtrvY+bVa7vFYPQ/&lt;/diagram&gt;&lt;/mxfile&gt;"'
                                                    + ' id="svg4291" sodipodi:docname="Populated-Rack-1.svg" inkscape:version="0.92.4 (5da689c313, 2019-01-14)">'
                                                    + '<defs id="defs4015"><linearGradient x1="11.456439" y1="1051.0465" x2="11.456439" y2="1110.62" id="mx-gradient-f5f5f5-1-b3b3b3-1-s-0" gradientTransform="scale(2.8368326,0.35250582)"'
                                                    + ' gradientUnits="userSpaceOnUse"> <stop offset="0%" style="stop-color:#f5f5f5" id="stop4005" /> <stop offset="100%"'
                                                    + ' style="stop-color:#b3b3b3" id="stop4007" /> </linearGradient><linearGradient x1="8.5019029" y1="2822.8974" x2="8.5019029"'
                                                    + ' y2="2868.0638" id="mx-gradient-ffffff-0.9-ffffff-0.1-s-0" gradientTransform="scale(3.7638633,0.26568447)" gradientUnits="userSpaceOnUse">'
                                                    + '<stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9" id="stop4010" /> <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1"'
                                                    + ' id="stop4012" /> </linearGradient> </defs> <rect style="fill:#000000;stroke:#666666" id="rect4017" pointer-events="none" height="860"'
                                                    + ' width="186" y="30" x="24" /><rect style="fill:#f4f4f4;stroke:#666666" id="rect4019" pointer-events="none" height="21" width="186" y="30" x="24" />'
                                                    + '<rect style="fill:#f4f4f4;stroke:#666666" id="rect4021" pointer-events="none" height="21" width="186" y="869" x="24" />'
                                                    + '<rect style="fill:#f4f4f4;stroke:#666666" id="rect4023" pointer-events="none" height="818" width="9" y="51" x="24" />'
                                                    + '<rect style="fill:#f4f4f4;stroke:#666666" id="rect4025" pointer-events="none" height="818" width="9" y="51" x="201" />'
                                                    + '<circle style="stroke:#666666" r="3" id="ellipse4027" pointer-events="none" fill="transparent" cy="40.5" cx="29.5" /> <circle'
                                                    + ' style="stroke:#666666" r="3" id="ellipse4029" pointer-events="none" fill="transparent" cy="40.5" cx="204.5" /> <circle'
                                                    + ' style="stroke:#666666" r="3" id="ellipse4031" pointer-events="none" fill="transparent" cy="879.5" cx="29.5" /> <circle'
                                                    + ' style="stroke:#666666" r="3" id="ellipse4033" pointer-events="none" fill="transparent" cy="879.5" cx="204.5" />'
                                                    + '<g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4037" font-size="12px">'
                                                    + '<text id="text4035" y="64.5" x="11.5">40</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666"'
                                                    + ' id="g4041" font-size="12px"><text id="text4039" y="84.5" x="11.5">39</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4045"'
                                                    + ' font-size="12px"> <text id="text4043" y="104.5" x="11.5">38</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666"'
                                                    + ' id="g4049" font-size="12px"> <text id="text4047" y="124.5" x="11.5">37</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666"'
                                                    + ' id="g4053" font-size="12px"> <text id="text4051" y="144.5" x="11.5">36</text> </g>'
                                                    + '<g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4057" font-size="12px"> <text'
                                                    + ' id="text4055" y="164.5" x="11.5">35</text> </g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666"'
                                                    + ' id="g4061" font-size="12px"> <text id="text4059" y="184.5" x="11.5">34</text></g> <g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4065" font-size="12px">'
                                                    + '<text id="text4063" y="204.5" x="11.5">33</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4069" font-size="12px">'
                                                    + '<text id="text4067" y="224.5" x="11.5">32</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4073" font-size="12px">'
                                                    + '<text id="text4071" y="244.5" x="11.5">31</text> </g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4077" font-size="12px">'
                                                    + '<text id="text4075" y="264.5" x="11.5">30</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4081" font-size="12px">'
                                                    + '<text id="text4079" y="284.5" x="11.5">29</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4085" font-size="12px">'
                                                    + '<text id="text4083" y="304.5" x="11.5">28</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4089" font-size="12px">'
                                                    + '<text id="text4087" y="324.5" x="11.5">27</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4093" font-size="12px">'
                                                    + '<text id="text4091" y="344.5" x="11.5">26</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4097"'
                                                    + ' font-size="12px"> <text id="text4095" y="364.5" x="11.5">25</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4101"'
                                                    + ' font-size="12px"><text id="text4099" y="384.5" x="11.5">24</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4105"'
                                                    + ' font-size="12px"><text id="text4103" y="404.5" x="11.5">23</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4109"'
                                                    + ' font-size="12px"><text id="text4107" y="424.5" x="11.5">22</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4113"'
                                                    + ' font-size="12px"><text id="text4111" y="444.5" x="11.5">21</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4117"'
                                                    + ' font-size="12px"><text id="text4115" y="464.5" x="11.5">20</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4121"'
                                                    + ' font-size="12px"><text id="text4119" y="484.5" x="11.5">19</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4125"'
                                                    + ' font-size="12px"><text id="text4123" y="504.5" x="11.5">18</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4129"'
                                                    + ' font-size="12px"><text id="text4127" y="524.5" x="11.5">17</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4133"'
                                                    + ' font-size="12px"><text id="text4131" y="544.5" x="11.5">16</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4137"'
                                                    + ' font-size="12px"><text id="text4135" y="564.5" x="11.5">15</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4141"'
                                                    + ' font-size="12px"><text id="text4139" y="584.5" x="11.5">14</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4145"'
                                                    + ' font-size="12px"><text id="text4143" y="604.5" x="11.5">13</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4149"'
                                                    + ' font-size="12px"><text id="text4147" y="624.5" x="11.5">12</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4153"'
                                                    + ' font-size="12px"><text id="text4151" y="644.5" x="11.5">11</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4157"'
                                                    + ' font-size="12px"><text id="text4155" y="664.5" x="11.5">10</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4161"'
                                                    + ' font-size="12px"><text id="text4159" y="684.5" x="11.5">9</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4165"'
                                                    + ' font-size="12px"><text id="text4163" y="704.5" x="11.5">8</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4169"'
                                                    + ' font-size="12px"><text id="text4167" y="724.5" x="11.5">7</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666"'
                                                    + ' id="g4173" font-size="12px"><text id="text4171" y="744.5" x="11.5">6</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4177"'
                                                    + ' font-size="12px"><text id="text4175" y="764.5" x="11.5">5</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4181"'
                                                    + ' font-size="12px"><text id="text4179" y="784.5" x="11.5">4</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4185"'
                                                    + ' font-size="12px"><text id="text4183" y="804.5" x="11.5">3</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4189"'
                                                    + ' font-size="12px"><text id="text4187" y="824.5" x="11.5">2</text></g><g style="font-size:12px;font-family:Arial, Helvetica;text-anchor:middle;fill:#666666" id="g4193"'
                                                    + ' font-size="12px"><text id="text4191" y="844.5" x="11.5">1</text></g><path style="fill:none;stroke:#666666;stroke-miterlimit:10" inkscape:connector-curvature="0"'
                                                    + ' id="path4195" pointer-events="none" stroke-miterlimit="10" d="M 0,51 H 24 M 0,71 H 24 M 0,91 H 24 M 0,111 H 24 M 0,131 H 24 M 0,151 H 24 M 0,171 H 24 M 0,191 H 24 M 0,211 H 24 M 0,231 H 24 M 0,251 H 24 M 0,271 H 24 M 0,291 H 24 M 0,311 H 24 M 0,331 H 24 M 0,351 H 24 M 0,371 H 24 M 0,391 H 24 M 0,411 H 24 M 0,431 H 24 M 0,451 H 24 M 0,471 H 24 M 0,491 H 24 M 0,511 H 24 M 0,531 H 24 M 0,551 H 24 M 0,571 H 24 M 0,591 H 24 M 0,611 H 24 M 0,631 H 24 M 0,651 H 24 M 0,671 H 24 M 0,691 H 24 M 0,711 H 24 M 0,731 H 24 M 0,751 H 24 M 0,771 H 24 M 0,791 H 24 M 0,811 H 24 M 0,831 H 24 M 0,851 h 24" />'
                                                    + '<g id="g4201" transform="translate(41.5,-2.5)"><switch id="switch4199"><foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"'
                                                    + ' height="26" width="143" pointer-events="all" style="overflow:visible;"><xhtml:div style="display: inline-block; font-size: 23px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; white-space: nowrap; text-align: center;">'
                                                    + '<xhtml:div style="display:inline-block;text-align:inherit;text-decoration:inherit;background-color:#ffffff;">'
                                                    + rackName
                                                    + '</xhtml:div></xhtml:div></foreignObject>'
                                                    + '<text style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:23px;font-family:Helvetica;-inkscape-font-specification:\'Helvetica, Normal\';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:center;writing-mode:lr-tb;text-anchor:middle;fill:#000000"'
                                                    + ' id="text4197" font-size="23px" y="25" x="72"><tspan sodipodi:role="line" id="tspan4435" x="72" y="25">'
                                                    + rackName
                                                    + '</tspan></text>'
                                                    + '</switch></g><g id="g4217" transform="translate(75.5,370.5)"><switch id="switch4215"><foreignObject requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"'
                                                    + ' height="16" width="83" pointer-events="all" style="overflow:visible;"><xhtml:div style="display: inline-block; font-size: 15px; font-family: Helvetica; color: rgb(0, 0, 0); line-height: 1.2; vertical-align: top; width: 84px; white-space: nowrap; overflow-wrap: normal; text-align: center;">'
                                                    + '<xhtml:div style="display:inline-block;text-align:inherit;text-decoration:inherit;white-space:normal;"></xhtml:div></xhtml:div></foreignObject>'
                                                    + '<text style="font-size:15px;font-family:Helvetica;text-anchor:middle;fill:#000000" id="text4213" font-size="15px" y="16" x="42"></text></switch>'
                                                    + '</g><rect style="opacity:0.25;fill:#000000;stroke:#000000" id="rect4219" height="20" width="168" y="754" x="35" />';
                                            var nodesOfRack = podsSvc
                                                    .getNodesOfARack(rackName,
                                                            nodesOfEdgeSite,
                                                            $scope.hardwares);
                                            for (var index = 1; index <= 40; index++) {
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
                                            htmlCode = htmlCode
                                                    + '</svg></div>';
                                        });
                        $scope.guiOfNodes = $sce.trustAsHtml(htmlCode);
                    }

                    $scope.displayHardware = function(rackName, nodeName,
                            hardwareName, slot, unit, slots, units) {
                        alert('Rack: ' + rackName + '\n' + 'Node: ' + nodeName
                                + '\n' + 'Hardware: ' + hardwareName + '\n'
                                + 'Slot: ' + slot + '\n' + 'Unit: ' + unit
                                + '\n' + 'Occupied slots in Rack: ' + slots
                                + '\n' + 'Units of hardware: ' + units + '\n');
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