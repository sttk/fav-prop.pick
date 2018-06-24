(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g=(g.fav||(g.fav = {}));g=(g.prop||(g.prop = {}));g.pick = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var assign = require('@fav/prop.assign');
var enumOwnProps = require('@fav/prop.enum-own-props');
var isArray = require('@fav/type.is-array');

function pick(src, pickedProps) {
  if (!isArray(pickedProps)) {
    return {};
  }

  var dest = {};

  if (pickedProps.length <= 100) { // 100 is empirical
    var props = enumOwnProps(src);
    for (var i = 0, n = props.length; i < n; i++) {
      var prop = props[i];
      if (pickedProps.indexOf(prop) >= 0) {
        dest[prop] = src[prop];
      }
    }
    return dest;
  }

  src = assign({}, src);
  for (var j = 0, nj = pickedProps.length; j < nj; j++) {
    var picked = pickedProps[j];
    if (isArray(picked)) {
      // This function doesn't allow to use an array as a property.
      continue;
    }
    if (picked in src) {
      dest[picked] = src[picked];
    }
  }
  return dest;
}

module.exports = pick;

},{"@fav/prop.assign":2,"@fav/prop.enum-own-props":4,"@fav/type.is-array":6}],2:[function(require,module,exports){
'use strict';

var enumOwnProps = require('@fav/prop.enum-own-props');

function assign(dest /* , src, ... */) {
  dest = new Object(dest);

  for (var i = 1, n = arguments.length; i < n; i++) {
    assignEach(dest, arguments[i]);
  }

  return dest;
}

function assignEach(dest, src) {
  var props = enumOwnProps(src);
  for (var i2 = 0, n2 = props.length; i2 < n2; i2++) {
    var prop = props[i2];
    try {
      dest[prop] = src[prop];
    } catch (e) {
      // If a property is read only, TypeError is thrown,
      // but this funciton ignores it.
    }
  }
}

module.exports = assign;

},{"@fav/prop.enum-own-props":4}],3:[function(require,module,exports){
'use strict';

function enumOwnKeys(obj) {
  switch (typeof obj) {
    case 'object': {
      return Object.keys(obj || {});
    }
    case 'function': {
      return Object.keys(obj);
    }

    // Cause TypeError on Node.js v0.12 or earlier.
    case 'string': {
      return Object.keys(new String(obj));
    }
    default: {
      return [];
    }
  }
}

module.exports = enumOwnKeys;

},{}],4:[function(require,module,exports){
'use strict';

var enumOwnKeys = require('@fav/prop.enum-own-keys');
var enumOwnSymbols = require('@fav/prop.enum-own-symbols');

function enumOwnProps(obj) {
  return enumOwnKeys(obj).concat(enumOwnSymbols(obj));
}

module.exports = enumOwnProps;

},{"@fav/prop.enum-own-keys":3,"@fav/prop.enum-own-symbols":5}],5:[function(require,module,exports){
'use strict';

function enumOwnSymbols(obj) {
  /* istanbul ignore if */
  if (typeof Symbol !== 'function') {
    return [];
  }

  switch (typeof obj) {
    case 'object': {
      obj = obj || {};
      break;
    }
    case 'function': {
      break;
    }
    default: {
      return [];
    }
  }

  var symbols = Object.getOwnPropertySymbols(obj);
  for (var i = symbols.length - 1; i >= 0; i--) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, symbols[i]);
    if (!descriptor.enumerable) {
      symbols.splice(i, 1);
    }
  }
  return symbols;
}

module.exports = enumOwnSymbols;

},{}],6:[function(require,module,exports){
'use strict';

function isArray(value) {
  return Array.isArray(value);
}

function isNotArray(value) {
  return !Array.isArray(value);
}

Object.defineProperty(isArray, 'not', {
  enumerable: true,
  value: isNotArray,
});

module.exports = isArray;

},{}]},{},[1])(1)
});
