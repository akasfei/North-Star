/*
 * content fetcher
 * fetch article thumbnails of specific tags
 */
$(document).ready(function(e) {
  $('.blogsArchive.auto-fetch').each(function (index, elem) {
    var $this = $(this);
    $.post('/archive/get', {filter: $this.attr('data-tags')}, function (data){
      if (data.err)
        alert(data.err);
      if (data.content)
        $this.find('.thumbnails').empty().append(data.content);
    }, 'json');
  });
});