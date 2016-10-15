require.config({
    baseUrl: '/',
    paths: {
        jquery: 'lib/jquery/jquery-1.12.0.min',
        zoomImg: 'zoomImg/js/zoomImg'
    }
});

require(['jquery', 'zoomImg'], function ($, zoomImg) {
    $(document).on('imgClick.zoomImg', function (e, el) {
        new zoomImg({
            skin: 'img-dialog',
            content: el
        });
    })

})
