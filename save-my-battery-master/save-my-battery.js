#!/usr/bin/env node

var exec = require('child_process').exec;
var notifier = require('node-notifier');
var terminalCommand = 'ioreg -n AppleSmartBattery -r';
var seconds = 3
var frequency = seconds * 1000;

var onTerminalOutput = function(error, stdout) {
    if (!stdout) return;
    var max = /"MaxCapacity" = (\d+)/m.exec(stdout)[1];
    var current = /"CurrentCapacity" = (\d+)/m.exec(stdout)[1];
    var pc = Math.round(current / max * 100);
    var isCharging = /"IsCharging" = Yes/.test(stdout);

    sendMessage(pc + '% Battery Left');
};

var getBatteryPC = function(){
    exec(terminalCommand, onTerminalOutput);
    setTimeout(getBatteryPC, frequency);
};

var sendMessage = function(message) {
    req.write(userString);
    req.end();
    // console.log(message);
    // notifier.notify({
    //     title: '🔋 Battery Alert',
    //     message: message,
    //     group: 'balert',
    //     sender: 'balert'
    // });
};


var http = require('http');

var userString = JSON.stringify(pc);

var headers = {
  'Content-Type': 'application/json',
  'Content-Length': userString.length
};

var options = {
  host: 'juicelvl.herokuapp.com',
  port: 80,
  path: '/battery.js',
  method: 'POST',
  headers: headers
};

// Setup the request.  The options parameter is
// the object we defined above.
var req = http.request(options, function(res) {
  res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
    responseString += data;
  });

  res.on('end', function() {
    var resultObject = JSON.parse(responseString);
  });
});



setTimeout(getBatteryPC, frequency);
getBatteryPC();
