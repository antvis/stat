/**
 * @fileOverview The proportion of statistical data
 * @author dxq613@gmail.com
 */


const Util = require('../util');
const Summary = require('./summary');
const Mixin = require('./percent-mixin');

const Proportion = function(dims, innerCompare) {
  return new Summary(Util.mix({
    dims,
    innerCompare,
    initDims(dims) {
      dims.push('..proportion');
    },
    transform(array, name, totalArray) {
      const percent = array.length / totalArray.length;
      const obj = Util.mix({}, array[0]);
      obj[name] = percent;
      return [ obj ];
    }
  }, Mixin));
};

module.exports = Proportion;
