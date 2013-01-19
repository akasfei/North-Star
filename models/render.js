/*
 * Class Renderer()
 * takes parameters and renders HTML string
 *
 * Constructor 
 * ===========
 *
 * function Renderer(lang)
 *   creates a renderer instance using lang as language
 *
 * Properties
 * ==========
 *
 * lang - the language this renderer uses
 * accept_language - the array of languages that is acceptable
 * 
 * Methods
 * =======
 *
 * setLang(lang) - set the renderer's language
 *
 * getView() - get the path prefix of the language's view models
 *
 * nav_dropdown_li(accessid, level) 
 *  - render the dropdown at the top right corner of nav bar.
 *
 * nav_extend(params) - render additional IDN nav bar items
 *
 * article_entry(entry, enable_edit) - render an entry of a blog article
 *
 * article_entry_thumbnail(entry, enable_edit) - render a thumbnail of an entry of a blog article
 *
 * access_entry(entry) - render an entry of an access
 *
 * access_request_entry(entry) - render an entry of an access request
 *
 * buttons_admin() - render several administraor buttons
 *
 * no_entry_found() - render the sentence 'no entries were found'
 *
 * dropdown_li(text) - render a dropdown item
 *
 * label(text) - render a span with class .label
 *
 * article_log(log) - render a blog entry
 *
 * checkbox_wlabel(text) - render a checkbox with a label
 *
 */

var render_nav_dropdown_li = function( accessid, level ){
  var logout = '<li class="access_logout"><a href="/idn/logout">'+ this.locale.Terminate_Connection+'</a></li>';
  if (accessid == 'NA') {
    accessid = this.locale.Not_Authenticated;
    logout = '';
  }
  return '<li><a href="/idn" class="access_id">' + accessid +'</a></li>' + logout;
}

var render_nav_extend = function(params){
  var render_export = '';
  if (! params['no_profile'])
    render_export += '<li><a href="/idn/profile">' + this.locale.profile + '</a></li>';
  if (params['render_archive'])
    render_export += '<li><a href="/idn/archive">' + this.locale.Archive + '</a></li>';
  if (params['render_manage'])
    render_export += '<li><a href="/idn/access/manage">'+this.locale.Manage_accesses+'</a></li>';
  return render_export;
}

var render_article_entry = function (entry, enable_edit){
  var title = entry.entrytitle,
      time = entry.time,
      abstract = entry.abstract,
      accesslevel = entry.accesslevel,
    tags = '';
  if (entry.tags){
  for (var i = 0; i<entry.tags.length; i++)
    tags += this.label(entry.tags[i]);
  }
  var edit_buttons = '';
  if (enable_edit)
    edit_buttons = this.buttons_edit(title);
  return ('<article class="blogPreview entry_article '+ entry.language +'" data-objid="' + entry._id +'"><header>' + 
    '<span class="label label-inverse pull-right">'+ this.locale.Access_level + accesslevel + '</span>' +
    '<h2><a href="/archive/' + title + '">' + title + '</a> ' + tags + '</h2>' + 
  '<div class="btn-group"><a class="btn btn-link author-id dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)"><i class="icon-user"></i>' + entry.author + '</a><div class="dropdown-menu profile-thumbnail"><img src="/img/squareajax_30.gif" alt="Loading" ></div></div>' +
    '<h6>' + 
      this.locale.Time_Stamp+': 0x' + require('./misc').getTimeStamp(time) + 
    '</h6>' +
    '<h5>' + 
      abstract +
    '</h5>' +
  '</header>' +
  '<h6>'+this.locale.Edited_on + time + '</h6>' +
  edit_buttons +
  '</article>');
}
var render_article_entry_thumbnail = function (entry, enable_edit){
  var title = entry.entrytitle,
      time = entry.time,
      abstract = entry.abstract,
      accesslevel = entry.accesslevel,
    tags = '';
  if (entry.tags){
  for (var i = 0; i<entry.tags.length; i++)
    tags += this.label(entry.tags[i]);
  }
  var edit_buttons = '';
  if (enable_edit)
    edit_buttons = this.buttons_edit(title);
  return ('<li class="span4 entry_thumbnail"><div class="thumbnail '+ entry.language +'" data-objid="' + entry._id +'"><header>' + 
    '<h2><a href="/archive/' + title + '">' + title + '</a> ' + tags+ '</h2>' +
  '<div class="btn-group"><a class="btn btn-link author-id dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)"><i class="icon-user"></i>' + entry.author + '</a><div class="dropdown-menu profile-thumbnail"><img src="/img/squareajax_30.gif" alt="loading" ></div></div>' +
  '<span class="label label-inverse pull-right">'+ this.locale.Access_level + accesslevel + '</span>' +
    '<h6>' + 
      this.locale.Time_Stamp+': 0x' + require('./misc').getTimeStamp(time) + 
    '</h6>' +
    '<h5>' + 
      abstract +
    '</h5>' +
  '</header>' +
  '<h6>'+this.locale.Edited_on + time + '</h6>' +
  edit_buttons +
  '</div></li>');
}

