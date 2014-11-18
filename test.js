/*
Name:         skyhook-api test script
Description:  Test script for skyhook-api node.js module
Author:       Franklin van de Meent (https://frankl.in)
Source:       https://github.com/fvdm/nodejs-skyhook
Feedback:     https://github.com/fvdm/nodejs-skyhook/issues
License       Unlicense (Public Domain)
              See https://github.com/fvdm/nodejs-skyhook/raw/master/LICENSE

Usage:
npm test --skyhookUser=your@email.tld --skyhookKey=abc123
*/

var util = require('util')

// Setup
// set env SKYHOOK_USER SKYHOOK_KEY (Travis CI)
// or use cli arguments: npm test --skyhookUser=your@email.tld --skyhookKey=abc123
var user = process.env.npm_config_skyhookUser || process.env.SKYHOOK_USER || null
var key = process.env.npm_config_skyhookKey || process.env.SKYHOOK_KEY || null
var timeout = process.env.npm_config_skyhookTimeout || process.env.SKYHOOK_TIMEOUT || 5000


var skyhook = require('./')( user, key, timeout )


// handle exits
var errors = 0
process.on( 'exit', function() {
  if( errors == 0 ) {
    console.log('\n\033[1mDONE, no errors.\033[0m\n')
    process.exit(0)
  } else {
    console.log('\n\033[1mFAIL, '+ errors +' error'+ (errors > 1 ? 's' : '') +' occurred!\033[0m\n')
    process.exit(1)
  }
})

// prevent errors from killing the process
process.on( 'uncaughtException', function( err ) {
  console.log()
  console.error( err.stack )
  console.trace()
  console.log()
  errors++
})

// Queue to prevent flooding
var queue = []
var next = 0

function doNext() {
  next++
  if( queue[next] ) {
    queue[next]()
  }
}

// doTest( passErr, 'methods', [
//   ['feeds', typeof feeds === 'object']
// ])
function doTest( err, label, tests ) {
  if( err instanceof Error ) {
    console.error( label +': \033[1m\033[31mERROR\033[0m\n' )
    console.error( util.inspect(err, false, 10, true) )
    console.log()
    console.error( err.stack )
    console.log()
    errors++
  } else {
    var testErrors = []
    tests.forEach( function( test ) {
      if( test[1] !== true ) {
        testErrors.push(test[0])
        errors++
      }
    })

    if( testErrors.length == 0 ) {
      console.log( label +': \033[1m\033[32mok\033[0m' )
    } else {
      console.error( label +': \033[1m\033[31mfailed\033[0m ('+ testErrors.join(', ') +')' )
    }
  }

  doNext()
}

// Real world tests
function testArrObj( src ) {
  return [
    ['data type', src && src instanceof Array],
    ['item type', src && src[0] && src[0] instanceof Object]
  ]
}

function testObj( src ) {
  return [
    ['data type', src && src instanceof Object]
  ]
}

// First check API access
queue.push( function() {
  skyhook( '127.0.0.1', function(err, data) {
    if(err) {
      console.log('API access: \033[1m\033[31mfailed\033[0m ('+ err.message +')')
      console.log()
      console.log(err)
      console.log()
      console.log(err.stack)
      errors++
      process.exit(1)
    } else {
      console.log('API access: \033[1m\033[32mok\033[0m')
      
      // ! should work
      doTest( err, '127.0.0.1', [
        ['data type', data instanceof Object],
        ['ip', data.ip === '127.0.0.1'],
        ['demographics', data.demographics instanceof Object],
        ['age', data.demographics.age instanceof Array],
        ['age item', data.demographics.age[0] instanceof Object]
      ])
      
      doNext()
    }
  })
})

// ! invalid
queue.push( function() {
  skyhook( 'invalid input', function(err, data) {
    doTest( null, 'invalid ip', [
      ['error', err instanceof Error],
      ['reason', err.message === 'api error'],
      ['code', err.code === 400],
      ['text', err.text === 'malformed ip'],
      ['data', !data]
    ])
  })
})

// ! not found
queue.push( function() {
  skyhook( '8.8.4.4', function(err, data) {
    doTest( null, 'not found', [
      ['error', err instanceof Error],
      ['reason', err.message === 'not found'],
      ['data', !data]
    ])
  })
})

// ! T-Mobile NL IP
queue.push( function() {
  skyhook( '84.241.201.227', function(err, data) {
    doTest( err, 'good ip', [
      ['location', data && data.location instanceof Object],
      ['geo', data && typeof data.location.latitude === 'number'],
      ['hpe', data && typeof data.location.hpe === 'number'],
      ['ip', data && data.ip === '84.241.201.227'],
      ['civic', data && data.civic instanceof Object],
      ['countryIso', data && data.civic && data.civic.countryIso === 'NL']
    ])
  })
})

queue[0]()
