/*
 * request.js
 * ajax clearance request submit functions
 */
$(document).ready(function(e) {
  $('.request_submit').click(function(e) {
	var $this = $('.request_submit');
	$this.button('loading');
    var request = {
      'id' : $('#new_access_id').val(),
      'note' : $('#new_access_note').val(),
      'email' : $('#new_access_email').val() 
    }
    if (request.id && request.note && request.email)
    {
      $.post('/idn/access/request', request, function(data){
        window.location.href = '/idn/access/request/success';
      }, 'json');
    } else {
    $this.button('reset');
      alert('Please fill in the forms correctly.');
    }
  });
});