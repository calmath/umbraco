(function() {
    'use strict';

    angular
        .module('umbraco.deploy.resources')
        .factory('deployResource', deployResource);

    deployResource.$inject = ['$http', '$q', 'umbRequestHelper'];

    function deployResource($http, $q, umbRequestHelper) {

        var baseUrl = umbRequestHelper.getApiUrl('deployUiBaseUrl', '');

        var resource = {
            deploy: deploy,
            instantDeploy: instantDeploy,
            restore: restore,
            partialRestore: partialRestore,
            getSitemap: getSitemap,
            getStatus: getStatus,
            getUdiRange: getUdiRange
        };

        return resource;

        ////////////

        function deploy(targetUrl, enableWorkItemLogging) {

            var data = {
                TargetUrl: targetUrl,
                EnableLogging : enableWorkItemLogging
            };

            return $http.post(baseUrl + 'Deploy', data)
                .then(function(response) {
                        return response.data;
                    },
                    function(response) {
                        return $q.reject(response.data);
                    });
        }

        function instantDeploy(items, targetUrl, enableWorkItemLogging) {

            var data = {
                Items: items,
                TargetUrl: targetUrl,
                EnableLogging: enableWorkItemLogging
            };

            return $http.post(baseUrl + 'InstantDeploy', data)
                .then(function (response) {
                    return response.data;
                },
                function (response) {
                    return $q.reject(response.data);
                });
        }

        function restore(targetUrl, enableWorkItemLogging) {

            var data = {
                SourceUrl: targetUrl,
                EnableLogging: enableWorkItemLogging
            };

            return $http.post(baseUrl + 'Restore', data)
                .then(function(response) {
                        return response.data;
                    },
                    function(response) {
                        return $q.reject(response.data);
                    });
        }

        function partialRestore(targetUrl, restoreNodes, enableWorkItemLogging) {

            var data = {
                SourceUrl: targetUrl,
                RestoreNodes: restoreNodes,
                EnableLogging: enableWorkItemLogging
            };

            return $http.post(baseUrl + 'PartialRestore', data)
                .then(function (response) {
                    return response.data;
                },
                    function (response) {
                        return $q.reject(response.data);
                    });
        }

        function getSitemap(targetUrl) {
            // url hack...
            return $http.get(targetUrl + '/umbraco/backoffice/Deploy/Ui/GetSitemap')
                .then(function (response) {
                    return response.data;
                },
                    function (response) {
                        return $q.reject(response.data);
                    });
        }

        function getStatus(sessionId) {

            var data = {
                SessionId: sessionId
            };

            return $http.post(baseUrl + 'GetStatus', data)
                .then(function(response) {
                        return response.data;
                    },
                    function(response) {
                        return $q.reject(response.data);
                    });
        }

        function getUdiRange(id, includeDescendants, entityType) {

            var data = {
                id: id,
                includeDescendants: includeDescendants,
                entityType: entityType
            };

            return $http.post(baseUrl + 'GetUdiRange', data)
                .then(function(response) {
                        return response.data;
                    },
                    function(response) {
                        return $q.reject(response.data);
                    });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.resources')
        .factory('queueResource', queueResource);

    queueResource.$inject = ['$http', '$q', 'umbRequestHelper'];

    function queueResource($http, $q, umbRequestHelper) {

        var baseUrl = umbRequestHelper.getApiUrl('deployUiBaseUrl', '');

        var resource = {
            clearQueue: clearQueue,
            addToQueue: addToQueue,
            removeFromQueue: removeFromQueue,
            getQueue: getQueue
        };

        return resource;

        ////////////

        function clearQueue() {

            return $http.post(baseUrl + 'ClearQueue')
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response.data);
                });
        }

        function addToQueue(item) {

            return $http.post(baseUrl + 'AddToQueue', item)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response.data);
                });
        }

        function removeFromQueue(item) {

            return $http.post(baseUrl + 'RemoveFromQueue', item)
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response.data);
                });
        }

        function getQueue() {

            return $http.get(baseUrl + 'GetQueue')
                .then(function (response) {
                    return response.data;
                }, function (response) {
                    return $q.reject(response.data);
                });
        }
    }
})();
