/**
 * @fileOverview 分位值计算
 * @author dxq613@gmail.com
 */


const Util = require('../../util');
const Bin = require('../bin');
const Statistics = require('../../statistics');

/**
 * 分位数
 * @class Stat.Bin.Quantile
 */
class Quantile extends Bin {

  execArray(array) {
    const self = this;
    const data = [];
    // var names = self.getDims();
    Util.each(array, function(obj) {
      const tmpObject = Util.mix({}, obj);
      self.toBin(tmpObject); // 防止修改原始数据
      data.push(tmpObject);
    });

    return self.execQuantile(data);
  }

  getSplitArray() {
    const self = this;
    const fractions = self.fractions;
    const rst = [];
    const step = 1 / fractions;

    for (let i = 0; i <= 1; i = i + step) {
      rst.push(i);
    }
    return rst;
  }
  execQuantile(array) {
    const self = this;
    const data = [];
    const dims = self.getDims();
    const dim = dims[dims.length - 1];
    const names = dims.slice(0, dims.length - 1); // 取除了第一个之外的字段
    const groups = Util.group(array, names);
    const splitArray = self.getSplitArray();
    Util.each(groups, function(sub) {
      const first = Util.mix({}, sub[0]);
      const values = Util.colValues(sub, dim);
      const tmp = [];

      const length = splitArray.length;
      for (let i = 0; i < length; i++) {
        tmp.push(Statistics.quantile(values, splitArray[i]));
      }
      first[dim] = tmp;

      data.push(first);
    });

    return data;
  }
}


module.exports = Quantile;
