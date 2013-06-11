/*
 * Misc
 */
var convert_decToHex = function (n) {
  var hex = "";
  var i=1;
  for (;i*16<=n;i*=16) ;
  for (;i>=1;n%=i, i/=16)
  {
    switch ( parseInt(n/i) )
    {
      case 10:
        hex += "a";
        break;
      case 11:
        hex += "b";
        break;
      case 12:
        hex += "c";
        break;
      case 13:
        hex += "d";
        break;
      case 14:
        hex += "e";
        break;
      case 15:
        hex += "f";
        break;
      default:
        hex += parseInt(n/i);
        break;
    }
  }
  return hex;
}

exports.getTimeStamp = function(date){
  if (date)
    date = new Date(date);
  else
    date = new Date();
  return convert_decToHex(parseInt(date.getTime()/1000));
}

exports.generate_stardate = function (thisDate) {
  var startDate = new Date(2011, 5, 18, 0, 0, 0, 0);
  var currentDate;
  if (thisDate)
    currentDate = new Date(thisDate.toString());
  else
    currentDate = new Date();
  var stardate_part1 = parseInt((currentDate.getTime() - startDate.getTime())/86400000);
  var stardate_part2 = parseInt((currentDate.getHours()*60*60*1000 + currentDate.getMinutes()*60*1000 + currentDate.getSeconds()*1000 + currentDate.getMilliseconds())/8640000*1.6);
  return (stardate_part1 < 999 ? '0' + stardate_part1.toString() : stardate_part1 ) + '.' + stardate_part2.toString(16);
}