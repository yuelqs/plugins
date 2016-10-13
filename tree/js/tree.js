var data = [{
    text: '历史（示例题库）',
    treeContent: [{
        text: '中国古代史',
        treeContent: [{
            text: '第一章 夏、商、西周和春秋战国'
        }, {
            text: '第二章 秦汉'
        }, {
            text: '第三章 三国两晋南北朝',
            treeContent: [{
                text: '第四章 秦汉'
            }, {
                text: '第四章 秦汉'
            }]
        }]
    }, {
        text: '中国古代史 上册'
    }, {
        text: '中国古代史 下册'
    }, {
        text: '中国近代史 上册'
    }, {
        text: '中国近代史 下册'
    }]
}];
var Tree = function (option) {
    this.option = $.extend(Tree.DEFAULTS, option);
    this.init();
};
Tree.DEFAULTS = {
    treeSelector: '.tree',
    treeSkin: '',
    data: data
};
Tree.prototype = {
    init: function () {
        var html = this.generateTreeHtml(this.option.data);
        $('.tree').append(html);
        this.bindEvent();
    },
    bindEvent: function () {
        var that = this;
        $('.tree').on('click', 'i', function () {
            $this = $(this);
            $parent = $this.parent().parent();
            that.toggleTree($parent);
        })
        $('.tree').on('click', 'a', function () {
            $this = $(this);
            $('.tree .select').removeClass('select');
            $(this).addClass('select');
        });
        $('.append-child-node').click(function () {
            var text = $('input[name="name"]').val(); //inout 中的值
            var $select = $('.tree .select');	//选中的节点
            var $parent = $select.parent().hasClass('tree-item'), //新节点的父节点
                $treeHeader = null,
                $treeContent = null,
                $newNode = null,
                $prev = null;
            //判断是否有值
            if (text) {
            	//判断是否选中了要进行操作的节点
                if ($select.length > 0) {
                	//判断要增加节点的父节点是否已经有子节点
                    if ($select.parent().hasClass('tree-item') || $select.parent().hasClass('last-item')) {
                    	//没有子节点的处理
                        $parent = $select.parent();
                        //新节点
                        $newNode = $('<li class="last-item"><a href="javascript:void(0);">' + text + '</a></li>');
                        //如果父节点并没有子节点，则要将父节点变成一棵子树
                        $treeHeader = $('<div class="sub-tree-header"><i></i></div>');
                        //子树的内容
                        $treeContent = $('<ul class="sub-tree-content"></ul>');
                        //样式的处理
                        $parent.removeClass('tree-item').addClass('sub-tree').addClass('open');
                        $treeHeader.append($parent.find('>a'));
                        $treeContent.append($newNode);
                        $parent.append($treeHeader).append($treeContent);
                    } else {
                    	//已经有子节点的处理
                        $parent = $select.parent().parent();
                        //创建新节点
                        $newNode = $('<li class="last-item"><a href="javascript:void(0);">' + text + '</a></li>');
                        //已经存在子节点则获取树的内容
                        $treeContent = $parent.find('>.sub-tree-content');
                        //新增加的节点变成最后一个节点，上一个节点的last-item样式要删掉
                        $prev = $treeContent.find('>li:last');
                        //根据上一个节点的类型的不同来增加样式
                        if ($prev.hasClass('sub-tree')) {
                        	//当上一个节点是子树
                            $prev.removeClass('last-item');
                        } else {
                        	//当上一个节点是一个子节点
                            $prev.removeClass('last-item').addClass('tree-item');
                        }
                        $treeContent.append($newNode);
                    }
                } else {
                	//没有选中节点则弹出提示框
                    alert('请选择要增加子节点的节点');
                }
            } else {
            	//没有输入要增加的名称，则弹出提示框
                alert("请输入要增加的节点名称");
            }
        });
    },
    generateTreeHtml: function (data) {
        var i,
            html = '';
        if (data instanceof Array) {
            for (i = 0; i < data.length; i++) {
                if (i === data.length - 1) {
                    if (typeof data[i].treeContent !== 'undefined' && data[i].treeContent instanceof Array) {
                        html += '<li class="sub-tree last-item open"><div class="sub-tree-header"><i></i><a href="javascript:void(0);">' + data[i].text + '</a></div><ul class="sub-tree-content">' + this.generateTreeHtml(data[i].treeContent) + '</ul></li>';
                    } else {
                        html += '<li class="last-item"><a href="javascript:void(0);">' + data[i].text + '</a></li>'
                    }
                } else {
                    if (typeof data[i].treeContent !== 'undefined' && data[i].treeContent instanceof Array) {
                        html += '<li class="sub-tree open"><div class="sub-tree-header"><i></i><a href="javascript:void(0);">' + data[i].text + '</a></div><ul class="sub-tree-content">' + this.generateTreeHtml(data[i].treeContent) + '</ul></li>';
                    } else {
                        html += '<li class="tree-item"><a href="javascript:void(0);">' + data[i].text + '</a></li>'
                    }
                }

            }
        }
        return html;
    },
    appendNode: function (text) {

    },
    appendChildNode: function (text, parent) {

    },
    insertNode: function () {

    },
    toggleTree: function ($tree) {
        if ($tree.hasClass('open')) {
            $tree.removeClass('open').addClass('off');
        } else if ($tree.hasClass('off')) {
            $tree.removeClass('off').addClass('open');
        }
    }
}
$(function () {
    var t = new Tree();
})
