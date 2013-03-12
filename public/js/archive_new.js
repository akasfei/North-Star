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

  $('.mdeditor').show();
  $('.mdeditor').hallo({
    plugins: {
      'halloformat': {'bold': true, 'italic': true, 'strikeThough': true, 'underline': false},
      'halloheadings': {headers: [1,2,3,4,5,6]},
      'hallolists': {},
      'halloreundo': {}
    },
    toolbar: 'halloToolbarFixed'
  });

  // Update Markdown every time content is modified
  $('.mdeditor').bind('hallomodified', function(event, data) {
    showSource(data.content);
  });
  $('.mdeditor-source').bind('keyup', function() {
    updateHtml(this.value);
  });
  showSource($('.mdeditor').html());

  $('.new_blog_submit').click(function(e) {
    var contentdata = htmlize($('.mdeditor-source').val());
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


var markdownize = function(content) {
  var html = content.split("\n").map($.trim).filter(function(line) { 
    return line != "";
  }).join("\n");
  return toMarkdown(html);
};

var converter = new Showdown.converter();
var htmlize = function(content) {
  return converter.makeHtml(content);
};

// Method that converts the HTML contents to Markdown
var showSource = function(content) {
  var markdown = markdownize(content);
  if ($('.mdeditor-source').get(0).value == markdown) {
    return;
  }
  $('.mdeditor-source').get(0).value = markdown;
};


var updateHtml = function(content) {
  if (markdownize($('.mdeditor').html()) == content) {
    return;
  }
  var html = htmlize(content);
  $('.mdeditor').html(html); 
};

