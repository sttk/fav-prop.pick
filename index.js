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
    try {
      if (picked in src) {
        dest[picked] = src[picked];
      }
    } catch (e) {
      // If `picked` is an array of Symbol, (picked in src) or src[picked]
      // throws an error, but this function suppresses it.
    }
  }
  return dest;
}

module.exports = pick;
