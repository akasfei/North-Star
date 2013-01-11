/*
 * Filter actions
 * Gets filter tags and redirects to apply filters
 */
$(document).ready(function(e) {
  $('.get_tags').toggle(function(e) {
    $.post('/idn/archive/gettags',null,function(data) {
      $('.filter_checkboxes > label').remove();
	  var checkbox = '';
	  for (var i=0; i < data.content.length; i++){
		checkbox += '<label class="checkbox inline span2"><input type="checkbox" class="tags_checkbox" value="'+ data.content[i] +'">'+ data.content[i] +'</label>';
	  }
      $('.filter_checkboxes').prepend(checkbox);
	  $('#filters').collapse('show');
    }, 'json');
  },function(e){
	$('#filters').collapse('hide');
  });
  $('.filter_apply').click(function(e) {
	var selected_tags = $('.tags_checkbox:checked').parent();
	var tags = [];
	for (var i=0; i < selected_tags.length; i++) {
	  tags.push(selected_tags[i].innerText);
	}
	if (tags.length > 0){
	  var i = window.location.href.search(/\?/i);
	  if (i>-1)
		window.location.href = window.location.href.substring(0,i) + '?f=' + tags.toString();
	  else
	    window.location.href += '?f=' + tags.toString();
	} else
	  $(this).parent().addClass('error');
  });
  $('.get_tags_dropdown').click(function(e) {
    $.post('/idn/archive/gettags',null,function(data) {
      $('.get_tags_dropdown').siblings('.dropdown-menu').empty();
	  var dropdown = '';
	  for (var i=0; i < data.content.length; i++){
		dropdown += '<li><a href="javascript:0">' + data.content[i] + '</a></li>';
	  }
      $('.get_tags_dropdown').siblings('.dropdown-menu').append(dropdown);
      /*$('.tags_menu > li > a').unbind('click');
      $('.tags_menu > li > a').click(function(e) {
		var value = $('#tags').val();
		if (value)
		  value += ',' + $(this).text();
		else
		  value = $(this).text();
		$('#tags').val(value);
      });*/
	  $('.tags_menu > li > a').on('click', function(e) {
		var value = $('#tags').val();
		if (value)
		  value += ',' + $(this).text();
		else
		  value = $(this).text();
		$('#tags').val(value);
      });
    }, 'json');
  });
});