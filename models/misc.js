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