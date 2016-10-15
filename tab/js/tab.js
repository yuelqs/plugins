var MenuTab = function() {
    this.$leftArrow = $('.left-arrow');
    this.$rightArrow = $('.right-arrow');
    this.$navWraper = $('.nav-wraper-w');
    this.$navTabContainer = $('.nav-wraper');
    this.$navWrap = $('.nav-wrap');
    this.$navTab = this.$navTabContainer.find('.nav-tabs');
    this.$tabContent = $('.tab-content');
    this.$tabDropdown = $('.nav-wraper-w>.dropdown');
    this.$tabDropdownMenu = this.$tabDropdown.find('.dropdown-menu');
};

MenuTab.prototype = {
    init: function() {
        var that = this;
        this.$navTab.on('addTab.tab', function(ev) {
            that.addTab(ev);
        });
        //点击左边箭头tab向右移动
        this.$leftArrow.on('click.left.arrow', function() {
            that.moveAnimation('left');
            return false;
        });
        //点击右边的箭头tab向左移动
        this.$rightArrow.on('click.right.arrow', function() {
            that.moveAnimation('right');
            return false;
        });
        //当tab显示时
        this.$navWraper.on('shown.bs.tab', 'a[data-toggle="tab"]', function() {
            var attr = $(this).attr('href');
            //清除下拉菜单中当前项
            that.$tabDropdownMenu.find('.active').removeClass('active');
            //将现在显示的项设置为活动状态
            that.getTab(that.$tabDropdownMenu, attr).parent().addClass('active');
            that.moveAnimation('none', $(this).parent().index());

        });
        //点击下拉菜单时，tab栏tab切换效果
        this.$tabDropdownMenu.on('click.tab', 'a[data-toggle="tab"]', function() {
            var attr = $(this).attr('href');
            that.getTab(that.$navTab, attr).tab('show');
        });
        //点击tab上的叉关掉tab
        this.$navTab.on('click', '.tab-close', function() {
            that.closeTab($(this));
        });
    },
    //增加tab
    addTab: function(ev) {
        var $target = $(ev.relatedTarget),
            newTabData = {},
            tabHtml;
        newTabData.id = $target.attr('href');
        newTabData.fileName = $target.parent().parent().parent().find(">a").attr('href').substring(1);
        newTabData.pageName = newTabData.id.substring(1);
        newTabData.text = $($target).text();
        this.$navWraper.find('.active').removeClass('active');
        if ($(newTabData.id).length > 0) {
            this.$navWraper.find('a[href="' + newTabData.id + '"]').tab('show');
        } else {
            tabHtml = '<li class="active">' + '<a href="' + newTabData.id + '" data-toggle="tab">' + newTabData.text + '</a>' + '<span class="tab-close">×</span></li>';
            this.$navTab.append(tabHtml);
            this.$tabDropdownMenu.append(tabHtml);
            //使最新添加的tab总是处于可视区最右边。
            this.$navWrap.animate({
                left: this.getLeft()
            }, 'fast');
            this.addTabContent(newTabData);
        }
    },
    //增加tab-pane内容
    addTabContent: function(newTabData) {
        var $content = $('<div class="tab-pane active" id="' + newTabData.pageName + '"><iframe frameborder="0" src="' + newTabData.fileName + '/' + newTabData.pageName + '.html' + '" name="' + newTabData.pageName + '"></iframe></div>');
        this.$tabContent.find('.active').removeClass('active');
        this.$tabContent.append($content);

    },
    //获取新添加的tab的位置
    getLeft: function() {
        var w1, w2;
        w1 = this.$navTab.innerWidth();
        w2 = this.$navTabContainer.innerWidth();
        //比较tab栏实际的宽度和可视区域的宽度
        if (w1 > w2) {
            return w2 - w1 - 2;
        } else {
            return 0;
        }
    },
    //计算需要向右移动的距离
    getMoveLeftWidth: function(left) {
        var $li = this.$navTab.find('>li'),
            w = 0,
            i;
        //判断能否向右移动，不能则返回
        if (left === 0) {
            return left;
        }
        //遍历所有tab，计算移动一个tab到可视区内所需距离
        for (i = 0; i < $li.length; i += 1) {
            w += $li.eq(i).outerWidth(true);
            //tab与可视区的最左边存在两种关系，1，刚好与最左边缘对齐，把这个tab的前一个移过来
            // 2.这个tab有一部分不在可视区内，把这一部分移到可视区内
            if (w + left >= 0) {
                return $li.eq(i).outerWidth(true) - w;
            }
        }
    },
    //计算需要向左移动的距离
    getMoveRightWidth: function(left) {
        var $li = this.$navTab.find('>li'),
            containerWidth = this.$navTabContainer.innerWidth(),
            realWidth = this.$navTab.innerWidth(),
            w = 0,
            i;
        //判断 1.当总的tab宽度比可见的宽度要小，则不能移动 2.当最后一个tab处在最左边时，不能移动
        if (realWidth < containerWidth || realWidth === containerWidth - left - 2) {
            return left;
        }
        for (i = 0; i < $li.length; i += 1) {
            w += $li.eq(i).outerWidth(true);
            //比较tab的宽度与可视区和left值的大小，由于多加了一个2，所以只能大于，不会等于
            if (w + left - containerWidth > 0) {
                //手动将tab多向左移动两像素，因为tab栏中的tab是只有mg-left值
                return -(w - containerWidth + 2);
            }
        }
    },
    //点击menu时，将已存在但是不在可视区内的tab移动到可视区内
    getPosition: function(index, left) {
        var $li = this.$navTab.find('>li'),
            containerWidth = this.$navTabContainer.innerWidth(),
            w = 0,
            i,
            elWidth = $li.eq(index).outerWidth(true);
        //计算当前tab之前所有tab的总宽度
        for (i = 0; i < index; i += 1) {
            w += $li.eq(i).outerWidth(true);
        }
        //判断tab是否在可视区内，如果在，直接返回原来的left值
        if (w + left > 0 && w + elWidth <= containerWidth - left) {
            return left;
        }
        //当tab的位置不在可视区，或者有一部分不在可视区内时
        if (w + left <= 0) {
            return -w;
        }

        if (w + elWidth > containerWidth - left) {
            //包括当前tab在内所有tab的宽度与可视区域和左边不可视区域宽度的和进行比较
            //如果是大于，则当前tab不在可视区，或者有一部分不在可视区
            return -(w - containerWidth + elWidth + 2);
        }
    },
    //关闭tab
    closeTab: function($that) {
        var id = $that.parent().find('a').attr('href'),
            $li = $that.parent(),
            $prev = $li.prev(),
            active = $li.hasClass('active'),
            attr;
        $li.remove();
        this.getTab(this.$tabDropdownMenu, id).parent().remove();
        this.$navWrap.css({
            left: this.getLeft()
        });
        //关闭一个active的tab
        if ($prev.length > 0 && active) {
            //将前一个tab设置为活动状态
            $prev.find('a').tab('show');
            attr = $prev.find('a').attr('href');
            this.getTab(this.$tabDropdownMenu, attr).parent().addClass('active');
        }
        $(id).remove();
        $(document).trigger('resizeHeight');
    },
    //根据herf属性和父元素获取相应a标签元素
    getTab: function($context, attr) {
        return $context.find('a[href="' + attr + '"]');
    },
    moveAnimation: function(dir, index) {
        var left = parseInt(this.$navWrap.css('left')),
            width;
        if (dir === 'left') {
            width = this.getMoveLeftWidth(left);
        }
        if (dir === 'right') {
            width = this.getMoveRightWidth(left);
        }
        if (dir === 'none') {
            width = this.getPosition(index, left);
        }
        this.$navWrap.animate({
            left: width
        }, 'fast');
    }
};
