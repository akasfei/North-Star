/*
 * Localization
 *
 * An file deciding how renderer should render strings involving languages
 */

exports.en = {
  'Terminate_Connection': 'Terminate Connection',
  'Not_Authenticated': 'Not Authenticated',
  'Archive': 'Archive',
  'Manage_accesses': 'Manage accesses',
  'Modify': 'Modify',
  'Delete': 'Delete',
  'Save': 'Save',
  'Access_level': 'Access level ',
  'Time_Stamp': 'Time Stamp',
  'Edited_on': 'Edited on ',
  'Access_ID': 'Access ID',
  'Modify_level': 'Modify level ',
  'Administrator': 'Administrator',
  'Request_ID': 'Request ID',
  'Request_email': 'Request email',
  'Request_note': 'Request note',
  'Sent_time': 'Sent time ',
  'Grant_access': 'Grant access',
  'Deny_access': 'Deny access',
  'Access_management': 'Access management',
  'No_entry_found': 'No entries were found.',
  'View_log': 'View log',
  'Invalid_code': 'Invalid access code',
  'Welcome_back': 'Welcome back, ',
  'Your_access_level': 'Your access level: ',
  'Confirm': 'Confirm',
  'Access_Code': 'Access Code',
  'Authenticate': 'Authenticate',
  'New_Comment': 'New Comment',
  'Post_a_comment': 'Post a comment',
  'Comment': 'Comment',
  'Connecting': 'Connecting...',
  'Edit_profile': 'Edit profile',
  'Change_profile_image': 'Change profile image',
  'gender': 'Gender',
  'Date_of_birth': 'Date of birth',
  'location': 'Current location',
  'Blog_addr': 'Blog address',
  'intro': 'Introduction',
  'email': 'E-mail',
  'No_profile_desc': 'No profile description.',
  'follow': 'Follow',
  'following': 'Following',
  'removefollow': 'Stop following',
  'desc': 'Description',
  'profile': 'Profile',
  'Profile_not_found': 'Profile not found.',
  'Not_following': 'You are not following this user.',
  'signInToFollow': 'Sign in to follow'
}

exports.zh = {
  'Terminate_Connection': '断开连接',
  'Not_Authenticated': '未认证',
  'Archive': '档案',
  'Manage_accesses': '权限管理',
  'Modify': '修改',
  'Delete': '移除',
  'Save': '保存',
  'Access_level': '访问权限等级',
  'Time_Stamp': '时间戳',
  'Edited_on': '编辑于',
  'Access_ID': '权限标识',
  'Modify_level': '修改权限等级',
  'Administrator': '管理员',
  'Request_ID': '请求标识',
  'Request_email': '请求电子邮箱',
  'Request_note': '附言',
  'Sent_time': '发送时间',
  'Grant_access': '准许访问',
  'Deny_access': '拒绝访问',
  'Access_management': '权限管理',
  'No_entry_found': '未找到相应条目。',
  'View_log': '查看日志',
  'Invalid_code': '无效的访问密码。',
  'Welcome_back': '欢迎回来，',
  'Your_access_level': '您的访问权限等级',
  'Confirm': '确认',
  'Access_Code': '认证密码',
  'Authenticate': '认证',
  'New_Comment' : '发表评论',
  'Post_a_comment': '发表评论',
  'Comment': '评论',
  'Connecting': '连接中…',
  'Edit_profile': '编辑个人档案',
  'Change_profile_image': '修改头像',
  'gender': '性别',
  'Date_of_birth': '出生日期',
  'location': '所在地',
  'Blog_addr': '博客地址',
  'intro': '简介',
  'email': '电子邮箱',
  'No_profile_desc': '没有详细信息。',
  'follow': '关注',
  'following': '已关注',
  'removefollow': '取消关注',
  'desc': '个人资料',
  'profile': '资料',
  'Profile_not_found': '未找到档案条目。',
  'Not_following': '您当前没有关注该用户。',
  'signInToFollow': '认证以关注该用户'
}

exports.setLang = function (req, renderer){
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