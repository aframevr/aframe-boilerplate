var Cookies = require('cookies');
var url = require('url');
var http = require('http');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');


/**
 * Mock request object for sending to the router without needing a server.
 **/
var MockRequest = function(options) {
  if (!(this instanceof MockRequest)) {
    return new MockRequest(options);
  }

  EventEmitter.call(this, options);

  this.body = '';
  this.httpVersion = '1.1';
  this.url = options.url || '/';
  this.query = url.parse(this.url, true).query;
  this.headers = this._headers = {};

  // setHeader now applies toLowerCase the names to mirror native node behaviour
  var self = this;
  _.each(options.headers, function(v, k) {
    self.setHeader(k, v);
  });

  this.setHeader('transfer-encoding', 'chunked');

  this.method = options.method || 'GET';
  this.connection = this.socket = {};
  // this.buffer = [];

  if (options.cookies && !this.getHeader('cookie')) {
    var cookieBuffer = [];

    _.forEach(_.keys(options.cookies), function(key) {
      cookieBuffer.push(key + '=' + options.cookies[key]);
    });

    this.setHeader('cookie', cookieBuffer.join(';'));
  }
};

util.inherits(MockRequest, EventEmitter);


MockRequest.prototype.setHeader = function(name, value, clobber) {
  if (http.ClientRequest) {
    var ret = http.ClientRequest.prototype.setHeader.call(this, name, value, clobber);
    this.headers = this._headers;
    return ret;
  } else if (clobber || !this.headers.hasOwnProperty(name)) {
    this.headers[name.toLowerCase()] = value;
  } else {
    this.headers[name.toLowerCase()] += ',' + value;
  }
};

MockRequest.prototype.getHeader = function(name) {
  if (http.ClientRequest) {
    return http.ClientRequest.prototype.getHeader.call(this, name);
  } else {
    return this.headers[name];
  }
};

MockRequest.prototype.pause = function() {};

MockRequest.prototype.resume = function() {};

MockRequest.prototype.write = function(str) {
  this.body += str;
};

MockRequest.prototype.end = function(str) {
  if (str) {
    this.write(str);
  }
  this.emit('data', new Buffer(this.body));
  this.emit('end');
};

module.exports = MockRequest;
