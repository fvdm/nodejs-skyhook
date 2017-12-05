skyhook-api
===========

[![Greenkeeper badge](https://badges.greenkeeper.io/fvdm/nodejs-skyhook.svg)](https://greenkeeper.io/)

Lookup IP location with the [Skyhook](http://skyhookwireless.com) Hyperlocal IP service in [node.js](https://nodejs.org/) (unofficial)

[![npm](https://img.shields.io/npm/v/skyhook-api.svg?maxAge=3600)](https://github.com/fvdm/nodejs-skyhook/blob/master/CHANGELOG.md)
[![Build Status](https://travis-ci.org/fvdm/nodejs-skyhook.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-skyhook)
[![Coverage Status](https://coveralls.io/repos/github/fvdm/nodejs-skyhook/badge.svg?branch=master)](https://coveralls.io/github/fvdm/nodejs-skyhook?branch=master)
[![bitHound Dependencies](https://www.bithound.io/github/fvdm/nodejs-skyhook/badges/dependencies.svg)](https://www.bithound.io/github/fvdm/nodejs-skyhook/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/fvdm/nodejs-skyhook/badges/code.svg)](https://www.bithound.io/github/fvdm/nodejs-skyhook)


Example
-------

```js
var skyhook = require ('skyhook-api') ('user@email.tld', 'API KEY');

// Lookup IP
skyhook ('1.2.3.4', (err, data) => {
  console.log (err || data);
});
```

#### Output

```js
{
  location: {
    type: 'FIXED',
    latitude: 52.1000000000001,
    longitude: 4.6000000000000001,
    hpe: 168959
  },
  ip: '1.2.3.4',
  civic: {
    state: 'Zuid-Holland',
    country: 'Netherlands',
    countryProb: 0.99,
    countryIso: 'NL',
    stateProb: 0.99,
    stateIso: 'ZH'
  }
}
```


Installation
------------

Normal: `npm install skyhook-api`

You need an account at [Skyhook](https://my.skyhookwireless.com/), create an app there for the _Hyperlocal IP_ service and get its API key.


Configuration
-------------

The first _function_ is the setup and is used like this: `( user, key, [timeout] )`.

name    | type   | required | description
--------|--------|----------|-----------------------------------
user    | string | yes      | account email
key     | string | yes      | app API key
timeout | number | no       | wait timeout in ms, default `5000`


Errors
------

When an error occurs `err` is an instanceof _Error_ with `.stack` trace and additional properties depending on the error.
When everything is good, `err` is _null_ and `data` is an _object_.

error message  | description               | properties
---------------|---------------------------|-----------------
request failed | Request can not be made   | `.error`
invalid data   | API returned invalid data |
api error      | API returned an error     | `.code`, `.text`


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

[Franklin van de Meent](https://frankl.in)

[![Buy me a coffee](https://frankl.in/u/kofi/kofi-readme.png)](https://ko-fi.com/franklin)
