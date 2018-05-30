/**
 * @fileOverview summary base
 * @author dxq613@gmail.com
 */


const Stat = require('../stat');
const Util = require('../util');

/**
 * The Base Class of statist summary
 * @class Stat.Summary
 */
class Summary extends Stat {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    cfg.type = 'summary';
    return cfg;
  }

  // override get all scales which through the statistical transformation
  getStatDims() {
    const self = this;
    const dims = self.getDims();
    const length = dims.length;
    const rst = [ dims[length - 1] ];
    return rst;
  }

  // 获取分组的条件
  getGroupCondition() {
    const self = this;
    const dims = self.getDims();
    const length = dims.length;
    let condition;
    let temp = [];

    if (length > 1) {
      temp = dims.slice(0, length - 1);
      condition = [];
    }
    Util.each(temp, function(dim) {
      if (dim.indexOf('..') !== 0) { // 其他统计结果生成的字段不参与分组
        condition.push(dim);
      }
    });
    return condition;
  }

  // group frame
  groupData(array) {
    const self = this;
    let group;
    const condition = self.getGroupCondition();
    if (condition) {
      group = Util.arrayUtil.group(array, condition);
    } else {
      group = [ array ];
    }
    return group;
  }

  // transform the collection of frames,whitch groupd by dims
  transformGroup(groups, dim) {
    const self = this;
    const arr = [];
    // 分组进行统计
    Util.each(groups, function(sub) {
      arr.push(self.transform(sub, dim));
    });
    return arr;
  }

  // override
  execArray(arr) {
    const self = this;
    const dim = self.getStatDims()[0];
    const groups = self.groupData(arr);
    const arrs = self.transformGroup(groups, dim);
    // 统计完成的数据进行合并
    const mergedArray = Util.arrayUtil.merge(arrs);
    return mergedArray;
  }

  /**
   * @protected
   * transform the data array
   */
  transform(/* array ,dim */) {

  }
}

module.exports = Summary;
