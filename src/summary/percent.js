/**
 * @fileOverview 计算累加值的比例
 * @author dxq613@gmail.com
 */


const Util = require('../util');
const Summary = require('./summary');
const Mixin = require('./percent-mixin');
const STR_PERCENT = '..percent';
const Statistic = require('simple-statistics');

function getSum(arr, name) {
  const values = Util.arrayUtil.colValues(arr, name);
  return Statistic.sum(values);
}

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
    transform(arr, name, totalArray) {
      name = this.percetDim;

      const sum = getSum(arr, name);
      const totalSum = getSum(totalArray, name);
      const obj = Util.mix({}, arr[0]);

      obj['..percent'] = sum / totalSum;
      // obj[name] = totalSum;
      obj[name] = sum;

      return [ obj ];
    }
  }, Mixin));
};

module.exports = Percent;
