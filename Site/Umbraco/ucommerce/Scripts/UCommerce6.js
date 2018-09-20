var UCommerceClientMgr = {

    BaseServiceUrl: '/ucommerceapi/',
    BaseUCommerceUrl: "/umbraco/ucommerce/",
    Shell: "Umbraco7",
    
    openModal: function (url, name, width, height) {
        getUmbClientMgr().openModalWindow(url, name, true, width, height);

        var marginPx = width * -1;
    	top.angular.element('.umb-modal').css('margin-left', marginPx + 'px');
    	top.angular.element('.umb-modal').each(function () {
    		this.style.setProperty('width', width+'px', 'important');
    	});

    	var element = '<div id="modalOverLayTemp"></div>';
	    element = $(element);
    	element.css('display', 'block');
    	element.css('position', 'absolute');
    	element.css('top', '0px');
    	element.css('left', '0px');
    	element.css('width', '100%');
    	element.css('height', '100%');
    	element.css('background-color', 'rgba(255,255,255,0');
    	element.css('z-index', '100');

        element.click(function () {
    		$(this).remove();
    		getUmbClientMgr().closeModalWindow();
            return false;
        });

        top.$('#mainwrapper').append(element);
    },

    getCurrentNodeId: function () {
        return getUmbClientMgr().mainTree().getActionNode().nodeId;
    },

    contentFrame: function (url) {
	    top.angular.element("#umbracoMainPageBody").scope().$apply(function() {
	    	top.UmbClientMgr.contentFrame(url);
	    	top.angular.element(top.angular.element("#umbracoMainPageBody")).injector().get('$route').reload();
	    });
    },


    updateCurrentNodeText: function (nodeText) {
        getUmbClientMgr().mainWindow().jQuery(".sprTree.noSpr.clicked > div").text(nodeText);
    },

    childNodeCreated: function () {
        getUmbClientMgr().mainTree().reloadActionNode();
    },

    // For instance nodeId can be Category_67
    findAndSelectNode: function (nodeId) {
        var node = getUmbClientMgr().mainTree().findNode(nodeId, true);
        if (node != null)
            getUmbClientMgr().mainTree().selectNode(node, true, true);
    },

    closeModalWindow: function (url) {
    	removeOverlay();
    	getUmbClientMgr().closeModalWindow(url);
    },

    showSpeechBubble: function (icon, header, body) {
        getUmbClientMgr().mainWindow().UmbSpeechBubble.ShowMessage(icon, header, body);
    },

    setFocusToTreeNode: function (treeNode) {
        getUmbClientMgr().mainTree().selectNode(node, false, true);
    },

    refreshTree: function () {
        var scope = getUmbracoTreeAngularScope();
        scope.$apply(function() {
            var treeService = getUmbracoTreeService();
            var menuNode = getUmbracoCurrentMenuNode();
            if (menuNode && menuNode.menuUrl != "") {
                treeService.reloadNode(menuNode);
            }
        });
    },

    showPopupWindow: function (url, width, height, saveFunction) {
        getUmbClientMgr().openModalWindow(this._itemPickerUrl, this._label, this._showHeader, this._width, this._height, 60, 0, ['#cancelbutton'], function (e) { _this.SaveSelection(e); });
    },

    refreshChildrenFor: function (args) {
        for (n in args) {
            refreshChildren(n, args);
        }
    }
};

function sortCategoryThis() {
    UCommerceClientMgr.openModal('ucommerce/catalog/dialogs/SortCatalog.aspx?id=' + UCommerceClientMgr.getCurrentNodeId(), 'Sort', 600, 450);
};

function sortProductsThis() {
    UCommerceClientMgr.openModal('ucommerce/catalog/dialogs/SortCatalog.aspx?id=' + UCommerceClientMgr.getCurrentNodeId() + '&products=1', 'Sort', 600, 450);
};

function findNodeElement(nodeElements, targetId) {
    var foundNode = null;

    for (var index = 0; index < nodeElements.length; index++) {
        var treeItemElement = parent.angular.element(nodeElements[index]);
        var treeItemScope = treeItemElement.scope();

        if (treeItemScope.node.id == targetId) {
            foundNode = treeItemElement;
            break;
        }

        var children = treeItemElement.children()[1].children;

        if (children && !foundNode) {
            foundNode = findNodeElement(children, targetId);
        }
    }

    return foundNode;
}

function refreshChildren(n, args) {
    parent.setTimeout(function () {
        var treeElement = parent.angular.element('#tree');
        var treeChildren = treeElement.children()[0].children[0].children[1].children;

        var nodeId = '';
        switch (args[n].nodeType) {
            case 'productCatalog':
                nodeId = 'productCatalog_' + args[n].id;
                break;
            case 'productCategory':
                nodeId = 'Category_' + args[n].id;
                break;
        	case 'marketingProductCatalogGroup':
        		nodeId = 'marketingProductCatalogGroup_' + args[n].id;
        		break;
        }

        var node = findNodeElement(treeChildren, nodeId);

        node.scope().$apply(function (scope) {
            scope.node.hasChildren = true;
            scope.loadChildren(scope.node, true);
        });
    }, 500 * n);
}

function getUmbClientMgr() {
    if (UmbClientMgr) return UmbClientMgr;
    return top.UmbClientMgr;
}

function removeOverlay() {
    var overLay = top.$('#modalOverLayTemp').last();
    if (overLay) {
        overLay.remove();
    }
}

function getUmbracoAngularInjector() {
    var injector = top.angular.element(top.angular.element("#umbracoMainPageBody")).injector();
    //console.log('injector retrieved');
    //console.log(injector);
    return injector;
}

function getUmbracoTreeAngularScope() {
    var scope = top.angular.element(top.angular.element("#tree")).scope();
    //console.log('scope retrieved');
    //console.log(scope);
    return scope;
}

function getUmbracoTreeService() {
    var service = getUmbracoAngularInjector().get('treeService');
    //console.log('tree service retrieved');
    //console.log(service);
    return service;
}

function getUmbracoCurrentMenuNode() {
    var appState = getUmbracoAngularInjector().get('appState');
    //console.log('appState retrieved');
    //console.log(appState);
    var currentNode = appState.getMenuState('currentNode');
    //console.log('current menu node retreived');
    //console.log(currentNode);
    return currentNode;
}



