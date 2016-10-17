require.config({
    baseUrl: '../',
    paths: {
        jquery: 'lib/jquery/jquery-1.12.0.min',
        zoomImg: 'zoomImg/js/zoomImg'
    }
});

require(['jquery', 'zoomImg'], function ($, zoomImg) {
    $('.img-container').on('click', 'img', function(e) {
        new zoomImg({
            skin: 'img-dialog',
            content:e.target
        });
    });
})
