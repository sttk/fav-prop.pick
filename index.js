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
