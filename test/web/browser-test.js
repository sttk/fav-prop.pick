(function(){
'use strict';


var expect = chai.expect;



var pick = fav.prop.pick;

describe('fav.prop.pick', function() {

  it('Should return a new plain object which is copied specified prop keys' +
  '\n\tfrom source object', function() {
    var src = { a: 1, b: 2, c: 3 };
    expect(pick(src, [])).to.deep.equal({});
    expect(pick(src, ['c'])).to.deep.equal({ c: 3 });
    expect(pick(src, ['c', 'a'])).to.deep.equal({ a: 1, c: 3 });
    expect(pick(src, ['c', 'a', 'b'])).to.deep.equal({ a: 1, b: 2, c: 3 });
  });

  it('Should return a new plain object which is copied specified prop ' +
  '\n\tsymbols from source object', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    var src = {};
    src[a] = 1;
    src[b] = 2;
    src[c] = 3;

    expect(Object.getOwnPropertySymbols(pick(src, []))).to.has.members([]);

    var ret = pick(src, [c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([c]);
    expect(ret[c]).to.equal(3);

    ret = pick(src, [c, a]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, c]);
    expect(ret[a]).to.equal(1);
    expect(ret[c]).to.equal(3);

    ret = pick(src, [c, a, b]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, b, c]);
    expect(ret[a]).to.equal(1);
    expect(ret[b]).to.equal(2);
    expect(ret[c]).to.equal(3);
  });

  it('Should not return unenumerable prop keys', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { value: 1 },
      b: { enumerable: true, value: 2 },
      c: { value: 3 },
    });
    expect(pick(obj, ['a', 'b', 'c'])).to.deep.equal({ b: 2 });
  });

  it('Should not return unenumerable prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    var obj = {};
    obj[a] = 1;
    Object.defineProperty(obj, b, { value: 2 });
    Object.defineProperty(obj, c, { enumerable: true, value: 3 });

    var ret = pick(obj, [a, b, c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, c]);
    expect(ret[a]).to.equal(1);
    expect(ret[c]).to.equal(3);
  });

  it('Should not return inherited prop keys', function() {
    function Fn1() {
      this.a = 1;
      this.b = 2;
    }
    function Fn2() {
      this.c = 3;
    }
    Fn1.prototype = new Fn2();
    var obj = new Fn1();

    var ret = pick(obj, ['a', 'b', 'c']);
    expect(ret).to.deep.equal({ a: 1, b: 2 });
  });

  it('Should not return inherited prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    function Fn1() {
      this[a] = 1;
      this[b] = 2;
    }
    function Fn2() {
      this[c] = 3;
    }
    Fn1.prototype = new Fn2();
    var obj = new Fn1();

    var ret = pick(obj, [a, b, c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, b]);
    expect(ret[a]).to.equal(1);
    expect(ret[b]).to.equal(2);
  });

  it('Should return an empty plain object when first arg is not a object',
  function() {
    expect(pick(undefined, ['a'])).to.deep.equal({});
    expect(pick(null, ['a'])).to.deep.equal({});
    expect(pick(true, ['a'])).to.deep.equal({});
    expect(pick(false, ['a'])).to.deep.equal({});
    expect(pick(0, ['a'])).to.deep.equal({});
    expect(pick(123, ['a'])).to.deep.equal({});

    if (typeof Symbol === 'function') {
      expect(pick(Symbol('foo'), ['a'])).to.deep.equal({});
    }

    // string and array are exceptions
    expect(pick('', ['length'])).to.deep.equal({});
    expect(pick('ABC', ['0'])).to.deep.equal({ '0': 'A' });
    expect(pick([], ['length'])).to.deep.equal({});
    expect(pick([1, 2, 3], ['0'])).to.deep.equal({ '0': 1 });

    // function can have enum props
    var fn = function() {};
    expect(pick(fn, ['name'])).to.deep.equal({});
    fn.a = 1;
    expect(pick(fn, ['a'])).to.deep.equal({ a: 1 });
  });

  it('Should return an empty plain object when second arg is not an array',
  function() {
    var src = { a: 1, b: 2, c: 3 };
    expect(pick(src, undefined)).to.deep.equal({});
    expect(pick(src, null)).to.deep.equal({});
    expect(pick(src, true)).to.deep.equal({});
    expect(pick(src, false)).to.deep.equal({});
    expect(pick(src, 0)).to.deep.equal({});
    expect(pick(src, 123)).to.deep.equal({});
    expect(pick(src, '')).to.deep.equal({});
    expect(pick(src, 'ABC')).to.deep.equal({});
    expect(pick(src, {})).to.deep.equal({});
    expect(pick(src, { a: 'b' })).to.deep.equal({});
    expect(pick(src, function() {})).to.deep.equal({});

    if (typeof Symbol === 'function') {
      expect(pick(src, Symbol('a'))).to.deep.equal({});
    }
  });

  it('Should pick normally when length of second argument is a lot',
  function() {
    var src = {};
    for (var i = 0; i < 10000; i++) {
      src['a' + i] = i;
    }
    var keys = Object.keys(src).reverse();
    for (var j = 0; j < 100; j++) {
      keys.push('b' + j);
    }
    expect(pick(src, keys)).to.deep.equal(src);
  });
});

})();
