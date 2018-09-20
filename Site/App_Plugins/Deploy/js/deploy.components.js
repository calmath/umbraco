(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udConnectLocal', udConnectLocalComponent);

    function udConnectLocalComponent() {

        function link(scope, element, attr, ctrl) {

            scope.connectionOptions = [
                {
                    'name': 'Use Visual Studio',
                    'detailsAlias': 'vs',
                    'icon': 'icon-infinity'
                },
                {
                    'name': 'Use Grunt or Gulp',
                    'detailsAlias': 'cli',
                    'icon': 'icon-terminal'
                },
                {
                    'name': 'Connect with git',
                    'detailsAlias': 'git',
                    'icon': 'icon-forms-github'
                }
            ];
            
            scope.visibleConnectionDetail = '';


            scope.showConnectionDetails = function(type) {
                scope.visibleConnectionDetail = type;
            };

        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/udconnectlocal/udconnectlocal.html',
            scope: {
                'gitUrl': "@",
            },
            link: link
        };

        return directive;

    }

})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udContentFlow', udContentflowComponent);

    function udContentflowComponent(workspaceHelper, angularHelper, deployQueueService, deployService, deployConfiguration, deploySignalrService, deployHelper) {

        function link(scope, element, attr, ctrl) {

            scope.config = deployConfiguration;
            scope.enableWorkItemLogging = false;

            var timestampFormat = 'MMMM Do YYYY, HH:mm:ss';
            var serverTimestampFormat = 'YYYY-MM-DD HH:mm:ss,SSS';

            // beware, MUST correspond to what's in WorkStatus
            var workStatus = ["Unknown", "New", "Executing", "Completed", "Failed", "Cancelled", "TimedOut"];

            function onInit() {

                // make local collection of workspaces because we will have to add "local" and "add workspace".
                scope.dashboardWorkspaces = angular.copy(scope.config.Workspaces);

                // reset the deploy progress
                scope.resetDeploy();

                // add "Add workspace"
                workspaceHelper.addAddWorkspace(scope.dashboardWorkspaces);

                // set active workspace
                setCurrentWorkspace(scope.dashboardWorkspaces);
            }

            function setCurrentWorkspace(workspaces) {
                angular.forEach(workspaces, function (workspace) {
                    if (workspace.Type === scope.config.CurrentWorkspaceType) {
                        workspace.Current = true;
                        workspace.Active = true;
                        scope.showWorkspaceInfo(workspace);
                    }
                });
            }

            // debug

            function updateLog(event, sessionUpdatedArgs) {

                // make sure the event is for us
                if (deployService.isOurSession(sessionUpdatedArgs.sessionId)) {
                    angularHelper.safeApply(scope, function () {
                        var progress = sessionUpdatedArgs;
                        scope.deploy.trace += "" + progress.sessionId.substr(0, 8) + " - " + workStatus[progress.status] + ", " + progress.percent + "%"
                            + (progress.comment ? " - <em>" + progress.comment + "</em>" : "") + "<br />";
                        if (progress.log)
                            scope.deploy.trace += "<br />" + filterLog(progress.log) + "<br /><br />";
                        //console.log("" + progress.sessionId.substr(0, 8) + " - " + workStatus[progress.status] + ", " + progress.percent + "%");
                    });
                }
            }

            function filterLog(log) {
                log = log.replace(/(?:\&)/g, '&amp;');
                log = log.replace(/(?:\<)/g, '&lt;');
                log = log.replace(/(?:\>)/g, '&gt;');
                log = log.replace(/(?:\r\n|\r|\n)/g, '<br />');
                log = log.replace(/(?:\t)/g, '  ');
                log = log.replace('-- EXCEPTION ---------------------------------------------------', '<span class="umb-deploy-debug-exception">-- EXCEPTION ---------------------------------------------------');
                log = log.replace('----------------------------------------------------------------', '----------------------------------------------------------------</span>');
                return log;
            }

            // signalR events for deploy progress
            scope.$on('deploy:sessionUpdated', function (event, args) {

                // make sure the event is for us
                if (args.sessionId === deployService.sessionId) {
                    angularHelper.safeApply(scope, function () {

                        scope.deploy.deployProgress = args.percent;
                        scope.deploy.currentActivity = args.comment;
                        scope.deploy.status = deployHelper.getStatusValue(args.status);
                        scope.deploy.timestamp = moment().format(timestampFormat);
                        scope.deploy.serverTimestamp = moment(args.serverTimestamp).format(serverTimestampFormat);

                        if (scope.deploy.status === 'completed') {

                            deployQueueService.clearQueue();
                            deployService.removeSessionId();

                        } else if (scope.deploy.status === 'failed' || scope.deploy.status === 'cancelled' || scope.deploy.status === 'timedOut') {

                            scope.deploy.error = {
                                hasError: true,
                                comment: args.comment,
                                log: args.log,
                                exception: args.exception
                            };
                        }
                    });
                }
            });

            // signalR heartbeat
            scope.$on('deploy:heartbeat', function (event, args) {
                if (!deployService.isOurSession(args.sessionId)) return;

                angularHelper.safeApply(scope, function () {
                    if (scope.deploy) {
                        scope.deploy.timestamp = moment().format(timestampFormat);
                        scope.deploy.serverTimestamp = moment(args.serverTimestamp).format(serverTimestampFormat);
                    }
                });
            });

            // signalR debug heartbeat
            scope.$on('deploy:heartbeat', function (event, args) {
                if (!deployService.isOurSession(args.sessionId)) return;
                angularHelper.safeApply(scope, function () {
                    scope.deploy.trace += "❤<br />";
                });
            });

            // debug
            // note: due to deploy.service also broadcasting at beginning, the first line could be duplicated
            scope.$on('deploy:sessionUpdated', updateLog);
            scope.$on('restore:sessionUpdated', updateLog);

            scope.resetDeploy = function () {
                //Refetch the queue - after a sucess or failed deploy
                //Sometimes we may not have anything in the queue - so need to ensure we re-fetch it
                deployQueueService.refreshQueue();

                scope.deploy = {
                    'deployProgress': 0,
                    'currentActivity': '',
                    'status': '',
                    'error': {},
                    'trace': '',
                    'showDebug': false
                };
            };

            scope.selectWorkspace = function(selectedWorkspace, workspaces) {

                // deselect all workspaces
                if(workspaces) {
                    angular.forEach(workspaces, function(workspace){
                        workspace.Active = false;
                    });
                }

                // deselect local workspace
                if(scope.localWorkspace) {
                    scope.localWorkspace.Active = false;
                }

                // select workspace
                if(selectedWorkspace) {
                    selectedWorkspace.Active = true;
                }

                scope.showWorkspaceInfo(selectedWorkspace);

            };

            scope.showWorkspaceInfo = function (workspace) {

                if (workspace.Type === 'inactive') {
                    scope.workspaceInfobox = 'addWorkspace';
                } else if (workspace.Type === 'local' && !workspace.Current) {
                    scope.workspaceInfobox = 'connect';
                }
                else if (workspace.Current && scope.config.Target) {
                    scope.workspaceInfobox = 'deploy';
                }
                else {
                    scope.workspaceInfobox = 'info';
                }

            };

            scope.getActiveWorkspace = function() {
                return workspaceHelper.getActiveWorkspace(scope.dashboardWorkspaces);
            };

            scope.addWorkspaceInPortal = function (projectUrl) {
                workspaceHelper.addWorkspaceInPortal(projectUrl);
            };

            // call back when deploy is successfully started
            scope.onDeployStartSuccess = function(data) {
                scope.deploy.deployProgress = 0;
                scope.deploy.currentActivity = "Please wait...";
                scope.deploy.status = deployHelper.getStatusValue(2);
                scope.deploy.timestamp = moment().format(timestampFormat);
                if (scope.enableWorkItemLogging) {
                    scope.deploy.showDebug = true;
                }
            };

            scope.showDebug = function() {
                scope.deploy.showDebug = !scope.deploy.showDebug;
            };

            var search = window.location.search;
            scope.enableWorkItemLogging = search === '?ddebug';

            onInit();
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/udcontentflow/udcontentflow.html',
            link: link
        };

        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udError', udErrorComponent);

    function udErrorComponent() {
        function link(scope, element, attr, ctrl) {

            scope.errorDetailsVisible = false;
            scope.toggleErrorDetails = function() {
                scope.errorDetailsVisible = !scope.errorDetailsVisible;
            }

            // fetch the inner exception that actually makes sense to show in the UI.
            // AggregateException and RemoteApiException are completely non-saying about what the problem is
            // so we should try to get the inner exception instead and use that for displaying errors.

            var e = scope.exception;
            while (e !== null) {
                if (e.HasMeaningForUi) {
                    scope.innerException = e;
                    break;
                }
                if (e.ExceptionType === 'Umbraco.Deploy.Exceptions.RemoteApiException') {
                    e = e.Error;
                    continue;
                }
                else if (e.InnerException !== null) {
                    e = e.InnerException;
                    continue;
                }
                scope.innerException = e;
                break;
            }

            e = scope.exception;
            var udis = [];
            while (e !== null) {
                if (e.ExceptionType === 'Umbraco.Deploy.Exceptions.RemoteApiException') {
                    e = e.Error;
                } else {
                    if (e.Udi && udis.indexOf(e.Udi) < 0) {
                        udis.push(e.Udi);
                    }
                    e = e.InnerException;
                }
            }

            scope.exceptionUdis = udis;
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/uderror/uderror.html',
            scope: {
                'exception': "=",
                'comment': "=",
                'log': "=",
                'status': "=",
                'onBack': "&",
                'onDebug': "&",
                'noNodes': '=',
		'operation': '@operation',
		'timestamp': "=",
                'serverTimestamp': "=",
                'showDebug': "="
            },
            link: link
        };
        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udInfobox', udInfoboxComponent);

    function udInfoboxComponent() {

        function link(scope, element, attr, ctrl) {
            
        }

        var directive = {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/udinfobox/udinfobox.html',
            link: link
        };

        return directive;

    }

})();

