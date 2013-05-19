$(document).ready(function (e){
  $.post('/idn/archive/gettags',null,function(data) {
    $('.admin-tags-management > div').empty();
    var tags = '';
    for (var i=0; i < data.content.length; i++){
      tags += '<span class="tag-manage" data-tagname="'+ data.content[i] +'">'+ data.content[i] +'<a href="javascript:void(0)" class="btn btn-mini tag-remove"><i class="icon-remove"></i></a></span>';
    }
    $('.admin-tags-management > div').prepend(tags);
  }, 'json');

  $('.admin-tags-management').on('click', '.tag-remove', function (e){
    var $span = $(e.target).parent();
    var tagname = $span.attr('data-tagname');
    $.post('/idn/archive/rmtags', {tagname: tagname}, function(data) {
      if (data.err)
        alert(data.err);
      else
        $span.remove();
    });
  });
});