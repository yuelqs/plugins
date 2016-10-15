(function($) {
    function CustomDialog($parent,option) {
        this.option = $.extend(CustomDialog.DEFAULTS, option);
        this.messageType = {
            prompt: 'prompt-message',
            warning: 'warning-message',
            error: 'error-message',
            alert: 'alert-message'
        };
        this.handlers = {};
        this.init();
        this.$parent = $parent;
    }
    CustomDialog.DEFAULTS = {
        width: '381', //弹窗宽度
        type: 'confirm', //弹窗类型
        content: '', //弹窗内容
        title: '系统信息', //弹窗标题
        closeBtn: true, //是否添加关闭按钮
        messageType: 'prompt', //消息类型（三种：警告，提示，错误）不同设置对应不同图片
        mask: false, //是否显示遮罩层
        onAlertBtnClick: '', //alert弹窗确定按钮的回调
        onConfirmBtnClick: '', //confirm弹出框确定按钮的回调
        onCancelBtnClick: '', //confirm 弹窗取消按钮的回调
        onCloseBtnClick: '', //关闭弹窗按钮的回调
        skin: '',
        fade: true
    };
    CustomDialog.prototype = {
        init: function() {
            var that = this;
            this.initMask();
            this.initContainer();
            this.initHead();
            this.initBody();
            this.initFooter();
            this.$container.appendTo($('body'));
            if ($('body').css('overflow') !== 'hidden') {
                $('body').addClass('ov-h');
            }
        },
        initContainer: function() {
            this.$container = $([
                '<div class="dialog-container ',
                this.option.skin,
                '">',
                '<div class="dialog-wrap">',
                '<div class="dialog-content">',
                this.option.type == 'basic' ? '' : '<div class="dialog-header"></div>',
                '<div class="dialog-body"></div>',
                this.option.type == 'basic' ? '' : '<div class="dialog-footer"></div>',
                '</div></div></div>'
            ].join(''));
            this.$dialog = this.$container.find('.dialog');
            this.$dialog.css({
                width: this.option.type != 'basic' ? this.option.width : 'auto'

            });
            this.$dialogHeader = this.$container.find('.dialog-header');
            this.$dialogBody = this.$container.find('.dialog-body');
            this.$dialogFooter = this.$container.find('.dialog-footer');

        },
        initHead: function() {
            var that = this;
            var title = ['<h5 class="dialog-title">',
                this.option.title,
                '</h5>'
            ].join('');
            var html = [this.option.closeBtn === true ? '<button type="button" class="close"><span aria-hidden="true">&times;</span></button>' : '',
                this.option.type == 'basic' ? '' : title
            ].join('');
            this.option.type == 'basic' ? this.$dialogBody.append(html) : this.$dialogHeader.append(html);
            if (this.option.closeBtn) {
                this.$close = this.$container.find('.close');
                this.$close.on('click.dialog', function() {
                    $(this).off('dialog');
                    that.hide();
                    that.trigger('close.dialog');
                    that.option.onCloseBtnClick && that.option.onCloseBtnClick();
                });
            }
        },
        initBody: function() {
            var html, message, text;
            message = ['<div class="message ',
                this.messageType[this.option.messageType],
                '">'
            ].join('');
            text = typeof this.option.content == 'string' ? ('<p>' + this.option.content + '</p>') : '';
            html = [
                this.option.type == 'basic' ? '' : message,
                text,
                this.option.type == 'alert' || this.option.type == 'basic' ? '' : '<span>如果是请点击“确定”，否则点“取消”</span>'
            ].join('');
            if (this.isElement(this.option.content)) {
                this.$dialogBody.append(this.option.content);
            }
            this.$dialogBody.append(html);


        },
        initFooter: function() {
            var that = this;
            var html;
            if (this.option.type != 'basic') {
                html = [
                    this.option.type == 'alert' ? '<span class="btn btn-green mr170" id="alert-btn">确&#12288;定</span>' :
                    '<span class="btn btn-green" id="confirm-define">确&#12288;定</span><span class="btn btn-gray mr90" id="confirm-cancel">取&#12288;消</span>'
                ].join('');
                this.$dialogFooter.append(html);
                this.$alertBtn = this.$dialogFooter.find('#alert-btn');
            }

            if (this.option.type == 'alert') {
                this.$alertBtn.on('click.dialog', function() {
                    $(this).off('dialog');
                    that.hide();
                    that.trigger('define.dialog');
                    that.option.onAlertBtnClick && that.option.onAlertBtnClick();
                });

            }
            if (this.option.type == 'confirm') {
                this.$confirmDefine = this.$dialogFooter.find('#confirm-define');
                this.$confirmCancel = this.$dialogFooter.find('#confirm-cancel');
                this.$confirmDefine.on('click.dialog', function() {
                    $(this).off('dialog');
                    that.hide();
                    that.trigger('define.dialog');
                    that.option.onConfirmBtnClick && that.option.onConfirmBtnClick();
                });
                this.$confirmCancel.on('click.dialog', function() {
                    $(this).off('dialog');
                    that.hide();
                    that.trigger('cancel.dialog');
                    that.option.onCancelBtnClick && that.option.onCancelBtnClick();
                });
            }
        },
        initMask: function() {
            if (this.option.mask) {
                this.$mask = $('<div class="dialog-mask"></div>');
                $('body').append(this.$mask);
            }
        },
        hide: function() {
            var that = this;
            this.$container.fadeOut('normal', function() {

                that.$container.remove();
                if ($('body').hasClass('ov-h')) {
                    $('body').removeClass('ov-h');
                }

            });
            if (this.option.mask) {
                this.$mask.fadeOut('normal', function() {
                    that.$mask.remove();
                });
            }
            this.$parent.data('dialog','');


        },
        on: function(type, handler) {
            if (typeof this.handlers[type] == 'undefined') {
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
        },
        trigger: function(type, data) {
            if (this.handlers[type] instanceof Array) {
                var handlers = this.handlers[type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    handlers[i](data);
                }
            }
        },
        isElement: function(el) {
            var element = window.HTMLElement || window.Element;

            // 16-09-29 修改
            //如果el不是object 在ie8中 el使用 instanceof 会报错
            if(typeof el === 'object') {
                if (el instanceof jQuery) {
                    return true;
                } else {
                    return (typeof element !== 'undefined' && el instanceof element) || (typeof el === 'object' && el.nodeType === 1 && typeof el.nodeName === 'string');
                }
            }else {
                return false;
            }
        }
    };

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this);
            var data = $this.data('dialog');
            var options = $.extend({}, CustomDialog.DEFAULTS, $this.data(), typeof option == 'object' && option);
            if (!data) {
                $this.data('dialog', (data = new CustomDialog($this,options)));
            }
        });
    }

    var old = $.fn.dialog;
    $.fn.dialog = Plugin;
    $.fn.dialog.constructer = CustomDialog;

    $.fn.dialog.noConflict = function() {
        $.fn.dialog = old;
        return this;
    };

}(jQuery));
