require.config({
    baseUrl: '../',
    paths: {
        dialog: 'dialog/js/dialog',
        jquery: 'lib/jquery/jquery-1.12.0.min'
    }
})
require(['dialog', 'jquery'], function (CustomDialog, $) {
    var img = $('#images1');
    var dialog = new CustomDialog({
        onCloseBtnClick: function () {
            console.log('关闭')
        },
        type: 'basic',
        text: img
    });

})
