/**
 * @fileOverview bin base
 * @author dxq613@gmail.com
 */

const Util = require('../util');
const Stat = require('../stat');

/**
 * The bin methods partition a space
 * @class Stat.Bin
 * @extends {Stat}
 */
class Bin extends Stat {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    cfg.binWidth = 0.03;
    cfg.type = 'bin';
    cfg.colRange = {};
    cfg.binDims = null;
    return cfg;
  }
  /**
   * 设置字段的范围
   * @param {String} dim  字段
   * @param {Array} range 最小值、最大值
   */
  setRange(dim, range) {
    this.colRange[dim] = range;
  }

  // override
  getStatDims() {
    return this.getDims();
  }

  getBinDims() {
    const dims = this.binDims || this.getDims();
    const rst = [];
    Util.each(dims, function(dim) { // 统计生成的变量，不在参加bin统计
      if (dim.indexOf('..') === -1) {
        rst.push(dim);
      }
    });
    return rst;
  }

  /**
   * get the bin width of the stat
   * @return {Number} bin width
   */
  getBinWidth() {
    return this.binWidth;
  }

  // 获取在一个binWidth 范围内的中心点
  getCenterValue(value, max, min) {
    const binWidth = this.getBinWidth();
    let percent = (value - min) / (max - min);
    if (percent === 1) { // 临界值处理,保证最大值落在0-1之间
      percent = percent - binWidth / 4;
    }
    const rst = (max - min) * (Math.floor(percent / binWidth) * binWidth + binWidth / 2) + min;
    return rst;
  }

  // parse to bin
  toBin(obj) {
    const self = this;
    const dims = self.getBinDims();
    for (let i = 0; i < dims.length; i++) {
      const dim = dims[i];
      const value = obj[dim];
      const range = self.getDimRange(dim);
      obj[dim] = self.getCenterValue(value, range.max, range.min);
    }
  }

  // get dim range,max and min
  getDimRange(dim) {
    const self = this;
    const cacheRange = self.cacheRange;
    return cacheRange[dim] || { min: 0, max: 0 };
  }

  // override, to calculate the range of dims
  preExecute(arrays) {
    const self = this;
    const mergeArray = Util.merge(arrays);
    const dims = self.getStatDims();
    const colRange = self.colRange;
    const cacheRange = {};

    Util.each(dims, function(dim) {
      if (colRange[dim]) {
        cacheRange[dim] = colRange[dim];
      } else {
        const range = Util.range(mergeArray, dim);
        cacheRange[dim] = {
          min: range[0],
          max: range[1]
        };
      }
    });
    self.cacheRange = cacheRange;
  }

  execArray(arr) {
    const self = this;
    const data = [];
    // var names = self.getDims();
    Util.each(arr, function(obj) {
      const tmpObject = Util.mix({}, obj);
      self.toBin(tmpObject); // 防止修改原始数据
      data.push(tmpObject);
    });

    return data;
  }

  /**
   * @protected
   * get the region in the scale,the percent of the dimension
   * @return {Object} get the region of bin
   */
  getRegion() {
    return [{
      x: 0,
      y: 0
    }];
  }

}

module.exports = Bin;
