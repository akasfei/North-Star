/*
 * Profile image selection
 */
 
$(document).ready(function(e) {
  $('.container').on('click','.profile-img-select', function(e){
  var $this = $(this).parentsUntil('.thumbnails', '.profile-img-display');
  var postdata = {src: $this.attr('data-src')};
  $.post('/idn/profile/edit/imgselect', postdata, function(data){
    if (data.err)
      alert(data.err);
    if (data.ok)
      window.location.href = '/idn/profile';
  }, 'json');
  });
});