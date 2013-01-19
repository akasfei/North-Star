/* 
 *new_blog.js
 *using ajax to upload a new blog
 */

$(document).ready(function(e) {
  $('.loading_info').remove();
  $('#submit').button();
  $('.add_exceptions').click(function(e) {
    $.post('/idn/access/getlist',null,function(data) {
      $('.add_exceptions').siblings('.dropdown-menu').empty();
      $('.add_exceptions').siblings('.dropdown-menu').append(data.content);
      $('.exceptions_menu > li > a').unbind('click');
      $('.exceptions_menu > li > a').click(function(e) {
        $('.accesslevel_div').append('<span class="add-on">' + $(this).text() + '<a href="javascript:0"><i class="icon-remove"></i></a></span>');
        $('.accesslevel_div > .add-on > a').unbind('click');
        $('.accesslevel_div > .add-on > a').click(function(e) {
          $(this).parent().remove();
        });
      });
    }, 'json');
  });
  
  $('.alert').hide();
  $('#editor').ckeditor({
    skin:'kama'
  });
  $('.submit').click(function(e) {
    var contentdata = CKEDITOR.instances.editor.getData();
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
  var $toggle = $('.submit').parent().parent().siblings('.dropdown-toggle');
  $toggle.button('loading');
    $.post('/idn/archive/edit',postdata,function(data, stats) {
      $toggle.button('reset');
    if (data.ok){
        window.location.href = '/archive/' + data.title;
      } else {
        $('.alert').show();
        $('#alert_head').text('Posting Failed.');
        $('#alert_info').text(data.err);
      }
    }, 'json');
  });
});