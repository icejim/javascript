function pad(number, length){
    var str = "" + number;
    while (str.length < length) {
        str = '0'+str;
    }
    return str;
}

var offset = new Date().getTimezoneOffset();
offset = ((offset<0? '+':'-')+ // Note the reversed sign!
          pad(parseInt(Math.abs(offset/60)), 2)+
          pad(Math.abs(offset%60), 2));
