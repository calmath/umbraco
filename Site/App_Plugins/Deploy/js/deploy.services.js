angular.module('umbraco.deploy.services')
    .service('deployConfiguration',
    [
        '$http',
        function() {
            var instance = this;

            if (Umbraco.Sys.ServerVariables.deploy !== undefined && Umbraco.Sys.ServerVariables.deploy !== null) {
                angular.extend(instance, Umbraco.Sys.ServerVariables.deploy);
            } else {
                console.log('Could not get deploy configuration');
            }

            return instance;
        }
    ]);
angular.module('umbraco.deploy.services')
    .service('deployService',
    [
        '$http', '$q', 'deployConfiguration', '$rootScope', 'deployNavigation', 'deployResource',
        function ($http, $q, deployConfiguration, $rootScope, deployNavigation, deployResource) {

            var instance = this;

            instance.sessionId = '';
            instance.pSessionId = '';

            instance.error = undefined;

            instance.deploy = function (enableWorkItemLogging) {

                var deferred = $q.defer();

                deployResource.deploy(deployConfiguration.Target.DeployUrl, enableWorkItemLogging)
                    .then(function (data) {
                        instance.setSessionId(data.SessionId);
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });

                return deferred.promise;

            };

            instance.instantDeploy = function (item, enableWorkItemLogging) {

                var deferred = $q.defer();

                // get the item with Udi from the server
                deployResource.getUdiRange(item.id, item.includeDescendants, item.entityType).then(function(data) {

                    if (data !== 'null' && data !== null) {
                        // deploy item
                        var items = [];
                        items.push(data);

                        deployResource.instantDeploy(items, deployConfiguration.Target.DeployUrl, enableWorkItemLogging)
                            .then(function(data) {
                                    instance.setSessionId(data.SessionId);
                                    deferred.resolve(data);
                                },
                                function(data) {
                                    deferred.reject(data);
                                });
                    }
                }, function(error) {
                    deferred.reject(error);
                });

                return deferred.promise;

            };

            instance.restore = function (targetUrl, enableWorkItemLogging) {

                var deferred = $q.defer();

                deployResource.restore(targetUrl, enableWorkItemLogging)
                    .then(function (data) {
                        instance.setSessionId(data.SessionId);
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });

                return deferred.promise;

            };

            instance.partialRestore = function (targetUrl, restoreNodes, enableWorkItemLogging) {

                var deferred = $q.defer();

                deployResource.partialRestore(targetUrl, restoreNodes, enableWorkItemLogging)
                    .then(function (data) {
                        instance.setSessionId(data.SessionId);
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });

                return deferred.promise;

            };

            instance.getSitemap = function (targetUrl) {
                var deferred = $q.defer();
                deployResource.getSitemap(targetUrl)
                    .then(function (data) {
                        deferred.resolve(data);
                    }, function (data) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            };

            instance.getStatus = function () {

                var deferred = $q.defer();

                deployResource.getStatus(instance.sessionId)
                    .then(function (data) {
                        $rootScope.$broadcast('deploy:sessionUpdated',
                            {
                                sessionId: data.SessionId,
                                status: data.Status,
                                comment: data.Comment,
                                percent: data.Percent,
                                log: data.Log,
                                exception: data.Exception
                            });
                        deferred.resolve(data);
                    }, function (data) {
                        // todo - need different response messages so a session that doesnt exist doesn't cause an error coded response.
                        instance.removeSessionId();
                        deferred.reject(data);
                    });

                return deferred.promise;

            };

            instance.setSessionId = function(sessionId) {
                instance.sessionId = sessionId;
                localStorage.setItem('deploySessionId', sessionId);
            };

            instance.removeSessionId = function () {
                instance.pSessionId = instance.sessionId;
                instance.sessionId = null;
                localStorage.removeItem('deploySessionId');
            };

            instance.getSessionId = function() {
                var deploySessionId = localStorage.getItem('deploySessionId');
                return deploySessionId;
            };

            instance.isOurSession = function(sessionId) {
                if (instance.sessionId === sessionId) return true;
                if (instance.pSessionId !== sessionId) return false;
                instance.pSessionId = null;
                return true;
            }

            instance.getSessionId();

            return instance;
        }
    ]);
(function () {
    'use strict';

    angular
        .module('umbraco.deploy.services')
        .factory('deployHelper', deployHelperService);

    function deployHelperService($window) {

        var service = {
            getDeployItem: getDeployItem,
            getStatusValue: getStatusValue,
            getEntityTypeFromUdi: getEntityTypeFromUdi
        };

        return service;

        ////////////

        function getDeployItem(node, includeDescendants) {

            var item = {
                id: node.id,
                name: node.name,
                includeDescendants: includeDescendants,
                entityType: node.nodeType
            };

            // this is very hacky but basically ensures we "align" every weird thing being sent from the backoffice
            // to the format of the new Udis so we don't have to handle a million different cases.

            // if the item has a treeAlias this is *usually* more correct so we start by using that.
            if (node.metaData !== undefined && node.metaData.treeAlias !== undefined) {
                item.entityType = node.metaData.treeAlias;
            }

            // transform into Deploy terminology
            switch (item.entityType) {
            case 'content':
                item.entityType = 'document';
                break;
            case 'contentBlueprints':
                item.entityType = 'document-blueprint';
                break;
            case 'media':
                item.entityType = 'media';
                break;
            case 'stylesheets':
                item.entityType = 'stylesheet';
                break;
            case 'documentTypes':
                item.entityType = 'document-type';
                break;
            case 'mediaTypes':
                item.entityType = 'media-type';
                break;
            case 'templates':
                item.entityType = 'template';
                break;
            case 'scripts':
                item.entityType = 'script';
                break;
            case 'dictionary':
            case 'DictionaryItem':
                item.entityType = 'dictionary-item';
                break;
            case 'dataTypes':
                item.entityType = 'data-type';
                break;
            case 'macros':
                item.entityType = 'macro';
                break;
            case 'relationTypes':
                item.entityType = 'relation-type';
                break;
            case 'memberTypes':
                item.entityType = 'member-type';
                break;
            case 'memberGroups':
                item.entityType = 'member-group';
                break;
            case 'partialViews':
                item.entityType = 'partial-view';
                break;
            case 'partialViewMacros':
                item.entityType = 'partial-view-macro';
                break;
            case 'form':
                item.entityType = 'forms-form';
                break;
            case 'prevaluesource':
                item.entityType = 'forms-prevalue';
                break;
            case 'datasource':
                item.entityType = 'forms-datasource';
                break;
            case 'contentBlueprints':
                item.entityType = 'document-blueprint';
                break;
            // containers are all just 'container' we have to check the routePath to figure out what kind
            case 'container':
                var m = node.routePath.match(/.+\/(.+?)\/edit\//);
                if (m !== null) {
                    var tree = m[1];
                    if (tree === 'documentTypes') {
                        item.entityType = 'document-type-container';
                    } else if (tree === 'mediaTypes') {
                        item.entityType = 'media-type-container';
                    } else if (tree === 'dataTypes') {
                        item.entityType = 'data-type-container';
                    }
                }
                break;
            }

            // for some reason some of the tree roots doesn't return -1 ... ensure they do now
            if (node.nodeType === 'initstylesheets' ||
                node.nodeType === 'initscripts' ||
                node.nodeType === 'initdictionary' ||
                node.nodeType === 'initmacros' ||
                node.nodeType === 'initmemberGroup' ||
                node.nodeType === 'initxslt') {
                item.id = '-1';
            }

            // make sure that a root node always include all children
            if(item.id === '-1') {
                item.includeDescendants = true;
            }

            // fix missing stylesheet extension
            if (item.entityType === 'stylesheet' && item.id !== '-1' && item.id.indexOf('.css') === -1) {
                item.id = item.id + '.css';
            }

            return item;


        }

        function getStatusValue(number) {
            switch (number) {
                case 2:
                    return 'inProgress';
                case 3:
                    return 'completed';
                case 4:
                    return 'failed';
                case 5:
                    return 'cancelled';
                case 6:
                    return 'timedOut';
                default:
                    return '';
            };
        }

        function getEntityTypeFromUdi(udi) {
            var m = udi.match(/umb:\/\/(.+)\//);
            if (m !== null) {
                return m[1];
            }
            return null;
        }
    }

})();
angular.module('umbraco.deploy.services')
    .service('deployNavigation',
    [
        '$timeout',
        function ($timeout) {

            var instance = this;

            instance.view = 'queue';

            instance.navigate = function(viewname) {
                // using $timeout to defer this from the current digest cycle
                $timeout(function() {
                    instance.view = viewname;
                });
            };

            return instance;
        }
    ]);
angular.module('umbraco.deploy.services')
    .service('deployQueueService',
    [
        '$q', 'notificationsService', 'queueResource',
        function($q, notificationsService, queueResource) {

            var instance = this;

            instance.queue = [];

            instance.clearQueue = function() {

                var deferred = $q.defer();

                queueResource.clearQueue()
                    .then(function (data) {
                        instance.queue.splice(0);
                        deferred.resolve(instance.queue);
                    }, function (data) {
                        notificationsService.error('Error', 'Could not clear the queue.');
                        deferred.reject(data);
                    });
                
                return deferred.promise;

            };

            instance.addToQueue = function (item) {

                var deferred = $q.defer();

                queueResource.addToQueue(item)
                    .then(function (data) {

                        if (data !== 'null' && data !== null) {
                            _.forEach(data,
                                function (rItem) {
                                    var found = _.find(instance.queue,
                                        function (o) {
                                            return o.Udi === rItem.Udi;
                                        });
                                    if (found !== undefined && found !== null) {
                                        found.IncludeDescendants = rItem.IncludeDescendants;
                                    } else {
                                        instance.queue.push(rItem);
                                    }
                                });
                        }
                        deferred.resolve(instance.queue);
                    }, function (data) {
                        notificationsService.error('Error', data.ExceptionMessage);
                        deferred.reject(data);
                    });
                
                return deferred.promise;

            };

            instance.removeFromQueue = function(item) {

                var deferred = $q.defer();

                queueResource.removeFromQueue(item)
                    .then(function (data) {
                        instance.queue.splice(instance.queue.indexOf(item), 1);
                        deferred.resolve(instance.queue);
                    }, function (data) {
                        notificationsService.error('Error', data.ExceptionMessage);
                        deferred.reject(data);
                    });
                
                return deferred.promise;

            }

            instance.refreshQueue = function() {

                var deferred = $q.defer();

                queueResource.getQueue()
                    .then(function (data) {
                        instance.queue.splice(0);
                        _.forEach(data, function (item) {
                            instance.queue.push(item);
                        });
                        deferred.resolve(instance.queue);
                    }, function (data) {
                        notificationsService.error('Error', 'Could not retrieve the queue.');
                        deferred.reject(data);
                    });
                
                return deferred.promise;

            };

            instance.refreshQueue();

            return instance;
        }
    ]);
angular.module('umbraco.deploy.services')
    .service('deploySignalrService',
    [
        '$rootScope',
        function ($rootScope) {

            var instance = this;

            var initialized = false;
            var lock = false;

            $.connection.deployHub.client.sessionUpdated = function (sessionId, status, comment, percent, log, exceptionJson, serverTimestamp) {
                $rootScope.$broadcast('deploy:sessionUpdated', {
                    sessionId: sessionId, status: status, comment: comment, percent: percent, log: log, exception: angular.fromJson(exceptionJson), serverTimestamp: serverTimestamp
                });
            };

            $.connection.deployHub.client.heartbeat = function (sessionId, serverTimestamp) {
                $rootScope.$broadcast('deploy:heartbeat', {
                    sessionId: sessionId, serverTimestamp: serverTimestamp
                });
            };

            $.connection.restoreHub.client.sessionUpdated = function (sessionId, status, comment, percent, log, exceptionJson, serverTimestamp) {
                $rootScope.$broadcast('restore:sessionUpdated', {
                    sessionId: sessionId, status: status, comment: comment, percent: percent, log: log, exception: angular.fromJson(exceptionJson), serverTimestamp: serverTimestamp
                });
            };

            $.connection.restoreHub.client.diskReadSessionUpdated = function (sessionId, status, comment, percent, log, exceptionJson, serverTimestamp) {
                $rootScope.$broadcast('restore:diskReadSessionUpdated', {
                    sessionId: sessionId, status: status, comment: comment, percent: percent, log: log, exception: angular.fromJson(exceptionJson), serverTimestamp: serverTimestamp
                });
            };

            $.connection.restoreHub.client.heartbeat = function (sessionId, serverTimestamp) {
                $rootScope.$broadcast('restore:heartbeat', {
                    sessionId: sessionId, serverTimestamp: serverTimestamp
                });
            };

            instance.initialize = function () {
                if (initialized === false && lock === false) {
                    lock = true;

                    if (Umbraco.Sys.ServerVariables.isDebuggingEnabled) {
                        $.connection.hub.logging = true;
                    }

                    $.connection.hub.start();
                    initialized = true;
                    lock = false;
                }
            };
            
            $.connection.hub.disconnected(function () {
                setTimeout(function () {
                    $.connection.hub.start();
                }, 4000); //When we get disconnected - try to reconnect after 4 seconds
            });

            instance.initialize();

            return instance;
        }
    ]);
(function () {
    'use strict';

    angular
        .module('umbraco.deploy.services')
        .factory('workspaceHelper', workspaceHelperService);

    function workspaceHelperService($window) {

        var service = {
            getActiveWorkspace: getActiveWorkspace,
            addWorkspaceInPortal: addWorkspaceInPortal,
            addAddWorkspace: addAddWorkspace
        };

        return service;

        ////////////

        function getActiveWorkspace(workspaces) {
            for (var i = 0; i < workspaces.length; i++) {
                var workspace = workspaces[i];
                if (workspace.Active === true) {
                    return workspace;
                }
            }
        }

        function addWorkspaceInPortal(projectUrl) {
            $window.open(projectUrl + "?addEnvironment=true");
        }

        function addAddWorkspace(workspaces) {
            var devWorkspaceFound = false;

            var addWorkspace = {
                Name: 'Add workspace',
                Type: 'inactive',
                Current: false,
                Active: false
            };

            angular.forEach(workspaces, function (workspace) {
                if (workspace.Type === 'development') {
                    devWorkspaceFound = true;
                }
            });

            if (!devWorkspaceFound) {
                workspaces.unshift(addWorkspace);
            }
        }
    }
})();