/*global describe, it */
var expect = require('expect.js'),
  rewire = require('rewire'),
  httperr = rewire('../');

describe('indent(String)', function() {
  var indent = httperr.__get__('indent');
  it('indents a string by four spaces', function() {
    expect(indent('x')).to.equal('    x');
  });
});

describe('simplify(String)', function() {
  var simplify = httperr.__get__('simplify');
  it('is a function', function() {
    expect(simplify).to.be.a('function');
  });
  it('strips "a"/"an" prefixes', function() {
    expect(simplify('a thing')).to.equal('thing');
    expect(simplify('A Thing')).to.equal('Thing');
    expect(simplify('an error')).to.equal('error');
    expect(simplify('An Error')).to.equal('Error');
  });
  it('strips apostrophes', function() {
    expect(simplify('x\'yz')).to.equal('xyz');
    expect(simplify('\'xyz')).to.equal('xyz');
    expect(simplify('xyz\'')).to.equal('xyz');
    expect(simplify('x\'y\'z')).to.equal('xyz');
  });
  it('replaces dashes with spaces', function() {
    expect(simplify('foo-bar')).to.equal('foo bar');
  });
});

describe('ucUnderscore(String)', function() {
  var ucUnderscore = httperr.__get__('ucUnderscore');
  it('is a function', function() {
    expect(ucUnderscore).to.be.a('function');
  });
  it('replaces spaces with underscores', function() {
    expect(ucUnderscore('1 2 3')).to.equal('1_2_3');
  });
  it('converts lowercase to uppercase', function() {
    expect(ucUnderscore('fooBarQux')).to.equal('FOOBARQUX');
  });
});

describe('titleCase(String)', function() {
  var titleCase = httperr.__get__('titleCase');
  it('is a function', function() {
    expect(titleCase).to.be.a('function');
  });
  it('converts the first character to uppercase', function() {
    expect(titleCase('xyz')).to.equal('Xyz');
  });
  it('converts the rest of the string to lowercase', function() {
    expect(titleCase('XYZ')).to.equal('Xyz');
  });
});

describe('camelCase(String)', function() {
  var camelCase = httperr.__get__('camelCase');
  it('is a function', function() {
    expect(camelCase).to.be.a('function');
  });
  it('removes spaces', function() {
    expect(camelCase('1 2 3')).to.equal('123');
  });
  it('converts every initial character to uppercase', function() {
    expect(camelCase('x y z')).to.equal('XYZ');
  });
  it('converts all other characters to lowercase', function() {
    expect(camelCase('foo bar qux')).to.equal('FooBarQux');
  });
});

describe('lcFirst(String)', function() {
  var lcFirst = httperr.__get__('lcFirst');
  it('is a function', function() {
    expect(lcFirst).to.be.a('function');
  });
  it('converts the first character to lowercase', function() {
    expect(lcFirst('X')).to.equal('x');
  });
  it('does not modify the rest of the string', function() {
    expect(lcFirst('XYZ')).to.equal('xYZ');
  });
});

describe('spread(Function)(Array)', function() {
  var spread = httperr.__get__('spread');
  it('is a function', function() {
    expect(spread).to.be.a('function');
  });
  it('returns a function', function() {
    expect(spread(function() {})).to.be.a('function');
  });
  it('invokes the function when called', function() {
    var called = false;
    spread(function() {
      called = true;
    })([]);
    expect(called).to.equal(true);
  });
  it('applies the array as arguments', function(done) {
    var args = [1, 2, 3];
    spread(function() {
      expect(arguments).to.eql(args);
      done();
    })(args);
  });
});