/*
 * Security protocols
 *
 * Constructor: function(data)
 *   data = {req: req, res: res, protocols = [] [, operator='AND'/'OR'] [, params = [] ]}
 */
var protocols = {
  'admin': function(req){
  if (req.session.access && req.session.access.clearance.admin.toString() == 'true')
    return true;
  else
    return false;
  },
  'level': function(req, requirement){
  if (req.session.access && req.session.access.clearance.level >= requirement)
    return true;
  else
    return false;
  },
  'mlevel': function(req, requirement){
  if (req.session.access && req.session.access.clearance.modifylevel >= requirement)
    return true;
  else
    return false;
  },
  'authenticated': function(req){
  if (req.session.access)
    return true;
  else
    return false;  
  },
  'idmatch': function(req, requirement){
  if (req.session.access && (req.session.access.accessObjID == requirement || req.session.access.id == requirement))
    return true;
  else
    return false;
  }
}

var renderStatus = function(status, res){
  
}

function Fortress(data){
  if (!(data.req && data.res && data.protocols))
    return false;
  if (typeof data.protocols === 'string'){
  if (protocols[data.protocols]){
    if ( protocols[ data.protocols ](data.req, data.params) )
      return true;
    else 
      return false;
  } else
    return false;
  }
  switch(data.operator){
  case 'AND':
  default:
  {
    for (var i=0; i < data.protocols.length; i++){
    if (protocols[data.protocols[i]]) {
      if (! protocols[ data.protocols[i] ](data.req, data.params ? data.params[i]:null) )
      return false;
    } else
      return false;
    }
    return true;
  }
  case 'OR':
  {
    for (var i=0; i < data.protocols.length; i++){
    if (protocols[data.protocols[i]]) {
      if (protocols[ data.protocols[i] ](data.req, data.params ? data.params[i]:null) )
      return true;
    } else
      return false;
    }
    return false;
  }
  }
}

module.exports = Fortress;

exports.protocols = protocols;