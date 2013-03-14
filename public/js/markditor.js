!function($) {
    "use strict";

    var get_toolbar_btn = {
        'headers': function() {
            return '<div class="btn-group">' +
                '<a href="javascript:;" class="btn" data-command="insert_header" data-command-value="h1">h1</a>' +
                '<a href="javascript:;" class="btn" data-command="insert_header" data-command-value="h2">h2</a>' +
                '<a href="javascript:;" class="btn" data-command="insert_header" data-command-value="h3">h3</a>' +
                '<a href="javascript:;" class="btn" data-command="insert_header" data-command-value="h4">h4</a>' +
                '<a href="javascript:;" class="btn" data-command="insert_header" data-command-value="h5">h5</a>' +
                '<a href="javascript:;" class="btn" data-command="insert_header" data-command-value="h6">h6</a>' +
            '</div>';
        },
        'link': function() {
            return '<div class="btn-group">' +
                '<a href="javascript:;" class="btn" data-command="insert_link"><i class="icon-link"></i></a>' +
                '<a href="javascript:;" class="btn" data-command="insert_image"><i class="icon-picture"></i></a>' +
            '</div>';
        },
        'emphasis': function() {
            return '<div class="btn-group">' +
                '<a href="javascript:;" class="btn" data-command="bold"><i class="icon-bold"></i></a>' +
                '<a href="javascript:;" class="btn" data-command="italic"><i class="icon-italic"></i></a>' +
                '<a href="javascript:;" class="btn" data-command="code"><i class="icon-chevron-right"></i></a>' +
            '</div>';
        },
        'list': function() {
            return "<div class='btn-group'>" +
                '<a href="javascript:;" class="btn" data-command="insert_ul"><i class="icon-list-ul"></i></a>' +
                '<a href="javascript:;" class="btn" data-command="insert_ol"><i class="icon-list-ol"></i></a>' +
                '<a href="javascript:;" class="btn" data-command="insert_blockquote"><i class="icon-quote-left"></i></a>' +
            "</div>";
        },
        'help': function() {
            return '<a href="javascript:;" class="btn"><i class="icon-question-sign"></i></a>';
        }
    }

    var markdown_values = {
        'h1': '#',
        'h2': '##',
        'h3': '###',
        'h4': '####',
        'h5': '#####',
        'h6': '######',
        'blockquote': '>'
    }

    var commands = {
        'insert_header': function(editor, value) {
            if (typeof(markdown_values[value]) === 'undefined')
                return;
            editor.insertText(markdown_values[value], editor.getSelection().start, true);
        },
        'bold': function(editor) {
            editor.insertText('****', editor.getSelection().start, true);
            editor.setSelection(editor.getSelection().start - 2, editor.getSelection().start - 2);
        },
        'italic': function(editor) {
            editor.insertText('__', editor.getSelection().start, true);
            editor.setSelection(editor.getSelection().start - 1, editor.getSelection().start - 1);
        },
        'code': function(editor) {
            editor.insertText('``', editor.getSelection().start, true);
            editor.setSelection(editor.getSelection().start - 1, editor.getSelection().start - 1);
        },
        'insert_ul': function(editor) {
            editor.insertText('* ', editor.getSelection().start, true);
        },
        'insert_ol': function(editor) {
            editor.insertText('1. ', editor.getSelection().start, true);
        },
        'insert_blockquote': function(editor) {
            editor.insertText('> ', editor.getSelection().start, true);
        },
        'insert_link': function(editor) {
            editor.insertText('[](url)', editor.getSelection().start, true);
            editor.setSelection(editor.getSelection().start - 6, editor.getSelection().start - 6);
        },
        'insert_image': function(editor) {
            editor.insertText('![](url)', editor.getSelection().start, true);
            editor.setSelection(editor.getSelection().start - 6, editor.getSelection().start - 6);
        }
    }

    var Markditor = function(element, content) {
        if (typeof (content) === 'undefined')
            content = '# Hello Markditor!'
        this.container = element;
        this.container.html('<textarea class="markditor-content">'+ content +'</textarea>');
        this.editor = this.container.find('.markditor-content');
        this.toolbar = this.createToolbar();
        this.initToolbar();
    };

    var execute_command = function(editor, command, value){
        if (typeof (commands[command]) === 'undefined')
            return;
        commands[command](editor, value);
    }

    Markditor.prototype = {
        constructor: Markditor,

        createToolbar: function() {
            var toolbar = '<div class="markditor-toolbar">';
            for (var func in get_toolbar_btn){
                toolbar += get_toolbar_btn[func]()
            }
            toolbar += '</div>';
            this.editor.before(toolbar);
            return $('.markditor-toolbar');
        },

        initToolbar: function() {
            var $editor = this.editor;
            this.toolbar.on('click', '.btn[data-command]', function(event){
                var $this = $(this);
                execute_command($editor, $this.attr('data-command'), $this.attr('data-command-value'));
            });
        }
    };


    $.fn.markditor = function () {
        this.addClass('markditor-container');
        var _this = new Markditor(this);
        return this;
    };

    $.fn.markditor.constructor = Markditor;

}(window.jQuery);