function ucommerceMultiPicker($compile) {
	return {
		restrict: 'E',
		scope: true,
		templateUrl: UCommerceClientMgr.BaseUCommerceUrl + 'scripts/app/directives/ucommerce-multi-picker/ucommerce.multi-picker.directive.html',
		replace: false,
		controller: uc_multiPickerController,
		compile: function (tElement, tAttr) {
			var contents = tElement.contents().remove();
			var compiledContents;
			return function (scope, iElement, iAttr) {
				scope.loadOnCompile = iAttr["loadOnCompile"];
				scope.currentNodeElement = iElement;
				if (!scope.contentPickerType) {
					scope.contentPickerType = iAttr["contentPickerType"];
				}

				if (!scope.selectedNodeStyle) {
					scope.selectedNodeStyle = iAttr["selectedNodeStyle"];
				}

				scope.hasRightClickMenu = iAttr["hasRightClickMenu"];
				scope.hasCheckboxFor = iAttr["hasCheckboxFor"];
				scope.multiSelect = iAttr["multiSelect"];
				scope.showSelectedNodes = true;
				if (iAttr["multiSelect"] == "false") {
					scope.showSelectedNodes = false;
				}

				scope.pickertype = iAttr["pickertype"];
				scope.iconFolder = iAttr["iconFolder"];

				var preselectedVals = iAttr["preSelectedValues"];
				if (preselectedVals) {
					scope.preSelectedValues = iAttr["preSelectedValues"].split(',');

				}
				scope.formName = iAttr["formName"];

				if (!compiledContents) {
					compiledContents = $compile(contents);
				}
				compiledContents(scope, function (clone, scope) {
					iElement.append(clone);
				});

				scope.loadPreselectedNodes();
			};

		}
	};
}