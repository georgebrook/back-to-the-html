'use strict';

// ES6 Supported.
// Go!

var count = function count(string) {
  var arr = string.split('').join(''),
      charInst = 0,
      instArr = [];
  for (var i = 0; i < arr.length; i++) {
    instArr.push(arr[i]);
  }
  return instArr;
};
console.log(count('ababccff'));
//# sourceMappingURL=global.js.map
