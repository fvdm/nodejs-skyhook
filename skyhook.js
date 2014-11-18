/*
Name:          skyhook-api
Description:   Lookup IP-address details at Skyhook API
Author:        Franklin van de Meent (https://frankl.in)
Source:        https://github.com/fvdm/nodejs-skyhook
Feedback:      https://github.com/fvdm/nodejs-skyhook/issues
License:       Unlicense (Public Domain)
               See https://github.com/fvdm/nodejs-skyhook/raw/master/LICENSE

Usage:
var sky = require('skyhook.js')('email', 'apikey')
sky( '1.2.3.4', callbackFunction )
*/

var app = {
  user: null,
  key: null,
  timeout: 5000
}

// the module
module.exports = function( user, key, timeout ) {
  app.user = user
  app.key = key
  app.timeout = timeout || app.timeout
  
  return getIP
}

    
function getIP( ip, cb ) {
  // prevent multiple callbacks
  var complete = false
  function callback( err, res ) {
    if( ! complete ) {
      complete = true
      cb( err, res || null )
    }
  }
  
  // build request
  var query = require('querystring').stringify({
    version: '2.0',
    ip: ip,
    user: app.user,
    key: app.key,
    timestamp: Math.round( Date.now() / 1000 )
  })

  var options = {
    host: 'context.skyhookwireless.com',
    port: 443,
    path: '/accelerator/ip?'+ query,
    method: 'GET'
  }
  
  var request = require('https').request( options )
  
  // response
  request.on( 'response', function( response ) {
    var body = ''
    var error = null
    
    response.on( 'data', function(ch) { body += ch })
    response.on( 'close', function() { callback( new Error('request closed') ) })
    response.on( 'end', function() {
      try {
        body = JSON.parse( body )
      } catch(e) {
        error = new Error('invalid data')
      }
      
      // process data
      if( body.error ) {
        error = new Error('api error')
        error.code = body.error.code
        error.text = body.error.message
      } else if( body.data ) {
        body = body.data
        if( Object.keys( body ).length <= 1 ) {
          error = new Error('not found')
        }
      }
      
      callback( error, !error && body )
    })
  })

  // timeout
  request.on( 'socket', function( socket ) {
    if( app.timeout ) {
      socket.setTimeout( app.timeout )
      socket.on( 'timeout', function() {
        callback( new Error('request timeout') )
        request.abort()
      })
    }
  })

  // error
  request.on( 'error', function( error ) {
    if( error.code === 'ECONNRESET' ) {
      var er = new Error('request timeout')
    } else {
      var er = new Error('request failed')
    }
    er.error = error
    callback( er )
  })
  
  // finish
  request.end()
}
