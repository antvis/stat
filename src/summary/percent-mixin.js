/**
 * @fileOverview 计算比例的通用类
 * @author dxq613@gmail.com
 */


const Util = require('../util');
const Frame = require('@ali/g-frame');

module.exports = {
  exec(frames) {
    const self = this;
    self.preExecute(frames);
    if (this.stat) {
      frames = this.stat.exec(frames);
    }
    const rst = [];
    const totalFrame = Frame.merge.apply(null, frames);
    const condition = self.getGroupCondition();
    const totalGroup = Frame.groupToMap(totalFrame, condition);

    Util.each(frames, function(frame) {
      let sub;
      if (self.innerCompare) {
        sub = self.execFrame(frame);
      } else {
        sub = self.execFrame(frame, totalGroup);
      }
      rst.push(sub);
    });
    return rst;
  },
  execFrame(frame, totalGroup) {
    const self = this;
    const condition = self.getGroupCondition();
    const groups = Frame.groupToMap(frame, condition);
    const rst = [];
    const dim = self.getStatDims()[0];

    Util.each(groups, function(sub, key) {
      const totalFrame = totalGroup ? totalGroup[key] : frame;
      const tmp = self.transform(sub, dim, totalFrame);
      rst.push(tmp);
    });
    return Frame.merge.apply(null, rst);
  }
};
