/**
 * @fileOverview 累计统计函数
 * @author dxq613@gmail.com
 */

const Summary = require('./summary');
const Util = require('../util');

const Cumulative = function(dims) {

  return new Summary({
    dims,
    getStatDims() {
      const stat = this.stat;
      if (stat) {
        return stat.getStatDims();
      }
      const dims = this.getDims();
      const length = dims.length;
      const rst = [ dims[length - 1] ];
      return rst;
    },
    execArray(array) {
      const statDims = this.getStatDims();
      const dim = statDims[statDims.length - 1];
      const rst = [];
      const sortDim = this.getDims()[0];
      // 按照数值类型的第一个字段进行排序，防止累积出现问题
      if (array.length && sortDim && sortDim !== dim && !Util.isString(array[0][sortDim])) {
        array = Util.sort(array, sortDim);
      }
      let cum = 0;
      Util.each(array, function(obj) {
        const tmp = Util.mix({}, obj);
        cum += obj[dim];
        tmp[dim] = cum;
        rst.push(tmp);
      });
      return rst;
    }

  });
};

module.exports = Cumulative;
