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
        window.location.reload();
      } else {
        alert(data.err);
        $this.button('reset');
        $('#access_code').parent().addClass('error');
      }
    }, 'json');
  });

  $('#register-btn').click(function(e) {
    $('#form-signup').slideDown('slow');
  });

  $('.register_submit').click(function(e) {
    if ($('#new_access_password').val() != $('#new_access_password_rp').val() ){
      $('#new_access_password_rp').parent().addClass('error');
      return alert('Password mismatch.\n两次密码输入不同。');
    }
    var $this = $('.register_submit');
    $this.button('loading');
    var request = {
      'id' : $('#new_access_id').val(),
      'code' : $('#new_access_password').val(),
      'email' : $('#new_access_email').val() 
    }
    if (request.id && request.code && request.email)
    {
      $.post('/idn/access/register', request, function(data){
        if (data.ok)
          $('#form-signup').slideUp('fast', function(){

          });
        else {
          alert(data.err);
          $this.button('reset');
        }
      }, 'json');
    } else {
    $this.button('reset');
      alert('Please fill in the forms correctly.\n请正确填写表单。');
    }
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