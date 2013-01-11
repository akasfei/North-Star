/*
 * request.js
 * ajax clearance request submit functions
 */
$(document).ready(function(e) {
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
        window.location.href = '/idn/access/register/success';
      }, 'json');
    } else {
	  $this.button('reset');
      alert('Please fill in the forms correctly.\n请正确填写表单。');
    }
  });
});