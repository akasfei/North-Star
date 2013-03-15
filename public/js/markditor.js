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
                '<a href="#link-modal" class="btn" data-toggle="modal"><i class="icon-link"></i></a>' +
                '<div id="link-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="link-modal-title" aria-hidden="true">' +
                  '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                    '<h3 id="link-modal-title">Insert Link</h3>' +
                  '</div>' +
                  '<div class="modal-body">' +
                    '<input type="text" id="insert-link-name" class="input-block-level" placeholder="Link title">' + '<br>' +
                    '<input type="text" id="insert-link-url" class="input-block-level" placeholder="Link url">'  +
                  '</div>' +
                  '<div class="modal-footer">' +
                    '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
                    '<button class="btn btn-primary" data-dismiss="modal" data-command="insert_link">Save changes</button>' +
                  '</div>' +
                '</div>' +
                '<a href="#image-modal" class="btn" data-toggle="modal"><i class="icon-picture"></i></a>' +
                '<div id="image-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="image-modal-title" aria-hidden="true">' +
                  '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                    '<h3 id="image-modal-title">Insert Image</h3>' +
                  '</div>' +
                  '<div class="modal-body">' +
                    '<input type="text" id="insert-image-alt" class="input-block-level" placeholder="Image alt text">' + '<br>' +
                    '<input type="text" id="insert-image-url" class="input-block-level" placeholder="Image url">'  +
                  '</div>' +
                  '<div class="modal-footer">' +
                    '<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
                    '<button class="btn btn-primary" data-dismiss="modal" data-command="insert_image">Save changes</button>' +
                  '</div>' +
                '</div>' +
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
            return '<a href="javascript:;" data-command="toggle_help" class="btn"><i class="icon-question-sign"></i></a>' + 
                '<div class="markditor-help tabbable tabs-left" style="display:none;">' +
                    '<ul class="nav nav-tabs">' +
                      '<li class="active"><a href="#help-block" data-toggle="tab">Block Elements</a></li>' +
                      '<li><a href="#help-span" data-toggle="tab">Span Elements</a></li>' +
                      '<li><a href="#help-misc" data-toggle="tab">Miscellaneous</a></li>' +
                    '</ul>' +
                    '<div class="tab-content">' +
                      '<div class="tab-pane active" id="help-block">' +
                        '<div class="tabbable tabs-left">' +
                          '<ul class="nav nav-tabs">' +
                            '<li class="active"><a href="#help-block-p" data-toggle="tab">Paragraphs & Breaks</a></li>' +
                            '<li><a href="#help-block-h" data-toggle="tab">Headers</a></li>' +
                            '<li><a href="#help-block-quotes" data-toggle="tab">Blockquotes</a></li>' +
                            '<li><a href="#help-block-lists" data-toggle="tab">Lists</a></li>' +
                            '<li><a href="#help-block-code" data-toggle="tab">Code Blocks</a></li>' +
                          '</ul>' +
                          '<div class="tab-content">' +
                            '<div class="tab-pane active" id="help-block-p">' +
                              '<p>To create a paragraph, simply create a block of text that is not separated by one or more blank lines. Blocks of text separated by one or more blank lines will be parsed as paragraphs.</p>' +
                              '<p>If you want to create a line break, end a line with two or more spaces, then hit Return/Enter.</p>' +
                            '</div>' +
                            '<div class="tab-pane" id="help-block-h">' +
                              '<p>Markdown supports two header formats. The wiki editor uses the “atx’-style headers. Simply prefix your header text with the number of # characters to specify heading depth. For example: # Header 1, ## Header 2 and ### Header 3 will be progressively smaller headers. You may end your headers with any number of hashes.</p>' +
                            '</div>' +
                            '<div class="tab-pane" id="help-block-quotes">' +
                              '<p>Markdown creates blockquotes email-style by prefixing each line with the >. This looks best if you decide to hard-wrap text and prefix each line with a > character, but Markdown supports just putting > before your paragraph.</p>' +
                            '</div>' +
                            '<div class="tab-pane" id="help-block-lists">' +
                              '<p>Markdown supports both ordered and unordered lists. To create an ordered list, simply prefix each line with a number (any number will do — this is why the editor only uses one number.) To create an unordered list, you can prefix each line with *, + or -.</p>' +
                              '<p>List items can contain multiple paragraphs, however each paragraph must be indented by at least 4 spaces or a tab.</p>' +
                            '</div>' +
                            '<div class="tab-pane" id="help-block-code">' +
                              '<p>Markdown wraps code blocks in pre-formatted tags to preserve indentation in your code blocks. To create a code block, indent the entire block by at least 4 spaces or one tab. Markdown will strip the extra indentation you’ve added to the code block.</p>' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                      '<div class="tab-pane" id="help-span">' +
                        '<div class="tabbable tabs-left">' +
                          '<ul class="nav nav-tabs">' +
                            '<li class="active"><a href="#help-span-link" data-toggle="tab">Links</a></li>' +
                            '<li><a href="#help-span-em" data-toggle="tab">Emphasis</a></li>' +
                            '<li><a href="#help-span-code" data-toggle="tab">Code</a></li>' +
                            '<li><a href="#help-span-image" data-toggle="tab">Images</a></li>' +
                          '</ul>' +
                          '<div class="tab-content">' +
                            '<div class="tab-pane active" id="help-span-link">' +
                              '<p>Markdown has two types of links: inline and reference. For both types of links, the text you want to display to the user is placed in square brackets. For example, if you want your link to display the text “SFEI”, you write [SFEI].</p>' +
                              '<p>To create an inline link, create a set of parentheses immediately after the brackets and write your URL within the parentheses. (e.g., [North Star](http://northstar.cloudfoundry.com/)). Relative paths are allowed in inline links.</p>' +
                              '<p>To create a reference link, use two sets of square brackets. [my internal link][internal-ref] will link to the internal reference internal-ref.</p>' +
                            '</div>' +
                            '<div class="tab-pane" id="help-span-em">' +
                              '<p>Asterisks (*) and underscores (_) are treated as emphasis and are wrapped with an &lt;em&gt; tag, which usually displays as italics in most browsers. Double asterisks (**) or double underscores (__) are treated as bold using the &lt;strong&gt; tag. To create italic or bold text, simply wrap your words in single/double asterisks/underscores. For example, **My double emphasis text** becomes My double emphasis text, and *My single emphasis text* becomes My single emphasis text.</p>' +
                            '</div>' +
                            '<div class="tab-pane" id="help-span-code">' +
                              '<p>To create inline spans of code, simply wrap the code in backticks (`). Markdown will turn `myFunction` into myFunction.</p>' +
                            '</div>' +
                            '<div class="tab-pane" id="help-span-image">' +
                              '<p>Markdown image syntax looks a lot like the syntax for links; it is essentially the same syntax preceded by an exclamation point (!). For example, if you want to link to an image at http://github.com/unicorn.png with the alternate text My Unicorn, you would write ![My Unicorn](http://github.com/unicorn.png).</p>' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                      '<div class="tab-pane" id="help-misc">' +
                        '<div class="tabbable tabs-left">' +
                          '<ul class="nav nav-tabs">' +
                            '<li class="active"><a href="#help-misc-link" data-toggle="tab">Automatic Links</a></li>' +
                            '<li><a href="#help-misc-escape" data-toggle="tab">Escaping</a></li>' +
                          '</ul>' +
                          '<div class="tab-content">' +
                            '<div class="tab-pane active" id="help-misc-link">' +
                              '<p>If you want to create a link that displays the actual URL, markdown allows you to quickly wrap the URL in &lt; and &gt; to do so. For example, the link <a href="http://github.com/akasfei">http://github.com/akasfei</a> is easily produced by writing &lt;http://github.com/akasfei&gt;.</p>'+
                            '</div>' +
                            '<div class="tab-pane" id="help-misc-escape">' +
                              '<p>If you want to use a special Markdown character in your document (such as displaying literal asterisks), you can escape the character with the backslash (\\). Markdown will ignore the character directly after a backslash.</p>' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                '</div>';
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
            var title = editor.siblings('.markditor-toolbar').find('#insert-link-name').val();
            var url = editor.siblings('.markditor-toolbar').find('#insert-link-url').val();
            editor.insertText('['+ title +']('+ url +')', editor.getSelection().start, true);
        },
        'insert_image': function(editor) {
            var title = editor.siblings('.markditor-toolbar').find('#insert-image-alt').val();
            var url = editor.siblings('.markditor-toolbar').find('#insert-image-url').val();
            editor.insertText('!['+ title +']('+ url +')', editor.getSelection().start, true);
        },
        'toggle_help': function(editor) {
            editor.siblings('.markditor-toolbar').find('.markditor-help').slideToggle('500');
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