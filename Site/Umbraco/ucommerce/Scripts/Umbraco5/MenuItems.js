/// <reference path="../../Scripts/Umbraco.System/NamespaceManager.js" />
/// <reference path="../../Scripts/Umbraco.System/WindowManager.js" />

Umbraco.System.registerNamespace("UCommerce");

(function ($, Base) {

	UCommerce.MenuItems = Base.extend(null, {

		sortProducts: function ($treeNode, $menuObj) {
			Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "productSortUrl");
		},
		
		sortCategories: function ($treeNode, $menuObj) {
			Umbraco.Controls.MenuItems._changeContentFrame(this, $treeNode, "categorySortUrl");
		},
		
		_changeContentFrame: function (jsTree, $treeNode, metaDataKey) {
			///<summary>A helper method to get the URL from meta data based on the key and change the content frame url to it</summary>

			//the id for the node
			var id = $treeNode.attr("id");
			//get a reference to the umbraco tree api
			var tree = jsTree.get_container().umbracoTreeApi();
			//get the meta data for the node
			var meta = tree.getNodeMetaData($treeNode);
			//check that the createUrl exists
			if (!meta[metaDataKey]) throw metaDataKey + " does not exist in the node's meta data";
			//change the content frame url
			Umbraco.System.WindowManager.getInstance().contentFrame(meta[metaDataKey]);
		}
	});

})(jQuery, base2.Base);