var render_access_entry = function (entry){
  var id = entry.id,
      level = entry.clearance.level,
    m_level = entry.clearance.modifylevel,
    admin = entry.clearance.admin;
  var level_select = '<select class="span1 access_level">', i = 0;
  var mlevel_select = '<select class="span1 access_mlevel">';
  var checked = '';
  if (admin)
  checked = 'checked="checked"';
  for (i=0;i<10;i++){
    if (i == level)
      level_select += '<option value="' + i + '" selected="selected">' + i + '</option>';
    else
      level_select += '<option value="' + i + '">' + i + '</option>';
  }
  level_select += '</select>';
  for (i=0;i<10;i++){
    if (i == m_level)
      mlevel_select += '<option value="' + i + '" selected="selected">' + i + '</option>';
    else
      mlevel_select += '<option value="' + i + '">' + i + '</option>';
  }
  mlevel_select += '</select>';
  return (
  '<article class="accessEntry" data-objid="'+ entry._id +'">' +
    '<header>' +
      '<h2>'+this.locale.Access_ID+': <span class="access_id">' + id + '</span></h2>' +
    '<p>'+ entry._id +'</p>' +
      '<h5><span class="span2">'+this.locale.Access_level+': </span>' + level_select + '</h5>' +
      '<h5><span class="span2">'+this.locale.Modify_level+': </span>' + mlevel_select + '</h5>' +
    '<p><span class="span2">'+this.locale.Administrator+' </span><input class="access_admin" type="checkbox"' + checked + '></p>' +
    '<a href="javascript:void(0)" class="btn btn-small disabled access_save"><i class="icon-ok"></i>'+this.locale.Save+'</a> <a href="javascript:void(0)" class="btn btn-danger btn-small access_delete"><i class="icon-remove icon-white"></i>'+this.locale.Delete+'</a>' +
    '</header>' +
  '</article>');
}

var render_access_request_entry = function (entry){
  var id = entry.id,
      objid = entry._id,
      note = entry.note, 
    email = entry.email, 
    time = entry.time;
  return (
  '<article class="accessEntry" data-objid="' + objid + '" data-id="'+ id +'">' +
    '<header>' +
      '<h2>'+this.locale.Request_ID+': <span>' + id + '</span></h2>' +
    '<p>' + objid + '</p>' +
      '<h5>'+this.locale.Request_email+': ' + email + '</h5>' +
      '<p>'+this.locale.Request_note+': ' + note + '</p>' +
      '<h6>'+this.locale.Sent_time+': ' + time + '</h6>' +
    '</header>' +
    '<a href="#" class="btn btn-danger access_manage_grant" data-loading-text="' + this.locale.Connecting +'"><i class="icon-ok icon-white"></i>'+this.locale.Grant_access+'</a><a href="#" class="btn access_manage_deny" data-loading-text="' + this.locale.Connecting +'"><i class="icon-remove "></i>'+this.locale.Deny_access+'</a>' +
  '</article>'
  );
}

var render_buttons_admin = function (){
  return ('<a href="/idn/access/manage" class="btn btn-warning">'+this.locale.Access_management+'</a> ' +
    '<a href="/idn/log" class="btn btn-inverse">'+this.locale.View_log+'</a> '
  );
}

var render_no_entry_found = function(){
  return '<p>' + this.locale.No_entry_found + '</p>';  
}

var render_dropdown_li = function(text){
  return '<li><a href="javascript:void(0)">' + text + '</a></li>';
}

var render_label = function(text){
  return '<span class="label">' + text + '</span> ';
}

