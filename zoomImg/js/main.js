require.config({
<<<<<<< HEAD
    baseUrl: '/',
=======
    baseUrl: '../',
>>>>>>> gh-pages
    paths: {
        jquery: 'lib/jquery/jquery-1.12.0.min',
        zoomImg: 'zoomImg/js/zoomImg'
    }
});

require(['jquery', 'zoomImg'], function ($, zoomImg) {
<<<<<<< HEAD
    $(document).on('imgClick.zoomImg', function (e, el) {
        new zoomImg({
            skin: 'img-dialog',
            content: el
        });
    })

=======
    $('.img-container').on('click', 'img', function(e) {
        new zoomImg({
            skin: 'img-dialog',
            content:e.target
        });
    });
>>>>>>> gh-pages
})
