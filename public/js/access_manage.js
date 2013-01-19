/*
 * access_manage.js
 * manage access information using ajax
 */
$(document).ready(function(e) {
  var $this;
  
  $('#existing_li').click(function(e) {
    $.post('/idn/access/manage/getexisting', null, function(data){
    $('#manage').html(data.content);
    $('select, input').unbind('focus');
    $('select, input').focus(function(e) {
    var $thisArticle = $(this).parent().parent().parent();
    if ( $thisArticle.attr('data-edited') != 'true') {
      $thisArticle.find('.access_save').removeClass('disabled');
      $thisArticle.attr('data-edited', true);
      $('.access_save').unbind('click');
      $('.access_save').click(function(e) {
      var $this = $(this)
      var postdata = {
        '_id' : $thisArticle.attr('data-objid'),
        'level' : $thisArticle.find('.access_level').val(),
        'mlevel' : $thisArticle.find('.access_mlevel').val(),
        'admin' : $thisArticle.find('.access_admin').is(':checked')
      }
      $.post('/idn/access/manage', postdata, function(data){
        $thisArticle.attr('data-edited', false);
        $this.addClass('disabled');
      }, 'json');
      });
    }
    });
    
    $('.access_delete').click(function(e) {
    $('#formModal > .modal-body > div').hide();
    $('#formModal > .modal-body > .access_delete_confirm').show();
    $('#formModal').modal('show');
    $('.modal_confirm').unbind('click');
    var $thisArticle = $(this).parent().parent();
    $('.modal_confirm').click(function(e) {
      var postdata = {
      '_id' : $thisArticle.attr('data-objid')
      }
      $.post('/idn/access/manage/remove', postdata, function(data) {
      $('.modal_confirm').button('reset');
      $('#formModal').modal('hide');
      $thisArticle.slideUp('slow', function(){
        $thisArticle.remove();
        $thisArticle = null;
      });
      }, 'json');
    });
    });
    $('#existing_li').tab('show');
  }, 'json');
  });
  
  $('select, input').focus(function(e) {
  var $thisArticle = $(this).parent().parent().parent();
  if ( $thisArticle.attr('data-edited') != 'true') {
    $thisArticle.find('.access_save').removeClass('disabled');
    $thisArticle.attr('data-edited', true);
    $('.access_save').unbind('click');
    $('.access_save').click(function(e) {
    var $this = $(this)
    var postdata = {
      '_id' : $thisArticle.attr('data-objid'),
      'level' : $thisArticle.find('.access_level').val(),
      'mlevel' : $thisArticle.find('.access_mlevel').val(),
      'admin' : $thisArticle.find('.access_admin').is(':checked')
    }
    $.post('/idn/access/manage', postdata, function(data){
      $thisArticle.attr('data-edited', false);
      $this.addClass('disabled');
    }, 'json');
    });
  }
  });
  
  $('.access_delete').click(function(e) {
    $('#formModal > .modal-body > div').hide();
    $('#formModal > .modal-body > .access_delete_confirm').show();
    $('#formModal').modal('show');
    $('.modal_confirm').unbind('click');
    var $thisArticle = $(this).parent().parent();
    $('.modal_confirm').click(function(e) {
      var postdata = {
        '_id' : $thisArticle.attr('data-objid')
      }
      $.post('/idn/access/manage/remove', postdata, function(data) {
        $('.modal_confirm').button('reset');
        $('#formModal').modal('hide');
    $thisArticle.slideUp('slow', function(){
      $thisArticle.remove();
          $thisArticle = null;
    });
      }, 'json');
    });
  });
  
  $('#requests_li').click(function(e) {
    $.post('/idn/access/manage/getrequest', null, function(data){
    $('#requests').html(data.content);
    $('.access_manage_grant').unbind('click');
    $('.access_manage_grant').click(function(e) {
    var $thisArticle = $(this).parent();
        $('#formModal > .modal-body > div').hide();
        $('#formModal > .modal-body > .request_grant').show();
        $('#formModal > .modal-body > .request_grant > #new_access_id').val($thisArticle.attr('data-id'));
        $('#formModal').modal('show');
        $('.modal_confirm').unbind('click');
        $('.modal_confirm').click(function(e) {
          var data = {
            'id' : $('.request_grant #new_access_id').val(),
      'objid' : $thisArticle.attr('data-objid'),
            'code' : $('.request_grant #new_access_code').val(),
            'accesslevel' : $('.request_grant #new_access_level').val(),
            'modifylevel' : $('.request_grant #new_access_mlevel').val(),
            'grant' : true
          }
          var check;
          if (check = inputCheck_access(data)) {
            $('#alert_info').text(check);
            $('.alert').show();
            return;
          }
          $.post('/idn/access/manage/request', data, function(data) {
            $('.modal_confirm').button('reset');
            $('#formModal').modal('hide');
      $thisArticle.slideUp('slow', function(){
        $thisArticle.remove();
              $thisArticle = null;
      });
          }, 'json');
        });
      });
    $('.access_manage_deny').unbind('click');
      $('.access_manage_deny').click(function(e) {
        $('#formModal > .modal-body > div').hide();
        $('#formModal > .modal-body > .request_deny').show();
        $('#formModal').modal('show');
        $('.modal_confirm').unbind('click');
        var $thisArticle = $(this).parent();
        $('.modal_confirm').click(function(e) {
          $('#formModal').modal('hide');
          var data = {
      'objid' : $thisArticle.attr('data-objid'),
            'grant' : false
          }
          $.post('/idn/access/manage/request', data, function(data) {
            $('.modal_confirm').button('reset');
            $('#formModal').modal('hide');
            $thisArticle.slideUp('slow', function(){
        $thisArticle.remove();
              $thisArticle = null;
      });
          }, 'json');
        });
      });
    $('#requests_li').tab('show');
  }, 'json');
  });
  
  $('.new_access_submit').click(function(e) {
  var $this = $('.new_access_submit')
  $this.button('loading');
  var data = {
    'id' : $('#newaccess #new_access_id').val(),
    'code' : $('#newaccess #new_access_code').val(),
    'accesslevel' : $('#newaccess #new_access_level').val(),
    'modifylevel' : $('#newaccess #new_access_mlevel').val(),
  }
  var check;
  if (check = inputCheck_access(data)) {
    alert(check);
    $this.parent().addClass('error');
    return;
  }
  $.post('/idn/access/manage/new', data, function(data) {
    $this.button('reset');
    if (data.ok){
    $this.parent().removeClass('error');
    $('#newaccess input').val('');
    } else {
    $this.parent().addClass('error');
    alert(data.err);
    }
  }, 'json');
  });
});