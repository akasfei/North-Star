// JavaScript Document
$(document).ready(function(e) {
  $('#index-carousel').carousel({interval: 10000});
  
  
  /* Delete archive entry */
  $('.blogsArchive').on('click', '.entry_remove', function(e){
    $(this).siblings('.entry_remove_confirm').fadeIn('fast');
  });
  $('.archive_toolbar').on('click', '.entry_remove', function(e){
    $(this).siblings('.entry_remove_confirm').show('fast');
  });
  $('.archive_toolbar').on('click', '.entry_remove_confirm', function(e){
	var postdata = {'objid':$('section.blogsArchive').attr('data-objid')};
	$.post('/idn/archive/remove', postdata, function(data){
	  if (data.ok){
		window.location.href = '/idn';
	  } else
	    alert(data.err);
	}, 'json');
  });
  $('.blogsArchive').on('click', '.entry_remove_confirm', function(e){
	var $element = $(this).parent();
	$.post('/idn/archive/remove', {'objid': $element.attr('data-objid')}, function(data){
	  if (data.ok){
		$element.slideUp('slow', function(){
		  $element.remove();
		});
	  } else
	    alert(data.err);
	}, 'json');
  });
  
  
  /* Comments */
  $('.comment_access_code_submit').on('click', function(e){
	var code = $('.access_code').val();
    $.post('/idn/access', {'code' : code}, function (data){
	  if (data.ok) {
        $('.comments-authenticate').slideUp('fast', function(){
		  $('.comments-authenticate').remove();
		  $('.new-comment').slideDown('slow');
		});
	  } else
	    alert(data.err);
    }, 'json');
  });
  $('.post_comment').on('click', function(){
	var $comment =  $('.comment_body');
	var comment = {
	  'entryid': $('section.blogsArchive').attr('data-objid'),
	  'comment': $comment.val()
	};
	if (comment.comment.length > 4)
	  $.post('/archive/comment', comment, function(data){
		if (data.ok){
		  $comment.val('');
		  $('.new-comment').before(data.comment);
		} else 
		  alert(data.err);
      }, 'json');
	else
	  $('.comment_body').parent().addClass('error');
  });
  
  $('.comments').on({
    'mouseenter' : function(e){
	  $(this).children('.comment_delete').fadeIn('fast');  
    },
    'mouseleave' : function(e){
      $(this).children('.comment_delete').fadeOut('fast');  
    }
  }, '.comment');
  
  $('.comments').on('click', '.comment_delete', function(e){
	$this = $(this).parent();
	var postdata = {
	  'entryid': $('section.blogsArchive').attr('data-objid'),
	  'id': $this.attr('data-objid')
	};
	$.post('/archive/comment/remove', postdata, function(data){
	  if (data.ok)
	    $this.slideUp('slow', function(){
		  $this.remove();
		});
	  else
	    alert(data.err);
	});
  });
  $('.comment_deleteall').click(function(e) {
	$('.comment_deleteall_confirm').fadeIn('slow');
    $('.comment_deleteall_confirm').click(function(e) {
      $.post('/archive/comment/removeall', {'entrytitle': $('.blogPreview > header >h1').text()}, function(data){
        if (data.ok)
	      $('.comment').slideUp('slow', function(){
		    $('.comment').remove();
		  });
	    else
	      alert(data.err);
	  });
    });
  });
  
  
  /* Profile popup */
  $('.blogsArchive, .profile-articles, .blogPreview, .comment').on('click', '.author-id', function(e){
	var $this = $(this);
	$.post('/idn/profile', {'id': $this.text()}, function(data){
	  if (data.err)
	    alert(data.err)
	  if (data.profile)
	    $this.siblings('.profile-thumbnail').empty().append(data.profile);
	}, 'json');
  });
  
  /* following and unfollowing */
  $('.blogsArchive, .profile-articles, .blogPreview, .profile-header').on('click', '.profile-follow-btn', function(e){
	var $this = $(this);
	if ($this.hasClass('disabled'))
	  return;
	var postdata = {'followID': $this.parent().siblings('.profile-head').find('.profile-id h4').text()}
	$.post('/idn/contact/follow', postdata, function(data){
	  if (data.err)
	    alert(data.err);
	  if (data.ok)
	    $this.addClass('disabled');
	}, 'json');
  });
  $('.blogsArchive, .profile-articles, .blogPreview, .profile-header').on('click', '.profile-unfollow-btn', function(e){
	var $this = $(this);
	if ($this.hasClass('disabled'))
	  return;
	var postdata = {'followID': $this.parent().siblings('.profile-head').find('.profile-id h4').text()}
	$.post('/idn/contact/unfollow', postdata, function(data){
	  if (data.err)
	    alert(data.err);
	  if (data.ok)
	    $this.addClass('disabled');
	}, 'json');
  });
});

var inputCheck_access = function(access) {
  if (access.id.length < 4) {
    return 'Access ID too short.';
  }
  if (access.code.length < 8) {
    return 'Access code too short.';
  }
  if (access.accesslevel > 10 || access.accesslevel < 0 || isNaN(access.accesslevel)) {
    return 'Invalid access level.';
  }
  if (access.accesslevel > 10 || access.accesslevel < 0 || isNaN(access.accesslevel)) {
    return 'Invalid modify level.';
  }
  return null;
}

$.alert = function(msg){
  $element = $('#alertModal');
  $element.children('.modal-body').empty().append('<p>' + msg + '</p>');
  $element.modal('show');
}