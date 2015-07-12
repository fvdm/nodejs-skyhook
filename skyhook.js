/*
Name:          skyhook-api
Description:   Lookup IP-address details at Skyhook API
Author:        Franklin van de Meent (https://frankl.in)
Source:        https://github.com/fvdm/nodejs-skyhook
Feedback:      https://github.com/fvdm/nodejs-skyhook/issues
License:       Unlicense (Public Domain)
               See https://github.com/fvdm/nodejs-skyhook/raw/master/LICENSE

Usage:
var sky = require ('skyhook.js') ('email', 'apikey');
sky ('1.2.3.4', callbackFunction);
*/

var http = require ('httpreq');

var app = {
  user: null,
  key: null,
  timeout: 5000
};

// the module
module.exports = function (user, key, timeout) {
  app.user = user;
  app.key = key;
  app.timeout = timeout || app.timeout;
  return getIP;
};


function getIP (ip, callback) {
  var url = 'https://context.skyhookwireless.com/accelerator/ip';
  var options = {
    parameters: {
      version: '2.0',
      ip: ip,
      user: app.user,
      key: app.key,
      timestamp: Math.round (Date.now () / 1000)
    },
    header: {
      'User-Agent': 'npmjs.com/skyhook-api',
      'Accept': 'application/json'
    }
  };

  http.get (url, options, function (err, res) {
    var data = res && res.body || null;
    var error = null;

    try {
      data = JSON.parse (data);
    } catch (e) {
      error = new Error ('invalid data');
    }

    // process data
    if (data instanceof Object && data.error) {
      error = new Error ('api error');
      error.code = data.error.code;
      error.text = data.error.message;
    } else if (data.data) {
      data = data.data;
      if (Object.keys (data) .length < 2) {
        error = new Error ('not found');
      }
    }

    callback (error, !error && data);
  });
}
