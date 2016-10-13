 $(function () {
     'use strict';

     function Placeholder(selector, options) {
         this.$input = $(selector);
         this.opt = options || {};
     }
     Placeholder.prototype = {
         init: function () {
             var that = this;
             this.$input.each(function () {
                 var $holder = $('<label>' + $(this).attr('placeholder') + '</label>');
                 $(this).addClass('transparent-bg');
                 $holder.css(that.getStyle($(this)));
                 $holder.addClass('placeholder');
                 $('body').append($holder);
                 that.bindMethod($holder, $(this));
             });
         },
         getX: function ($el) {
             return $el.offset().left + (parseInt($el.css('border-left-width')) || 0);
         },
         getY: function ($el) {
             return $el.offset().top + (parseInt($el.css('border-top-width')) || 0);
         },
         getStyle: function ($el) {
             var css = {},
                 attr;
             for (attr in this.opt) {
                 css[attr] = this.opt[attr];
             }
             css.lineHeight = $el.css('line-height') || this.opt.lineHeight;
             css.fontSize = $el.css('font-size') || this.opt.fontSize;
             css.height = $el.height();
             css.width = $el.width();
             css['text-indent'] = $el.css('text-indent');
             css['padding-top'] = $el.css('padding-top');
             css['padding-right'] = $el.css('padding-right');
             css['padding-bottom'] = $el.css('padding-bottom');
             css['padding-left'] = $el.css('padding-left');
             css.left = this.getX($el);
             css.top = this.getY($el);
             console.log(css.top);
             css['text-align'] = $el.css('text-align');
             return css;
         },
         hide: function ($el) {
             $el.removeClass('show').addClass('hide');
         },
         show: function ($el) {
             $el.removeClass('hide').addClass('show');
         },
         bindMethod: function ($holder, $el) {
             var that = this;
             $el.bind('input propertychange', function () {
                 if ($el.val() === '') {
                     that.show($holder);
                 } else {
                     that.hide($holder);
                 }
             });
             $el.blur(function () {
                 if ($el.val() === '') {
                     that.show($holder);
                 }
             });
             $(window).resize(function () {
                 $holder.css({
                     left: that.getX($el),
                     top: that.getY($el)
                 });
             });
             $holder.mousedown(function (e) {
                 $el[0].focus();
             });
         },
         isPlaceholer: function () {
             var input = document.createElement('input');
             return "placeholder" in input;
         }
     }
     window.Placeholder = Placeholder;
 });
