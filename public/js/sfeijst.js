// JavaScript Document
// SFEI JS Tools
exports.sjt_convert_decToHex = function (n) {
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

exports.sjt_showCurrentTimeStamp = function (){
  var d = new Date();
  return ("0x" + sjt_convert_decToHex(parseInt(d.getTime()/1000)));
}

exports.sjt_convert_hexToDec = function(hex) {
  var dec = 0;
  var i, j;
  for (i=hex.length -1 ;i>=0;i--)
  {
    var hexBase = 1;
    for (j=0;j<hex.length - i - 1;j++)
      hexBase *= 16;
    if (hex.charCodeAt(i) > 96)
    {
      dec += hexBase*(hex.charCodeAt(i)-87);
    } else {
      if (hex.charCodeAt(i)>64)
        dec += hexBase*(hex.charCodeAt(i)-55);
      else
        dec += hexBase*(hex.charCodeAt(i)-48);
    }
  }
}

exports.sjt_convert_timestampToDate = function(timestamp) {
  var d = new Date();
    var dec = sjt_convert_hexToDec(timestamp);
  d.setTime(dec*1000);
  return d.toString();
}
  