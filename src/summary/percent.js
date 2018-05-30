/**
 * @fileOverview 计算累加值的比例
 * @author dxq613@gmail.com
 */


const Util = require('@ali/g-util');
const Summary = require('./summary');
const Frame = require('@ali/g-frame');
const Mixin = require('./percent-mixin');
const STR_PERCENT = '..percent';

const Percent = function(dims, innerCompare) {
  return new Summary(Util.mix({
    dims,
    innerCompare,
    initDims(dims) {
      const lastDim = dims[dims.length - 1];
      // dims.push('..percent');
      dims.splice(dims.length - 1, 0, STR_PERCENT); // 将percent放置到倒数第二个
      this.percetDim = lastDim;
    },
    getStatDims() {
      return [ STR_PERCENT ];
    },
    transform(frame, name, totalFrame) {
      name = this.percetDim;

      const sum = Frame.sum(frame, name);
      const totalSum = Frame.sum(totalFrame, name);
      const obj = frame.rowObject(0);

      obj['..percent'] = sum / totalSum;
      // obj[name] = totalSum;
      obj[name] = sum;

      return new Frame([ obj ]);
    }
  }, Mixin));
};

module.exports = Percent;
