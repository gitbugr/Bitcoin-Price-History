const request = require("request");
const fs = require("fs");
const moment = require("moment");

var start, end, timescale, currency;
var requests = 0;

process.argv.forEach(function (val, index, array) {
  if(index>1){
    switch(val) {
      case '-s':
        if(typeof process.argv[index+1] == 'undefined'){
          console.log("Need start date/time");
          process.exit();
        }
        start = new Date(process.argv[index+1]);
        break;
      case '-e':
        if(typeof process.argv[index+1] == 'undefined'){
          console.log("Need end date/time");
          process.exit();
        }
        end = new Date(process.argv[index+1]);
        break;
      case '-t':
        if(typeof process.argv[index+1] == 'undefined'){
          console.log("Need timescale in minutes");
          process.exit();
        }
        timescale = parseInt(process.argv[index+1]);
        break;
        case '-c':
          if(typeof process.argv[index+1] == 'undefined'){
            console.log("Need currency");
            process.exit();
          }
          currency = process.argv[index+1].toUpperCase();
          break;
    }
  }
});
getPriceData(0);

function getPriceData(i){
  var granularity = timescale * 60;

  var startOffset = new Date(start.getTime());
      startOffset.setHours(startOffset.getHours()+(i * ((200 * timescale) / 60)));

  var endOffset = new Date(startOffset.getTime());
      endOffset.setHours(startOffset.getHours()+((200 * timescale) / 60));
      endOffset = endOffset.getTime() < end.getTime() ? endOffset : end;

  if(startOffset.getTime() < end.getTime()){
    var startFormatString = moment(startOffset).format("YYYY-MM-DD[T]HH:mm:ss[.000Z]");
    var endFormatString = moment(endOffset).format("YYYY-MM-DD[T]HH:mm:ss[.000Z]");
    var differenceInMinutes = parseInt((endOffset.getTime() - startOffset.getTime())/1000/60/60);

    var url = `https://api.gdax.com/products/BTC-${currency}/candles?start=${startFormatString}&end=${endFormatString}&granularity=${granularity}`;
    var options = {
      url:url,
      headers:{
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3158.0 Safari/537.36'
      }
    };
    request(options,function(error, response, body){
      requests++;
      if (!error && response.statusCode == 200 && body !== '[]') {
        body = body.substr(1);
        body = body.substr(0,body.length-2);
        body = body.split("[").join("").split("],").join("\n");
        console.log(body);
        var timeout = 0;
        if(requests >= 3){
          timeout = 1000;
          requests = 0;
        }
        setTimeout(function(){getPriceData(i+1);},timeout);
      }
      else{
        var timeout = 0;
        if(requests >= 3){
          timeout = 1000;
          requests = 0;
        }
        setTimeout(function(){getPriceData(i);},timeout);
      }
    }.bind({i:i}));
  }
}