(function () {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udStarterKitSelector', udStarterKitSelectorComponent);

    function udStarterKitSelectorComponent($compile, packageResource, $timeout, $q) {

        function link(scope, el, attr, ctrl) {

            scope.installStarterKit = false;
            scope.installStatus = "";
            scope.starterkitName = "";

            scope.selectStarterKit = function (starterKitName) {
                scope.starterkitName = starterKitName;
            };

            scope.startInstall = function () {
                var starterKitName = scope.starterkitName;

                if (starterKitName !== "blank") {
                    installStarterKit(starterKitName);
                } else {

                    if (scope.onSelectStarterKit) {
                        scope.onSelectStarterKit(starterKitName);
                    }

                }
            };

            function installStarterKit(starterKitName) {

                scope.installStarterKit = true;
                scope.installStatus = "Downloading starterkit...";
                scope.installProgress = "10";
                scope.starterkitName = starterKitName;

                packageResource
                    .fetch(starterKitName)
                    .then(function (pack) {
                        scope.installStatus = "Importing starterkit...";
                        scope.installProgress = "30";
                        return packageResource.import(pack);
                    }, installError)
                    .then(function (pack) {
                        scope.installStatus = "Installing starterkit...";
                        scope.installProgress = "40";
                        return packageResource.installFiles(pack);
                    }, installError)

                    .then(function (pack) {
                        scope.installStatus = "Restarting, please wait...";
                        scope.installProgress = "60";
                        var deferred = $q.defer();

                        //check if the app domain is restarted every 2 seconds
                        var count = 0;
                        function checkRestart() {
                            $timeout(function () {
                                packageResource.checkRestart(pack).then(function (d) {
                                        count++;
                                        //if there is an id it means it's not restarted yet but we'll limit it to only check 10 times
                                        if (d.isRestarting && count < 10) {
                                            checkRestart();
                                        }
                                        else {
                                            //it's restarted!
                                            deferred.resolve(d);
                                        }
                                    },
                                    installError);
                            }, 2000);
                        }

                        checkRestart();

                        return deferred.promise;
                    }, installError)

                    .then(function (pack) {
                        scope.installStatus = "Restarting, please wait...";
                        scope.installProgress = "80";
                        return packageResource.installData(pack);
                    }, installError)
                    .then(function (pack) {
                        scope.installStatus = "All done, your browser will now refresh";
                        scope.installProgress = "100";
                        return packageResource.cleanUp(pack);
                    }, installError)
                    .then(installComplete, installError);
            }

            function installComplete(result) {
                if (scope.onSelectStarterKit) {
                    scope.onSelectStarterKit(scope.starterkitName);
                }
            };

            function installError(err){
                scope.installStatus = undefined;
                scope.installError = err;
                //This will return a rejection meaning that the promise change above will stop
                return $q.reject();
            };

            // hack: move element to body to make it full-screen
            // we cannot make an element full screen because of overflow hidden on content
            if (attr.hasOwnProperty("show")) {
                scope.$watch("show", function(value) {
                    if (value === true) {
                        el.appendTo("body");
						$compile(el)(scope);
                    } else {
                        el.remove();
                    }
                });
            }

        }

        var directive = {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/udstarterkitselector/udstarterkitselector.html',
            link: link,
            scope: {
                onSelectStarterKit: "=",
                show: "="
            }
        };

        return directive;

    }

})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udDeployComplete', udDeployCompleteComponent);

    function udDeployCompleteComponent() {
        function link(scope, element, attr, ctrl) {
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/deploy/uddeploycomplete/uddeploycomplete.html',
            scope: {
                'targetName': "=",
                'targetUrl': "=",
                'timestamp': "=",
                'serverTimestamp': "=",
                'onBack': "&"
            },
            link: link
        };
        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udDeployProgress', udDeployProgressComponent);

    function udDeployProgressComponent() {
        function link(scope, element, attr, ctrl) {
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/deploy/uddeployprogress/uddeployprogress.html',
            scope: {
                'targetName': "=",
                'progress': "=",
                'currentActivity': "=",
                'timestamp': "=",
                'serverTimestamp': "="
            },
            link: link
        };
        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udDeployQueue', udDeployQueueComponent);

    function udDeployQueueComponent(deployQueueService, deployService) {
        function link(scope, element, attr, ctrl) {

            var eventBindings = [];

            scope.items = deployQueueService.queue;
            scope.deployButtonState = "init";

            scope.startDeploy = function () {

                scope.deployButtonState = "busy";

                deployService.deploy(scope.enableWorkItemLogging).then(function(data) {

                    if(scope.onDeployStartSuccess) {
                        scope.onDeployStartSuccess({'data': data});
                    }

                    //Set button state to success (We most likely not see this state as the above will trigger the error view change)
                    scope.deployButtonState = "success";

                }, function (error) {

                    //Catching the 500 error from the request made to the UI/API Controller to trigger an instant deployment
                    //Other errors will be caught in 'deploy:sessionUpdated' event pushed out

                    //We don't have ClassName in our Exception here but ExceptionType is what we have
                    //Push in the value manually into our error/exception object
                    error['ClassName'] = error.ExceptionType;

                    //Parent Scope (As this is nested inside ud-content-flow)
                    scope.$parent.deploy.status = 'failed';
                    scope.$parent.deploy.error = {
                        hasError: true,
                        comment: error.Message,
                        exception: error
                    };

                    //Set button state to error (We most likely not see this state as the above will trigger the error view change)
                    scope.deployButtonState = "error";

                });

            };

            scope.clearQueue = function () {
                deployQueueService.clearQueue();
            };

            scope.removeFromQueue = function (item) {
                deployQueueService.removeFromQueue(item);
            };

            scope.refreshQueue = function () {
                deployQueueService.refreshQueue();
            };

            scope.toggleEntityTypeItems = function(items) {
                items.showItems = !items.showItems;
            };

            function setIncludeDescendantsText(items) {
                angular.forEach(items, function(item){
                    if(item.IncludeDescendants) {
                        item.IncludeDescendantsText = "Including all items below it";
                    }
                });
            }

            eventBindings.push(scope.$watch('items', function(newValue, oldValue){
                setIncludeDescendantsText(scope.items);
            }, true));

            // clean up
            scope.$on('$destroy', function () {
                // unbind watchers
                for (var e in eventBindings) {
                    eventBindings[e]();
                }
            });

        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/deploy/uddeployqueue/uddeployqueue.html',
            scope: {
                targetName: "=",
                targetUrl: "=",
                enableWorkItemLogging: "=",
                onDeployStartSuccess: "&"
            },
            link: link
        };
        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udCollisionError', udCollisionErrorComponent);

    function udCollisionErrorComponent() {
        function link(scope, element, attr, ctrl) {
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/errors/udcollisionerror/udcollisionerror.html',
            scope: {
                'exception': "=",
                'exceptionUdis': "=",
                'operation': "="
            },
            link: link
        };
        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udDeploySchemaMismatchError', udDeploySchemaMismatchErrorComponent);

    function udDeploySchemaMismatchErrorComponent() {
        function link(scope, element, attr, ctrl) {

            scope.prettyEntityType = function (udi) {
                var p1 = udi.indexOf('//');
                var p2 = udi.indexOf('/', p1 + 2);
                var n = udi.substr(p1 + 2, p2 - p1 - 2);
                n = n.replace('-', ' ');
                n = n.substr(0, 1).toUpperCase() + n.substr(1);
                return n;
            }
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/errors/uddeployschemamismatcherror/uddeployschemamismatcherror.html',
            scope: {
                'exception': "="
            },
            link: link
        };
        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udRestoreSchemaMismatchError', udRestoreSchemaMismatchErrorComponent);

    function udRestoreSchemaMismatchErrorComponent() {
        function link(scope, element, attr, ctrl) {

            scope.prettyEntityType = function (udi) {
                var p1 = udi.indexOf('//');
                var p2 = udi.indexOf('/', p1 + 2);
                var n = udi.substr(p1 + 2, p2 - p1 - 2);
                n = n.replace('-', ' ');
                n = n.substr(0, 1).toUpperCase() + n.substr(1);
                return n;
            }
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/errors/udrestoreschemamismatcherror/udrestoreschemamismatcherror.html',
            scope: {
                'exception': "=",
                'noNodes': '='
            },
            link: link
        };
        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udRestoreComplete', udRestoreCompleteComponent);

    function udRestoreCompleteComponent() {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/restore/udrestorecomplete/udrestorecomplete.html',
            scope: {
                'onBack': "&",
                'timestamp': "=",
                'serverTimestamp': "="
            }
        };

        return directive;

    }

})();
(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udRestoreProgress', udRestoreProgressComponent);

    function udRestoreProgressComponent() {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/restore/udrestoreprogress/udrestoreprogress.html',
            scope: {
                'targetName': "=",
                'progress': "=",
                'currentActivity': "=",
                'timestamp': "=",
                'serverTimestamp': "="
            }
        };

        return directive;

    }

})();
(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udWorkspace', udWorkspaceComponent);

    function udWorkspaceComponent() {

        function link(scope, element, attr, ctrl) {


        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/workspace/udworkspace/udworkspace.html',
            scope: {
                'name': '=',
                'type': '=',
                'current': '=',
                'active': '=',
                'deployProgress': "=",
                'showDetailsArrow': "=",
                'onClick': '&'
            },
            link: link
        };

        return directive;

    }

})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udWorkspaceAdd', udWorkspaceAddComponent);

    function udWorkspaceAddComponent() {

        function link(scope, element, attr, ctrl) {
            

        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/workspace/udworkspaceadd/udworkspaceadd.html',
            scope: {
                'onAddWorkspace': '&'
            },
            link: link
        };

        return directive;

    }

})();

(function() {
    'use strict';

    angular
        .module('umbraco.deploy.components')
        .directive('udWorkspaceInfo', udWorkspaceInfoComponent);

    function udWorkspaceInfoComponent() {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Deploy/views/components/workspace/udworkspaceinfo/udworkspaceinfo.html',
            scope: {
                'websiteUrl': "@",
                'umbracoUrl': "@",
                'projectUrl': "@",
                'projectName': "@"
            }
        };

        return directive;

    }

})();
