        $(function () {
            var button = $('.select-icon'),
                imgContainer = $('.img-container'),
                i = 0;
            imgContainer.on('click', '.close', function (e) {
                var $close = $(e.target),
                    $parent = $close.parent(),
                    id = $parent.attr('data-related');
                $('#' + id).remove();
                $parent.remove();
            })
            button.on('change', 'input', function (e) {
                var img = null,
                    file = e.target,
                    imgsrc = '',
                    suffix = '',
                    imgWrap = null;
                suffix = file.value.substring(file.value.lastIndexOf(".") + 1).toLowerCase();
                if (suffix != 'jpg' && suffix != 'png' && suffix != 'jpeg') {
                    alert('请上传指定格式的图片文件');
                    return false;
                }
                try {
                    imgsrc = window.URL.createObjectURL(file.files[0]);
                    imgWrap = $('<div class="img-wrap" data-related="' + file.id + '"><img class="img"/><span class="close">×</span></div>');
                    img = imgWrap.find('img');
                    imgContainer.append(imgWrap);
                    img[0].src = imgsrc;

                } catch (e) {
                    file.select();
                    imgsrc = document.selection.createRange().text;
                    imgWrap = $('<div class="img-wrap" data-related="' + file.id + '"><span class="close">×</span></div>');
                    try {
                        imgContainer.append(imgWrap);
                        imgWrap[0].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                        imgWrap[0].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgsrc;
                    } catch (e) {
                        alert('请上传指定格式的图片文件');
                    }
                    document.selection.empty();
                }
                i += 1;
                button.append('<input type="file" class="hidden-inputfile" name="attachment" style="z-index:' + i + '" id="attachment' + i + '">');
            })

        })