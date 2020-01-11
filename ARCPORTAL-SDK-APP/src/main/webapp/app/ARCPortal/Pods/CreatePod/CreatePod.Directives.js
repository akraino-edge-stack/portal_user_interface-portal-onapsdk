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
        .directive(
                'onReadFile',
                function($parse) {
                    return {
                        restrict : 'A',
                        scope : false,
                        link : function(scope, element, attrs) {
                            var fn = $parse(attrs.onReadFile);

                            element
                                    .on(
                                            'change',
                                            function(onChangeEvent) {
                                                var reader = new FileReader();

                                                reader.onload = function(
                                                        onLoadEvent) {
                                                    scope
                                                            .$apply(function() {
                                                                fn(
                                                                        scope,
                                                                        {
                                                                            $fileContent : onLoadEvent.target.result
                                                                        });
                                                            });
                                                };

                                                reader
                                                        .readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                                            });
                        }
                    };
                });
