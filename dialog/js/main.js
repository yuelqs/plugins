require.config({
    baseUrl: '../',
    paths: {
        dialog: 'dialog/js/dialog',
        jquery: 'lib/jquery/jquery-1.12.0.min'
    }
})
require(['dialog', 'jquery'], function (CustomDialog, $) {


    $('#tc').click(function () {
        var option = {};
        $('input[name="num"]').each(function () {
            if (this.checked) {
                option.type = this.value;
            }
        });
        $('input[name="messageType"]').each(function () {
            if (this.checked) {
                option.messageType = this.value;
            }
        })
<<<<<<< HEAD
        option.title = $('input[name="title"]').val();
=======
        $('input[name="title"]').val() ===''?'':option.title=title;
>>>>>>> gh-pages
        option.content = $('textarea').val();
        new CustomDialog(option)
    })


})
