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

app.controller('UploadBlueprintController', function($scope, restAPISvc,
        appContext, $modalInstance, $window) {

    $scope.uploadingBlueprint = false;

    $scope.uploadBlueprint = function($fileContent) {
        var payload = '';
        try {
            payload = JSON.stringify(jsyaml.load($fileContent));
        } catch (e) {
            try {
                payload = JSON.parse(JSON.stringify($fileContent));
            } catch (e2) {
                confirm("This file format is not supported");
                return;
            }
        }
        if (!angular.fromJson(payload).blueprint
                || !angular.fromJson(payload).version
                || !angular.fromJson(payload).name
                || !angular.fromJson(payload).description
                || !angular.fromJson(payload).yaml) {
            confirm("The blueprint file format is not correct");
            return;
        }
        $scope.uploadingBlueprint = true;
        restAPISvc.postRestAPI("/api/v1/blueprint/", payload,
                function(response) {
                    $scope.uploadingBlueprint = false;
                    if (response.status == 200 || response.status == 201) {
                        var text = "Blueprint: " + response.data.name
                                + " uploaded successfully";
                        confirm(text);
                    } else {
                        var text2 = "Failed to upload blueprint";
                        confirm(text2 + ". " + JSON.stringify(response.data));
                    }
                    $modalInstance.close();
                    $window.location.href = appContext + "/blueprints";
                });
    };
});