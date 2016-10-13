$(function() {
    function Pagination(option) {
        option = option || {};
        this.options = $.extend(Pagination.DEFAULTS, option);
        this.pages = this.countPages(this.options.total, this.options.page);
        this.current = this.options.current;
        this.handlers = {};
        this.f = true;
        this.l = false;
        this.init();
    }
    Pagination.DEFAULTS = {
        total: 102, //数据总数
        page: 5,    //每页项数
        current: 1, //当前页
        onNext: null, //点击下一页的回调
        onPrev: null, //点击上一页的回调
        onFirst: null, //点击首页的回调
        onLast: null   //点击最后一页的回调
    }
    Pagination.prototype = {
        init: function() {
            var that = this;
            $('.next-page').click(function() {
                that.next(that.current);
                that.trigger('PageChange', [that.current, that.pages]);
            });
            $('.prev-page').click(function() {
                that.prev(that.current);
                that.trigger('PageChange', [that.current, that.pages]);
            })
            $('.first').click(function() {
                that.first();
                that.trigger('PageChange', [that.current, that.pages]);
            })
            $('.last').click(function() {
                that.last();
                that.trigger('PageChange', [that.current, that.pages]);
            })
            this.on('PageChange', this.countTotal);
            this.trigger('PageChange', [this.current, this.pages]);
        },
        prev: function(current) {
            if (current - 1 <= 0) {
                return;
            }
            this.current = current - 1;
            this.options.onPrev && this.options.onPrev();
        },
        next: function(current) {
            if (current + 1 > this.pages) {
                return;
            }
            this.current = current + 1;
            this.options.onNext && this.options.onNext();
        },
        first: function() {
            if (this.current == 1) return;
            this.current = 1;
            this.options.onFirst && this.options.onFirst();
        },
        last: function() {
            if (this.current == this.pages) return;
            this.current = this.pages;
            this.options.onLast && this.options.onLast();
        },
        countPages: function(total, page) {
            var p = Math.floor(total / page);
            if (total % page === 0) {
                return p;
            } else {
                return p + 1;
            }
        },
        countTotal: function(current, total) {
            $('.total>a').text(current + '/' + total);
            if (current === this.pages) {
                $('.next-page').addClass('disabled');
                $('.last').addClass('active');
                this.l = true;

            }
            if (current === 1) {
                $('.prev-page').addClass('disabled');
                $('.first').addClass('active');
                this.f = true;
            }
            if (current !== total && this.l == true) {
                $('.last').removeClass('active');
                $('.next-page').removeClass('disabled');
                this.l = false;
            }
            if (current !== 1 && this.f == true) {
                this.f = false;
                $('.first').removeClass('active');
                $('.prev-page').removeClass('disabled');
            }
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
                    handlers[i].apply(this, data);
                }
            }
        },
    }

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $(this).data('pagination');
            var options = $.extend({}, Pagination.DEFAULTS, option)
            if (!data) {
                $this.data('pagination', (data = new Pagination(options)));
            }
        })
    }
    var old = $.fn.pagination;
    $.fn.pagination = Plugin;
    $.fn.pagination.constructor = Pagination;

    $.fn.pagination.noConflicts = function() {
        $.fn.pagination = old;
        return this;
    }
})
