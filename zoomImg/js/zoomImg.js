require.config({
    paths: {
        jquery: 'lib/jquery/jquery-1.12.0.min',
        dialog: 'dialog/js/dialog'
    }
});
define(['dialog', 'jquery'], function (dialog, $) {
    function ZoomImg(option) {
        this.option = $.extend(ZoomImg.DEFAULTS, option);
        this.$imgContainer = this.option.imgContainerSelector ? $(this.option.imgContainerSelector) : '';
        this.init();
    }
    ZoomImg.DEFAULTS = {
        nextImg: true, //预留选项，以后需要再完成
        imgContainerSelector: '', //必需
        content: '',
        mask: true,
        skin: 'img-dialog'
    }
    ZoomImg.prototype = {
        init: function () {
            var that = this;
            if (this.$imgContainer) {
                this.$imgContainer.on('click', 'img, .preview-img', function (e) {
                    that.handleImg(e.target);
                })
            } else if (this.option.content && this.isElement(this.option.content)) {
                this.handleImg(this.jqToDom(this.option.content));
            }

        },
        next: function () {
            //预留
        },
        prev: function () {
            //预留
        },
        isElement: function (el) {
            var element = window.HTMLElement || window.Element;
            if (el instanceof jQuery) {
                return true;
            } else {
                return (typeof element !== 'undefined' && el instanceof element) || (typeof el === 'object' && el.nodeType === 1 && typeof el.nodeName === 'string');
            }
        },
        isJqueryObj: function (el) {
            return el instanceof jQuery;
        },
        showImg: function (el) {
            new dialog({
                content: el,
                type: 'basic',
                mask: this.option.mask,
                skin: this.option.skin
            });
        },
        jqToDom: function (el) {
            if (this.isJqueryObj(el)) {
                return el[0];
            } else {
                return el;
            }
        },
        handleImgType: function (img, imgs) {
            var filter = null,
                elName = imgs.nodeName.toLowerCase();
            if (elName === 'div') {
                if (typeof imgs.filters !== 'undefined' && img.filters) {
                    this.showImg(imgs);
                    filter = imgs.filters.item(0);
                    filter.src = img.filters.item(0).src;
                    filter.sizingMethod = 'image';
                }
                this.handleImgWidth(imgs, elName);
            } else if (elName === 'img') {
                imgs.style.cssText = '';
                this.showImg(imgs);
                this.handleImgWidth(imgs, elName);
            }

        },
        handleImg: function (el) {
            var img = el,
                imgs = img.cloneNode();
            this.handleImgType(img, imgs)
        },
        handleImgWidth: function (el, type) {
            var elWidth = 0,
                screenWidth = $(document).innerWidth(),
                scale = 0;
            if (type === 'div') {
                $(el).css({
                    width:el.offsetWidth,
                    height:el.offsetHeight
                });
                elWidth = el.offsetWidth;
                scale = elWidth / (screenWidth - 200);
                if (scale >= 1) {
                    $(el).css({
                        width: elWidth / scale,
                        height: el.offsetHeight / scale
                    });
                    el.filters.item(0).sizingMethod = 'scale';
                }
            } else if (type === 'img') {
                elWidth = $(el).innerWidth();
                scale = elWidth / (screenWidth - 200);
                if (scale >= 1) {
                    $(el).css({
                        width: elWidth / scale
                    })
                }
            }

        }
    }
    return ZoomImg;
})
