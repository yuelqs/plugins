/*jslint browser : true*/
/*global $  window*/
$(function () {
    'use strict';
    var table = {};
    table.title = {
        id: '序列',
        name: '名称',
        amount: '数量',
        price: '单价',
        total: '总计'
    };
    table.data = [{
        id: 1,
        name: '农场话费A',
        amount: 2,
        price: 50,
        total: 100
    }, {
        id: 2,
        name: '飞车道具C',
        amount: 1,
        price: 80,
        total: 80
    }, {
        id: 3,
        name: '空间K',
        amount: 1,
        price: 120,
        total: 120
    }];
    table.status = {
        select: '',
        orderBy: '',
        order: ''
    };
    //计算列的顺序
    table.order = (function () {
        var arr = [];
        return function (data, col1, col2) {
            var i, temp;
            if (arr.length === 0) {
                for (i in data[0]) {
                    arr.push(i);
                }
            }
            if (typeof col1 === 'number' && typeof col2 === 'number') {
                temp = arr.splice(col2, 1);
                arr.splice(col1, 0, temp[0]);
            }
            return arr;

        };
    }());
    //渲染出表格的标题和内容
    table.render = function ($parent, title, data, order) {
        var html = '';
        if (!order) {
            order = table.order(data);
        }
        html += table.renderTitle(title, order);
        html += table.renderBody(data, order);
        $parent.append(html);
    };
    //将表格的标题转换为html字符串
    table.renderTitle = function (title, order) {
        var html = '';
        if ($.type(title) === 'object') {
            html += '<tr>';
            $.each(order, function (i, n) {
                if (table.status.orderBy !== '' && table.status.orderBy === n && table.status.order !== '') { //从状态对象中读取表格的状态
                    html += '<th>' + title[n] + '<span class="sort-status ' + table.status.order + '"></span></th>';
                } else {
                    html += '<th>' + title[n] + '<span class="sort-status default"></span>' + '</th>';
                }

            });
            html += '</tr>';
        }
        return html;
    };
    //将表格的数据部分转换成字符串
    table.renderBody = function (data, order) {
        var html = '';
        if ($.isArray(data)) {
            $.each(data, function (i, a) {
                html += '<tr>';
                $.each(order, function (i, n) {
                    html += '<td>' + a[n] + '</td>';
                });
                html += '</tr>';
            });
        }
        return html;
    };
    //对表格进行排序
    table.sortTable = function (id, index, fn) {
        var $row = $(id).find('tr:not(:first)'),
            html = '',
            order = table.order(table.data);
        table.data = fn(table.data, index, order);
        html = table.renderBody(table.data, order);
        $row.remove();
        $(id).append(html);

    };
    //升序排列表格的行
    table.sortByAsc = function (arr, index, order) {
        var n = '';
        if ($.isArray(order)) {
            n = order[index];
        }
        table.status.orderBy = n; //获取排序列的字段
        if ($.isArray(arr)) {
            arr.sort(function (a, b) {
                var value1 = a[n],
                    value2 = b[n];
                if (!isNaN(value1) && !isNaN(value2)) {
                    return value1 - value2;
                } else {
                    return value1.localeCompare(value2);
                }
            });
        }
        return arr;

    };
    //降序排列表格的行
    table.sortByDsc = function (arr, index, order) {
        var arr1 = table.sortByAsc(arr, index, order);
        return arr1.reverse();

    };
    //拖动的事件添加
    table.drag = function ($parent, $el) {
        $el.on('mousedown', 'th', function (e) {
            var x = e.pageX,
                d = x - $(this).offset().left,
                maxX = $parent.innerWidth() - $(this).outerWidth(),
                minX = 0,
                width = $(this).outerWidth(),
                $box = table.createBox(width),
                index = $(this).index();
            $box.css({
                left: e.pageX - d - $parent.offset().left
            });
            table.showBox($box);
            table.fillBox($parent, $box, index);
            $(document).on('mousemove.drag', function (e) {
                if (e.pageX - d - $parent.offset().left > maxX) {
                    $box.css({
                        left: maxX
                    });
                } else if (e.pageX - d - $parent.offset().left < 0) {
                    $box.css({
                        left: minX
                    });
                } else {
                    $box.css({
                        left: e.pageX - d - $parent.offset().left
                    });
                }
                $(document).on('select', function () {
                    return false;
                });
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            });
            $(document).on('mouseup.drag', function () {
                var i = table.findPosition($parent, $box.offset().left);
                table.changeCol($parent, i, index);
                table.hideBox($box);
                $box.html(" ");
                $(document).off('.drag');
            });

        });

    };
    //创建表格拖动时候的副本
    table.createBox = (function () {
        var $box;
        return function (width) {
            if (!$box) {
                $box = $('<div></div>');
                $box.appendTo('#chenkbox');
                $box.addClass('box box-hide');
            }
            $box.css({
                width: width
            });
            return $box;
        };
    }());
    //找到列拖动后释放的位置
    table.findPosition = function ($parent, cur) {
        var arr = [],
            i;
        $parent.find('th').each(function () {
            arr.push($(this).offset().left + $(this).innerWidth() / 2);
        });
        for (i = 0; i < arr.length; i += 1) {
            if (cur <= arr[i]) {
                return i;
            }
        }
    };
    //将列中的数据填充到列的副本当中
    table.fillBox = function ($parent, $box, index) {
        var $row = $parent.find('tr');
        $row.each(function () {
            $box.append('<div>' + this.cells[index].innerHTML + '</div>'); //???????????????????
        });
    };
    //改变拖动后列的顺序
    table.changeCol = function ($parent, col1, col2) {
        var arr;
        if (col1 !== col2) {
            arr = table.order(table.data, col1, col2);
            $parent.html(" ");
            table.render($parent, table.title, table.data, arr);
        }
    };
    //隐藏拖动后产生的列的副本
    table.hideBox = function ($box) {
        if ($box.hasClass('box-show')) {
            $box.removeClass('box-show').addClass('box-hide');
        }
    };
    //拖动开始后显示列的副本
    table.showBox = function ($box) {
        if ($box.hasClass('box-hide')) {
            $box.removeClass('box-hide').addClass('box-show');
        }
    };
    //将排序与事件绑定
    table.bindSort = function (id) {
        $(id).on('mousedown', 'span', function (e) {
            var index = 0;
            index = $(e.target).parent().index();
            if ($('tr:first').find('th').index($(e.target).parent()) >= 0) {
                if ($(e.target).hasClass('dsc')) {
                    $(e.target).parent().parent().find('span').each(function () {
                        $(this).removeClass('asc').removeClass('dsc');
                    });
                    table.status.order = 'asc'; //获得排序的状态
                    $(e.target).addClass('asc');
                    table.sortTable(id, index, table.sortByAsc);
                } else {
                    $(e.target).parent().parent().find('span').each(function () {
                        $(this).removeClass('asc').removeClass('dsc');
                    });
                    table.status.order = 'dsc'; //获得排序的状态
                    $(e.target).addClass('dsc');
                    table.sortTable(id, index, table.sortByDsc);
                }
                e.stopPropagation();
                return false;
            }
        });
    };
    //鼠标选中行改变颜色
    table.tdClick = function ($parent) {
        $parent.on('click', 'td', function () {
            if (!$(this).hasClass('select')) {
                $parent.find('td').removeClass('select');
                $(this).parent().find('td').addClass('select');
            } else {
                $parent.find('td').removeClass('select');
            }
        });
    };
    //初始化表格
    table.tb = $('#tableSort');
    table.render(table.tb, table.title, table.data);
    table.bindSort('#tableSort');
    table.drag(table.tb, table.tb);
    table.tdClick(table.tb);

});
