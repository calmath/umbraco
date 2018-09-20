angular.module('umbraco.resources').factory('uCommerceContentResource', uc_content_resource);
angular.module('umbraco').factory('uCommerceContentService', uc_content_picker_service);

angular.module('umbraco').controller("treeController", uc_treeController);

angular.module('umbraco').directive('ucommerceTree', ucommerceTree);
angular.module('umbraco').directive('ucommerceContentTree', ucommerceContentTree);