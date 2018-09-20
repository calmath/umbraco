angular.module('umbraco.deploy.filters')
    .filter('entityTypeToName',
    [
        function () {
            var entityTypes = {
                'document': 'Content items',
                'document-blueprint': 'Content blueprints',
                'document-type-blueprints': 'Content blueprints for Document Types',
                'media': 'Media',
                'member': 'Members',

                'dictionary-item': 'Dictionary Items',
                'macro': 'Macros',
                'relation-type': 'Relation Types',
                'template': 'Templates',

                'document-type': 'Document Types',
                'document-type-container': 'Document Type Containers',
                'media-type': 'Media Types',
                'media-type-container': 'Media Type Containers',
                'data-type': 'Data Types',
                'data-type-container': 'Data Type Containers',
                'member-type': 'Member Types',
                'member-group': 'Member Groups',

                'media-file': 'Media Files',
                'template-file': 'Template Files',
                'script': 'Scripts',
                'stylesheet': 'Stylesheets',
                'partial-view': 'Partial Views',
                'partial-view-macro': 'Macro Partial Views',
                'xslt': 'XSLT Files',
                'forms-form': 'Forms',
                'forms-prevalue': 'Forms prevalues',
                'forms-datasource': 'Forms datasources'
        };
            return function(val) {
                return entityTypes[val];
            }
        }
    ]);
angular.module('umbraco.deploy.filters')
    .filter('grpByEntityType',
    [
        function () {
            // using memoize to prevent digest loop from going crazy
            return _.memoize(function (items) {
                return _.groupBy(items,
                    function (item) {
                        // try getting a entity type match from the Udi string
                        var m = item.Udi.match(/umb:\/\/(.+?)\//i);
                        if (m !== null) {
                            return m[1];
                        }
                        return 'unknown';
                    });
            }, function (items) {
                return JSON.stringify(items);
            });
        }
    ]);
// filter can be used to get number of object properties
angular.module('umbraco.deploy.filters')
    .filter('keysLength',
    [
        function() {
            return function(input) {
                if (!angular.isObject(input)) {
                    throw Error("Usage of non-objects with keyslength filter!!");
                }
                return Object.keys(input).length;
            }
        }
    ]);
// we're using an old version of angular where the limitTo filter only supports arrays and strings.
// this filter can most likely be removed when we upgrade angular at some point.
angular.module('umbraco.deploy.filters')
    .filter('limitToExtended',
    [
        function() {
            return function(obj, limit) {
                var keys = Object.keys(obj);
                if (keys.length < 1) {
                    return [];
                }

                var ret = new Object;
                var count = 0;

                _.forEach(keys,
                    function(key) {
                        if (count >= limit) {
                            return false;
                        }
                        ret[key] = obj[key];
                        count++;
                        return true;
                    });
                return ret;
            };
        }
    ]);