var render_label_right = function(text){
  return '<span class="label pull-right">' + text + '</span> ';
}

var render_checkbox_wlabel = function(text) {
  return '<label class="checkbox inline span2"><input type="checkbox" class="tags_checkbox" value="'+ text +'">'+ text +'</label>';
}

var render_invalid_code = function(){
  return this.locale.Invalid_code;
}

var render_user_info = function(access){
  var buttons_admin = access.clearance.admin ? this.buttons_admin():'';
  return (
  '<h2>' + this.locale.Welcome_back + access.id + '</h2>'+
    '<p>' + this.locale.Your_access_level + access.clearance.level +'</p>'+
    '<p>'+
    '<a href="/idn/archive" class="btn btn-info"> View archive </a> '+
    '<a href="/idn/contacts" class="btn"> My Contacts </a> '+
    buttons_admin + 
  '</p>');
}

var render_article_log = function(log){
  var type = log.type,
      tag = log.tag,
    user = log.user,
    desc = log.desc,
    time = log.time;
  return (
  '<article class="logEntry '+ this.lang +'">' +
      '<h5><span class="label label-inverse">'+ type +'</span> <span class="label">' + tag + '</span></h5>' +
    '<p>' + desc + '</p>' +
      '<h6>'+user+' @' + time + '</h6>' +
  '</article>'
  );
}



var render_buttons_edit = function(title){
  return ('<a href="/idn/archive/edit?t=' + title + '" class="btn"><i class="icon-edit"></i>'+this.locale.Modify+'</a> <a href="javascript:void(0)" class="btn btn-danger entry_remove"><i class="icon-remove icon-white"></i>'+this.locale.Delete+'</a> <a href="javascript:void(0)" class="btn btn-danger entry_remove_confirm" style="display:none"><i class="icon-warning-sign icon-white"></i>' + this.locale.Confirm +'</a>');
}

var render_comment = function(comment, access){
  var data_objid = '',
      button_delete = '';
  if (comment.id)
    data_objid = ' data-objid="' + comment.id + '"';
  if (access && (comment.accessid == access.id || access.clearance.admin))
    button_delete = '<a href="javascript:void(0)" class="btn btn-small btn-danger pull-right comment_delete" style="display:none;">' + this.locale.Delete + '</a>'
  return (
    '<article class="comment" data-asscessid="' + comment.accessid + '"'+ data_objid +'>' +
    button_delete +
    '<div class="btn-group"><a class="btn btn-link author-id dropdown-toggle" data-toggle="dropdown" href="javascript:void(0)"><i class="icon-user"></i>' + comment.accessid + '</a><div class="dropdown-menu profile-thumbnail"><img src="/img/squareajax_30.gif" alt="Loading" ></div></div>' +
    '<p>' + comment.body + '</p>' +
    '<h6>' + comment.time + '</h6>' +
  '</article>'
  );
}

var render_comment_new = function(access){
  var button_removeall = '';
  if (access) {
    if (access.clearance.admin)
    button_removeall = '<a href="javascript:void(0)" class="btn btn-danger comment_deleteall"><i class="icon-remove icon-white"></i> Delete All </a> <a href="javascript:void(0)" class="btn btn-danger comment_deleteall_confirm" style="display:none"><i class="icon-warning-sign icon-white"></i> Confirm </a>';
  return ('<article class="new-comment">' +
    '<p><span class="label">'+this.locale.New_Comment+'</span></p>' +
    '<textarea class="span10 clearfix comment_body" placeholder="'+this.locale.Post_a_comment+'.."></textarea> ' +
    '<a href="javascript:void(0)" class="btn btn-success post_comment"><i class="icon-comment-alt icon-white"></i> '+this.locale.Comment+' </a>' +
  button_removeall +
  '</article>');
  } else
  return ('<article class="new-comment" style="display:none;">' +
    '<p><span class="label">'+this.locale.New_Comment+'</span></p>' +
    '<textarea class="span10 clearfix comment_body" placeholder="'+this.locale.Post_a_comment+'.."></textarea> ' +
    '<a href="javascript:void(0)" class="btn btn-success post_comment"><i class="icon-comment-alt icon-white"></i> '+this.locale.Comment+' </a>' +
  '</article>'+ 
  '<article class="comments-authenticate">' +
    '<p><span class="label label-inverse">'+this.locale.Not_Authenticated+'</span></p>' +
    '<div class="input-append">' +
      '<input class="span3 access_code" type="password" name="access_code" id="access_code" placeholder="'+this.locale.Access_Code+':"> ' +
      '<a href="javascript:void(0)" class="btn btn-inverse comment_access_code_submit">'+this.locale.Authenticate+'</a>' +
    '</div>' +
  '</article>');
}

