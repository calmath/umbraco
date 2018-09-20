function contentTreeController($scope, $rootScope, $window, $location, $q, assetsService) {
	assetsService.loadCss("/App_Plugins/uCommercePicker/ucommerce.tree.css");
	$scope.getPreSelectedValues = function () {

		if ($scope.preSelectedValues) {
			return $scope.preSelectedValues.toString();
		}
		return '';
	};

	$scope.$on('toggleSelectedNode', function (event, node) {

		var identifier = node.id;

		if ($scope.preSelectedValues) {
			if ($scope.preSelectedValues.indexOf(identifier) == -1) {
				$scope.preSelectedValues.push(identifier);
			} else {
				var index = $scope.preSelectedValues.indexOf(identifier);
				$scope.preSelectedValues.splice(index, 1);
			}
		} else {
			$scope.preSelectedValues = [];
			$scope.preSelectedValues.push(identifier);
		}

		var valueArray = '';
		for (n in $scope.preSelectedValues) {
			valueArray += $scope.preSelectedValues[n] + ',';
		}
		valueArray = valueArray.substring(0, valueArray.length - 1);
		console.log(valueArray);
		$scope.model.value = valueArray;
	});

}