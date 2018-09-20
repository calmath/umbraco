$(document).ready(function () {
    
});
var UCommerceClientMgr = {
    openModal: function (url, name, width, height) {
        $dialog = $('<iframe id="modaldialogdiv" style="width: 100%;"></iframe>'); //Create iframe object
        $dialog.height('100%');


        if (window.parent.$("#modaldialogdiv").length < 1) { //Check if the iframe is already created
            $('#sectionGroup').append($($dialog).hide()); //Append object to #SectionGroup if !created
            //var $myIframe = $dialog.hide().appendTo(window.parent.document.body);
        }

        $UcIframe = $('#modaldialogdiv');
        $UcIframe.attr('src', url); // Sets the iframe URL
        $UcIframe.dialog({ //Create the dialog with the iframe
            dialogClass: "uCommerceModal",
            modal: true,
            title: name,
            height: height,
            width: width,
            close: function (ev, ui) {
                $UcIframe.remove();
                Umbraco.System.WindowManager.getInstance().toggleTopWindowOverlay(false);
            } //Does it still need to test for iframe objects with this feature?
        });
        $UcIframe.css('width', '100%');
        Umbraco.System.WindowManager.getInstance().toggleTopWindowOverlay(true);
       },
    
    closeModalWindow: function () {
        window.parent.$("#modaldialogdiv").dialog('close');
    }
    //window.top.contentFrame.$('Iframe#modaldialogdiv').dialog('close');}
};

var UCommerceMediaPicker = {
    clearSelection: function (element) {
        $(element).parent().find('span.image-title').text('');
        $(element).parent().find('input:hidden').val('');
        $(element).hide();
    }
};

 