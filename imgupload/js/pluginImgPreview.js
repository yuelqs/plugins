(function ($) {
    var ImgPreview = function (element, option) {
        this.option = $.extend(ImgPreview.DEFAULTS, option);
        this.$button = element;
        this.$imgContainer = $(this.option.imgContainerSelector);
        this.i = 0;
        this.init();
    }
    ImgPreview.DEFAULTS = {
        close: true, //是否添加删除图片按钮
        imgWidth: 200, //图片宽度
        imgHeight: 100, //图片高度
        imgContainerSelector: '.img-container' //图片预览容器选择器
    }
    ImgPreview.prototype = {
        init: function () {
            var that = this;
            this.$button.on('change', 'input', function (e) {
                that.previewImg(e.target);
            });
            this.$imgContainer.on('click', '.img-close', function (e) {
                that.removeImg($(e.target));
            })
        },
        getSuffix: function (file) {
            return file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase();
        },
        previewImg: function (file) {
            var suffix = this.getSuffix(file);
            if (suffix != 'jpg' && suffix != 'png' && suffix != 'jpeg') {
                alert('请上传指定格式的图片文件');
                return;
            }
            this.createPreview(this.$imgContainer, file)
        },
        createPreview: function ($imgContainer, file) {
            var imgsrc, $img, $imgWrap, html;
            try {
                imgsrc = window.URL.createObjectURL(file.files[0]);
                html = ['<div class="img-wrap" data-related="', file.id, '"><img class="preview-img"/>', this.option.close ? '<span class="img-close">×</span>' : '', '</div>'].join('');
                $imgWrap = $(html);
                $img = $imgWrap.find('.preview-img');
                $imgContainer.append($imgWrap);
                $img[0].src = imgsrc;
            } catch (e) {
                file.select();
                this.$imgContainer.focus();
                imgsrc = document.selection.createRange().text;
                html = ['<div class="img-wrap" data-related="', file.id, '">', '<div class="preview-img"></div>', this.option.close ? '<span class="img-close">×</span>' : '', '</div>'].join('');
                $imgWrap = $(html);
                $img = $imgWrap.find('.preview-img');
                $imgContainer.append($imgWrap);
                $img[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                $img[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgsrc;
                document.selection.empty();
            }
            $img.css({
                width: this.option.imgWidth,
                height: this.option.imgHeight
            });
            this.i += 1;
            this.$button.append('<input type="file" class="hidden-inputfile" accept="image/jpeg,image/png" name="attachment" style="z-index:' + this.i + '" id="attachment' + this.i + '">');
        },
        removeImg: function ($close) {
            var $parent = $close.parent(),
                id = $parent.attr('data-related');
            $('#' + id).remove();
            $parent.remove();
        }
    }

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('imgUpload');
            var options = $.extend({}, ImgPreview.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data) {
                $this.data('imgUpload', (data = new ImgPreview($this, options)));
            }
        })
    }

    var old = $.fn.ImgPreview;
    $.fn.imgPreview = Plugin;
    $.fn.imgPreview.constructer = ImgPreview;

    $.fn.imgPreview.noConflict = function () {
        $.fn.imgPreview = old
        return this
    }

}(jQuery))
