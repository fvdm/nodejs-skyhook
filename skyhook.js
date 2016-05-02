/*
Name:          skyhook-api
Description:   Lookup IP-address details at Skyhook API
Author:        Franklin van de Meent (https://frankl.in)
Source:        https://github.com/fvdm/nodejs-skyhook
Feedback:      https://github.com/fvdm/nodejs-skyhook/issues
License:       Unlicense (Public Domain)
               See https://github.com/fvdm/nodejs-skyhook/raw/master/LICENSE
*/

var http = require ('httpreq');

var app = {
  user: null,
  key: null,
  timeout: 5000
};


function processResponse (err, res, callback) {
  var data = res && res.body || '';
  var error = null;

  try {
    data = JSON.parse (data);
  } catch (e) {
    error = new Error ('invalid data');
    error.statusCode = res.statusCode;
    error.data = data;
    callback (error);
    return;
  }

  if (err) {
    error = new Error ('request failed');
    error.error = err;
    callback (error);
    return;
  }

  if (data.error) {
    error = new Error ('api error');
    error.statusCode = res.statusCode;
    error.code = data.error.code;
    error.text = data.error.message;
    callback (error);
    return;
  }

  data = data.data || data;
  callback (null, data);
}

function getIP (ip, callback) {
  var options = {
    url: 'https://context.skyhookwireless.com/accelerator/ip',
    method: 'GET',
    parameters: {
      version: '2.0',
      ip: ip,
      user: app.user,
      key: app.key,
      timestamp: Math.round (Date.now () / 1000)
    },
    headers: {
      'User-Agent': 'npmjs.com/package/skyhook-api',
      'Accept': 'application/json'
    }
  };

  http.doRequest (options, function (err, res) {
    processResponse (err, res, callback);
  });
}

// the module
module.exports = function (user, key, timeout) {
  app.user = user;
  app.key = key;
  app.timeout = timeout || app.timeout;
  return getIP;
};
