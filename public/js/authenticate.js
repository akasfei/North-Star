/* 
*authenticate.js
*ajax authentication functions 
*/
$(document).ready(function(e) {
  $('.access_code_submit').click(function(e) {
    var code = $('.access_code').val();
    $.post('/idn/access', {'code' : code}, function (data){
	  if (data.ok) {
        alert('Authentication Successful.');
        window.location.reload();
	  } else
	    alert('Invalid access code.');
    }, 'json');
  });
});