/**
 * @fileOverview 计算比例的通用类
 * @author dxq613@gmail.com
 */


const Util = require('../util');

module.exports = {
  exec(arrs) {
    const self = this;
    self.preExecute(arrs);
    if (this.stat) {
      arrs = this.stat.exec(arrs);
    }
    const rst = [];
    const totalData = Util.merge(arrs);
    const condition = self.getGroupCondition();
    const totalGroup = Util.groupToMap(totalData, condition);

    Util.each(arrs, function(arr) {
      let sub;
      if (self.innerCompare) {
        sub = self.execArray(arr);
      } else {
        sub = self.execArray(arr, totalGroup);
      }
      rst.push(sub);
    });
    return rst;
  },
  execArray(arr, totalGroup) {
    const self = this;
    const condition = self.getGroupCondition();
    const groups = Util.groupToMap(arr, condition);
    const rst = [];
    const dim = self.getStatDims()[0];

    Util.each(groups, function(sub, key) {
      const totalData = totalGroup ? totalGroup[key] : arr;
      const tmp = self.transform(sub, dim, totalData);
      rst.push(tmp);
    });
    return Util.merge(rst);
  }
};
