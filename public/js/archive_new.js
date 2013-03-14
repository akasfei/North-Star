/* 
 *new_blog.js
 *using ajax to upload a new blog
 */

$(document).ready(function(e) {
  $('.loading_info').remove();
  $('#new_blog_submit').button();
  $('.add_exceptions').click(function(e) {
    $.post('/idn/access/getlist',null,function(data) {
      $('.add_exceptions').siblings('.dropdown-menu').empty();
      $('.add_exceptions').siblings('.dropdown-menu').append(data.content);
      $('.exceptions_menu > li > a').unbind('click');
      $('.exceptions_menu > li > a').click(function(e) {
        $('.accesslevel_div').append('<span class="add-on exception">' + $(this).text() + '<a href="javascript:0"><i class="icon-remove"></i></a></span>');
        $('.accesslevel_div > .add-on > a').unbind('click');
        $('.accesslevel_div > .add-on > a').click(function(e) {
          $(this).parent().remove();
        });
      });
    }, 'json');
  });
  
  
  $('.alert').hide();
  $('#editor').ckeditor({

  });
  $('#editor-md').markditor();
  $('#editor-toggle-md').click(function (e){
    if ($(this).hasClass('active'))
      return;
    $(this).button('toggle');
    $('#editor-md').show();
    var md = toMD(CKEDITOR.instances.editor.getData() );
    $('.markditor-content').val(md);
    $('.ckeditor-container').hide();
  });

  $('#editor-toggle-html').click(function (e){
    if ($(this).hasClass('active'))
      return;
    $(this).button('toggle');
    $('.ckeditor-container').show();
    CKEDITOR.instances.editor.setData(toHTML($('.markditor-content').val() ) );
    $('#editor-md').hide();
  });


  $('.new_blog_submit').click(function(e) {
    var contentdata;
    if ($('#editor').hasClass('active'))
      contentdata = CKEDITOR.instances.editor.getData();
    else
      contentdata = toHTML($('.markditor-content').val());
    var _this = $(this);
    var exceptions = [];
    var tags = $('#tags').val().split(',');
    var exceptions_span = $('.exception');
    for (var i=0; i < exceptions_span.length; i++)
      exceptions.push(exceptions_span[i].innerText);
    var postdata = {
      'entrytitle' : $('#entrytitle').val(),
      'abstract' : $('#abstract').val(),
      'content' : contentdata,
      'accesslevel' : parseInt($('#accesslevel').val()),
    'exceptions' : exceptions,
    'language' : _this.attr('data-lang'),
    'tags': tags,
      'time' : new Date()
    }
    $('.alert').alert();
    if (postdata.entrytitle.length < 4) {
      $('.alert').show();
      $('#alert_head').text('This article is not ready for posting.');
      $('#alert_info').text('The title is too short.');
      return;
    }
    if (postdata.abstract.length< 8) {
      $('.alert').show();
      $('#alert_head').text('This article is not ready for posting.');
      $('#alert_info').text('The abstract is too short.');
      return;
    }
    if (postdata.content.length < 16) {
      $('.alert').show();
      $('#alert_head').text('This article is not ready for posting.');
      $('#alert_info').text('The content is too short.');
      return;
    }
    if (postdata.accesslevel > 10 || postdata.accesslevel < 0 || isNaN(postdata.accesslevel)) {
      $('.alert').show();
      $('#alert_head').text('This article is not ready for posting.');
      $('#alert_info').text('Invalid access level.');
      return;
    }
  var $toggle = $('.new_blog_submit').parent().parent().siblings('.dropdown-toggle');
  $toggle.button('loading');
    $.post('/idn/archive/new',postdata,function(data, stats) {
      $toggle.button('reset');
      if (data.ok){
        window.location.href = '/archive/' + data.title;
      } else {
        $('.alert').show();
        $('#alert_head').text('Posting Failed.');
        $('#alert_info').text(data.error);
      }
    }, 'json');
  });
});

var converter = new Showdown.converter();
var toHTML = function(markdown) {
  return converter.makeHtml(markdown).replace(/id\=\".+\"/, '');
}

var toMD = function(content){
  var html = content.split("\n").map($.trim).filter(function(line) { 
      return line != "";
    }).join("\n");
    return toMarkdown(html);
}