var render_profile_extend = function(myself, following){
  if (myself)
    return ('<span><a href="/idn/profile/edit" class="btn">'+this.locale.Edit_profile+'</a> <a href="/idn/profile/edit/imgselect" class="btn">'+this.locale.Change_profile_image+'</a></span>');
  if (following)
    return ('<span><a href="javascript:void(0)" class="btn btn-success disabled"><i class="icon-ok icon-white"></i>'+this.locale.following+'</a> <a href="javascript:void(0)" class="btn btn-danger profile-follow-btn"><i class="icon-remove icon-white"></i>'+this.locale.removefollow+'</a></span>');
  else
    return ('<span><a href="javascript:void(0)" class="btn btn-success profile-follow-btn">'+this.locale.follow+'</a></span>');
}

var render_profile_desc = function(access){
  var output = '<span class="label">'+ this.locale.Access_ID +'</span>' + '<div class="control-group"><div class="controls"><h2>' + access.id + '</h2></div></div>' + '<span class="label">'+ this.locale.desc +'</span>';
  var layout = '<div class="control-group">',
    label = '<div class="control-label">',
    property = '<div class="controls">',
    property_ = label_ = layout_ = '</div>';
  if (access.desc){
  var profile = access.desc;
  if (profile.gender)
    output += layout + label + this.locale.gender + label_ + property + profile.gender + property_ + layout_;
  if (profile.dob)
    output += layout + label + this.locale.Date_of_birth + label_ + property + profile.dob + property_ + layout_;
  if (profile.location)
    output += layout + label + this.locale.location + label_ + property + profile.location + property_ + layout_;
  if (profile.blog)
    output += layout + label + this.locale.Blog_addr + label_ + property + profile.blog + property_ + layout_;
  if (profile.email)
    output += layout + label + this.locale.email + label_ + property + profile.email + property_ + layout_;
  if (profile.intro)
    output += layout + label + this.locale.intro + label_ + property + profile.intro + property_ + layout_;
  return output;
  } else
    return (output + layout+ property + this.locale.No_profile_desc + property_ + layout_);
}

var render_profile_thumbnail = function(access, req){
  var follow_btn = '';
  if (req && req.session.access){
  if (req.session.access.id == access.id)
    follow_btn = '<a href="javascript:void(0)" class="btn btn-small btn-success profile-follow-btn disabled">'+this.locale.follow+'</a>';
  else if (req.session.access.follows){
    for (var i=0; i<req.session.access.follows.length; i++){
    if (req.session.access.follows[i] == access.id){
      follow_btn = '<a href="javascript:void(0)" class="btn btn-small btn-success disabled"><i class="icon-ok icon-white"></i>'+this.locale.following+'</a> <a href="javascript:void(0)" class="btn btn-small btn-danger profile-unfollow-btn"><i class="icon-remove icon-white"></i>'+this.locale.removefollow+'</a>';
      break;
    }
    }
  }
  if (follow_btn == '')
    follow_btn = '<a href="javascript:void(0)" class="btn btn-small btn-success profile-follow-btn">'+this.locale.follow+'</a>';
  }
  return ('<div class="profile-head">' +
  '<a class="pull-left" href="/idn/profile/' + access.id +'">' + '<img src="/assets/profileimg_thumb/' + (access.profileimg ? access.profileimg: 'Monochrome.jpg') + '"></a>' +
  '<div class="profile-id">' + 
    '<h4><a href="/idn/profile/' + access.id +'">' + access.id + '</a></h4>' +
    '<span class="label label-inverse">'+ this.locale.Access_level + access.clearance.level + '</span>' +
  '</div>' +
  '</div>' +
  '<div class="profile-intro">' +
  '<p>' + (access.desc ? (access.desc.intro ? access.desc.intro : this.locale.No_profile_desc) : this.locale.No_profile_desc) + '</p>' +
  '</div>' + '<div class="profile-follow">' +
    follow_btn +
  '</div>');
}

