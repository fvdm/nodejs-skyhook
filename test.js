/*
Name:         skyhook-api test script
Description:  Test script for skyhook-api node.js module
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-skyhook
Feedback:     https://github.com/fvdm/nodejs-skyhook/issues
License       Unlicense (Public Domain)
              See https://github.com/fvdm/nodejs-skyhook/raw/master/LICENSE
*/

const dotest = require ('dotest');
const app = require ('./');

// Setup
// set env SKYHOOK_USER SKYHOOK_KEY (Travis CI)
const user = process.env.SKYHOOK_USER || null;
const key = process.env.SKYHOOK_KEY || null;
const timeout = process.env.SKYHOOK_TIMEOUT || 5000;

const skyhook = app && app (user, key, timeout);


// T-Mobile NL IP
dotest.add ('good ip', function (test) {
  skyhook ('84.241.201.227', function (err, data) {
    const location = data && data.location;
    const civic = data && data.civic;

    test (err)
      .isObject ('fail', 'data', data)
      .isObject ('fail', 'data.location', location)
      .isNumber ('fail', 'data.location.latitude', location && location.latitude)
      .isNumber ('fail', 'data.location.hpe', location && location.hpe)
      .isExactly ('fail', 'data.ip', data && data.ip, '84.241.201.227')
      .isObject ('fail', 'data.civic', civic)
      .isExactly ('fail', 'data.civic.countryIso', civic && civic.countryIso, 'NL')
      .done ();
  });
});


// API error
dotest.add ('Error: api error', function (test) {
  skyhook ('invalid input', function (err, data) {
    test ()
      .isError ('fail', 'err', err)
      .isExactly ('fail', 'err.message', err && err.message, 'api error')
      .isExactly ('warn', 'err.code', err && err.code, 400)
      .isExactly ('warn', 'err.test', err && err.text, 'malformed ip')
      .isUndefined ('fail', 'data', data)
      .done ();
  });
});


// Run tests
dotest.run ();
