skyhook-api
===========

Get IP-address location details from the [Skyhook](http://skyhookwireless.com) Hyperlocal IP service in [node.js](http://nodejs.org/).

[![Build Status](https://travis-ci.org/fvdm/nodejs-skyhook.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-skyhook)


Installation
------------

`npm install skyhook-api`

Or the latest development version:

`npm install git+https://github.com/fvdm/nodejs-skyhook`


You need an account at [Skyhook](https://my.skyhookwireless.com/), create an app there for the _Hyperlocal IP_ service and get its API key.


Usage
-----

```js
var skyhook = require('skyhook-api')( 'user@email.tld', 'API KEY' )

// Lookup IP
skyhook( '1.2.3.4', function( err, data ) {
  console.log( err || data )
})
```

#### Example output

```js
{ location: 
   { type: 'FIXED',
     latitude: 52.1000000000001,
     longitude: 4.6000000000000001,
     hpe: 168959 },
  ip: '1.2.3.4',
  civic: 
   { state: 'Zuid-Holland',
     country: 'Netherlands',
     countryProb: 0.99,
     countryIso: 'NL',
     stateProb: 0.99,
     stateIso: 'ZH' } }
```

#### Errors

When an error occurs `err` is an instanceof _Error_ with `.stack` trace and additional properties depending on the error.
When everything is good, `err` is _null_ and `data` is an _object_.

error message  | description                   | properties
-------------- | ----------------------------- | ----------------
request closed | request was closed too early  | 
request failed | request can not be done       | `.error`
not found      | IP-address is not in database | 
invalid data   | API returned invalid data     | 
api error      | API returned an error         | `.code`, `.text`


Unlicense
---------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>


Author
------

Franklin van de Meent
| [Website](https://frankl.in/)
| [Github](https://github.com/fvdm)
