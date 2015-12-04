# Synopsis

**httperr** provides Error types for all HTTP error status codes.

[![stability 3 - stable](http://b.repl.ca/v1/stability-3_--_stable-yellowgreen.png)
](http://nodejs.org/api/documentation.html#documentation_stability_index) [![license - Unlicense](http://b.repl.ca/v1/license-Unlicense-lightgrey.png)](http://unlicense.org/) [![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=pluma&url=https://github.com/pluma/httperr)

[![Build Status](https://travis-ci.org/pluma/httperr.png?branch=master)](https://travis-ci.org/pluma/httperr) [![Coverage Status](https://coveralls.io/repos/pluma/httperr/badge.png?branch=master)](https://coveralls.io/r/pluma/httperr?branch=master) [![Dependencies](https://david-dm.org/pluma/httperr.png?theme=shields.io)](https://david-dm.org/pluma/httperr)

[![NPM status](https://nodei.co/npm/httperr.png?compact=true)](https://npmjs.org/package/httperr)

# Why?

There are several libraries that already do this, but most of them either only support a very limited number of status codes, don't capture stack traces correctly or are no longer maintained.

The biggest difference in **httperr** is that it lets you attach relevant information for the error in a single function call, allowing you to separate your error handling and error response logic without losing the semantics of HTTP status codes.

# Install

## With NPM

```sh
npm install httperr
```

## From source

```sh
git clone https://github.com/pluma/httperr.git
cd httperr
npm install
```

# Basic usage example

```javascript
var httperr = require('httperr');

var err = httperr[404]('The path "/example" could not be resolved');
console.log(err);
/*
{ [NotFound: The path "/example" could not be resolved]
  title: 'Not Found',
  name: 'NotFound',
  code: 'NOT_FOUND',
  statusCode: 404,
  message: 'The path "/example" could not be resolved'
}
*/
throw err;
/*
NotFound: The path "/example" could not be resolved
    at ...
*/

console.log(httperr.methodNotAllowed({allowed: ['GET', 'POST']}));
/*
{ [MethodNotAllowed]
  title: 'Method Not Allowed',
  name: 'MethodNotAllowed',
  code: 'METHOD_NOT_ALLOWED',
  statusCode: 405,
  message: '',
  allowed: ['GET', 'POST']
}
*/

err = new httperr.NotFound();
console.log(err);
/*
{ [NotFound]
  title: 'Not Found',
  name: 'NotFound',
  code: 'NOT_FOUND',
  statusCode: 404,
  message: 'The path "/example" could not be resolved'
}
*/

console.log(err instanceof httperr.NotFound); // true
console.log(err instanceof httperr.notFound); // true
console.log(err instanceof httperr['404']); // true
console.log(err instanceof httperr.MethodNotAllowed); // false
console.log(err instanceof httperr.HttpError); // true
console.log(err instanceof Error); // true
```

# API

## new httperr.{ErrorName}([config:Object]):Error

Creates an Error object. The `new` keyword is optional.

Example:

```javascript
new httperr.NotFound({message: 'That does not exist'});
```

If `config` is a string, it will be treated as `config.message`.

If `config` is an `Error` object, it will be treated as `config.cause`.

If `config` is an object, it can have the following properties:

### config.message (optional)
A descriptive human-readable title describing the error's cause.

### config.cause (optional)
The underlying exception that caused the HTTP error.

### config.details (optional)
A detailed human-readable description of the error's cause and possible solutions.

### config.allowed (optional)
The methods allowed for this URL.

This property is only available for `405 Method Not Allowed` errors and can be used to populate the `Allow` header.

### config.retryAfter (optional)
The minimum delay before the request should be attempted again.

This property is only available for `429 Too Many Requests` and `420 Enhance Your Calm` (Twitter API) errors and can be used to populate the `Retry-After` header.

### config.parameters (optional)
The parameters with which the request should be retried.

This property is only available for `449 Retry With` (Microsoft) errors and can be used to populate the response status message.

### config.location (optional)
The location for which the request should be repeated.

This property is only available for `451 Redirect` (Microsoft) errors and can be used to populate the proprietary `X-MS-Location` response header.

## httperr.{statusCode}(config:Object):Error

See above.

Example:

```javascript
httperr[404]({message: 'That does not exist either'});
```

## httperr.{errorName}([config:Object]):Error

See above.

Example:

```javascript
httperr.notFound({message: 'This link is dead, too'})
```

## httperr.createHttpError(status, title, [init]):Function
Creates a new error type for the given HTTP error status.

Takes the following arguments:

### title
A human-readable title for the HTTP error.

### status
The HTTP response status code for the HTTP error.

### init (optional)
A function which will be invoked as a method of the new error with the `config` argument immediately after the error is created by the factory. Can be used to process additional error-specific configuration parameters.

## new httperr.HttpError(config)

The base type for all `httperr` error types. You probably don't want to use this directly.

# Unlicense

This is free and unencumbered public domain software. For more information, see http://unlicense.org/ or the accompanying [UNLICENSE](https://github.com/pluma/httperr/blob/master/UNLICENSE) file.
