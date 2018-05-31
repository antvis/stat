/**
 * @fileOverview The sum of statistical data
 * @author dxq613@gmail.com
 */

const Util = require('../util');
const Summary = require('./summary');
const aggregates = [ 'sum', 'mean', 'max', 'min', 'mode', 'median', 'variance' ];
const Statistic = require('../statistics');

class Aggregate extends Summary {

  getAggregateValue(values) {
    return Statistic[this.aggregateType](values);
  }

  transform(array, dim) {
    const rst = [];
    if (this.aggregateType && array.length) {
      const obj = Util.mix({}, array[0]);
      const values = Util.colValues(array, dim);
      obj[dim] = this.getAggregateValue(values);
      rst.push(obj);
    }
    return rst;
  }

}

function createFunction(type) {
  return function(dims) {
    return new Aggregate({
      dims,
      aggregateType: type
    });
  };
}
// 批量添加统计函数
aggregates.forEach(function(type) {
  Summary[type] = createFunction(type);
});

Summary.sd = createFunction('standardDeviation');

Summary.count = function(dims) {
  return new Aggregate({
    dims,
    initDims(dims) {
      dims.push('..count');
    },
    transform(array, dim) {
      const obj = Util.mix({}, array[0]);
      obj[dim] = array.length;
      return [ obj ];
    }
  });
};

Summary.range = function(dims) {
  return new Aggregate({
    dims,
    aggregateType: 'range',
    getAggregateValue(values) {
      return Statistic.max(values) - Statistic.min(values);
    }
  });
};

module.exports = Aggregate;

