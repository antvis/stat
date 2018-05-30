/**
 * @fileOverview The proportion of statistical data
 * @author dxq613@gmail.com
 */


const Util = require('@ali/g-util');
const Summary = require('./summary');
const Frame = require('@ali/g-frame');
const Mixin = require('./percent-mixin');

const Proportion = function(dims, innerCompare) {
  return new Summary(Util.mix({
    dims,
    innerCompare,
    initDims(dims) {
      dims.push('..proportion');
    },
    transform(frame, name, totalFrame) {
      const percent = frame.rowCount() / totalFrame.rowCount();
      const obj = frame.rowObject(0);
      obj[name] = percent;
      return new Frame([ obj ]);
    }
  }, Mixin));
};

module.exports = Proportion;