var render_profile_not_found = function(){
  return ('<div class="profile-intro">' +
  '<p class="text-error">' + this.locale.Profile_not_found + '</p>' +
  '</div>');
}

var render_profile_article = function(access, req){
  var follow_btn = '';
  if (req && req.session.access){
  if (req.session.access.id == access.id)
    follow_btn = '<a href="javascript:void(0)" class="btn btn-small btn-success profile-follow-btn disabled">'+this.locale.follow+'</a>';
  else if (req.session.access.follows){
    for (var i=0; i<req.session.access.follows.length; i++){
    if (req.session.access.follows[i] == access.id){
      follow_btn = '<a href="javascript:void(0)" class="btn btn-small btn-success disabled"><i class="icon-ok icon-white"></i>'+this.locale.following+'</a> <a href="javascript:void(0)" class="btn btn-small btn-danger profile-unfollow-btn"><i class="icon-remove icon-white"></i>'+this.locale.removefollow+'</a>';
      break;
    }
    }
  }
  if (follow_btn == '')
    follow_btn = '<a href="javascript:void(0)" class="btn btn-small btn-success profile-follow-btn">'+this.locale.follow+'</a>';
  }
  return ('<article class="profile-article"><div class="profile-head">' +
  '<a class="pull-left" href="/idn/profile/' + access.id +'">' + '<img class="img-polaroid" src="/assets/profileimg/' + (access.profileimg ? access.profileimg: 'Monochrome.jpg') + '"></a>' +
  '<div class="profile-id">' + 
    '<h2><a href="/idn/profile/' + access.id +'">' + access.id + '</a></h2>' +
    '<span class="label label-inverse">'+ this.locale.Access_level + access.clearance.level + '</span>' +
  '</div>' +
  '</div>' +
  '<div class="profile-intro">' +
  '<p>' + (access.desc ? (access.desc.intro ? access.desc.intro : this.locale.No_profile_desc) : this.locale.No_profile_desc) + '</p>' +
  '</div>' + '<div class="profile-follow">' +
    follow_btn +
  '</div></article>');
}

var setLang = function(lang) {
  this.lang = lang;  
  switch (lang){
  case 'en':
  {
    this.locale = require('./localization').en;
    this.lang = 'en';
    break;
  }
  case 'zh':
  default:
  {
    this.locale = require('./localization').zh;
    this.lang = 'zh';
    break;
  }
  }
}

var getLang = function (req, renderer){
  if (req.query.lang){
  renderer.setLang(req.query.lang);
  req.session.lang = renderer.lang;
  } else {
    if (req.session.lang){
    renderer.setLang(req.session.lang);
    } else {
    var accept_language = req.headers['accept-language'].split(',');
    for (var lang in accept_language){
    renderer.setLang(lang.substring(0,1));
    if (renderer.lang == lang.substring(0,1)) {
      req.session.lang = renderer.lang;
      return renderer.lang + '/'; 
    }
    }
  }
  }
  return renderer.lang + '/';
}

function Renderer(lang){
  this.lang = lang;
  this.accept_language = ['en','zh'];
  setLang();
  this.setLang = setLang;
  this.getView = function() {
  return this.lang + '/';  
  }
  this.render = function (callback){
  return callback;
  };
  this.nav_dropdown_li = render_nav_dropdown_li;
  this.nav_extend = render_nav_extend;
  this.article_entry = render_article_entry;
  this.article_entry_thumbnail = render_article_entry_thumbnail;
  this.access_entry = render_access_entry;
  this.access_request_entry = render_access_request_entry;
  this.buttons_admin = render_buttons_admin;
  this.no_entry_found = render_no_entry_found;
  this.dropdown_li = render_dropdown_li;
  this.label = render_label;
  this.label_right = render_label_right;
  this.article_log = render_article_log;
  this.checkbox_wlabel = render_checkbox_wlabel;
  this.invalid_code = render_invalid_code;
  this.user_info = render_user_info;
  this.buttons_edit = render_buttons_edit;
  this.comment = render_comment;
  this.comment_new = render_comment_new;
  this.profile_extend = render_profile_extend;
  this.profile_desc = render_profile_desc;
  this.profile_thumbnail = render_profile_thumbnail;
  this.profile_not_found = render_profile_not_found;
  this.profile_article = render_profile_article;
};

module.exports = Renderer;