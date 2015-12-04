/*global describe, it */
var expect = require('expect.js'),
  HttpError = require('../').HttpError;

describe('HttpError', function() {
  it('is a constructor', function() {
    expect(HttpError).to.be.a('function');
    expect(HttpError).to.have.property('prototype');
    expect(HttpError.prototype).to.be.an('object');
    expect(HttpError.prototype).to.have.property('constructor', HttpError);
  });
  it('returns an Error', function() {
    var err = new HttpError();
    expect(err).to.be.an(Error);
    expect(Error.prototype.isPrototypeOf(err)).to.equal(true);
  });
});

describe('new HttpError(Error)', function() {
  it('sets the error\'s cause to the given error', function() {
    var err = new Error();
    expect(new HttpError(err)).to.have.property('cause', err);
  });
});

describe('new HttpError(String)', function() {
  it('sets the error\'s message to the given string', function() {
    var msg = 'Hello World';
    expect(new HttpError(msg)).to.have.property('message', msg);
  });
});

describe('new HttpError(opts:Object)', function() {
  it('sets the error\'s cause to opts.cause', function() {
    var err = new Error();
    expect(new HttpError({cause: err})).to.have.property('cause', err);
  });
  it('sets the error\'s message to opts.message', function() {
    var msg = 'Hello World';
    expect(new HttpError({message: msg})).to.have.property('message', msg);
  });
  it('sets the error\'s details to opts.details', function() {
    var details = 'Hello World';
    expect(new HttpError({details: details})).to.have.property('details', details);
  });
});