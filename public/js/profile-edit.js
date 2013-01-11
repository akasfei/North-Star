/*
 * profile_edit.js
 */
$(document).ready(function(e) {
  $('#profile_dob').datepicker({
    format: 'yyyy-mm-dd'
  });
  $('.profile_submit').click(function(e) {
    var postdata = {
	  gender: $('input[name="profile_gender"]:checked').val(),
	  dob: $('#profile_dob').val(),
	  location: $('#profile_location').val(),
	  blog: $('#profile_blog_addr').val(),
	  email: $('#profile_email').val(),
	  intro: $('#profile_intro').val()
	}
	$.post('/idn/profile/edit', postdata, function(data){
	  if (data.err)
	    alert(data.err);
	  else
	    window.location.href = '/idn/profile'
	},'json');
  });
});