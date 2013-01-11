/* 
* idn.js
* idn index page functions 
*/
$(document).ready(function(e) {
  $('.access_code_submit').click(function(e) {
    var code = $('.access_code').val(),
	    accessid = $('#access_id').val(),
	    $this = $(this);
    $this.button('loading');
	//$('.loading-placehold').slideDown('fast');
    $.post('/idn/access', {'id': accessid, 'code' : code}, function (data){
	  if (data.ok) {
		$('.authenticate').slideUp('slow', function(){
		  window.location.reload();
		});
	  } else {
	    alert(data.err);
		$this.button('reset');
		$('#access_code').parent().addClass('error');
	  }
    }, 'json');
  });
  
  $('#articles_li').click(function(e) {
	var $this = $(this);
    $.post('/idn/getMyArticles', null, function(data){
      if (data.ok){
		$('.my_recent').empty().append(data.content);
		$this.tab('show');
	  } else
	    alert(data.err);
	}, 'json');
  });
  
  $('#feeds_li').click(function(e) {
	var $this = $(this);
    $.post('/idn/getFeeds', null, function(data){
      if (data.ok){
		$('#feeds').empty().append(data.feeds);
		$this.tab('show');
	  } else
	    alert(data.err);
	}, 'json');
  });
  
  $('#contacts_li').click(function(e) {
	var $this = $(this);
    $.post('/idn/getContacts', null, function(data){
      if (data.ok){
		$('#contacts').empty().append(data.contacts);
		$this.tab('show');
	  } else
	    alert(data.err);
	}, 'json');
  });
});