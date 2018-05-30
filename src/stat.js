/**
 * @fileOverview Base Statistical functions
 * @author dxq613@gmail.com
 */

const Util = require('./util');

/**
 * 处理度量的统计函数
 * @class Stat
 */
class Stat {

  getDefaultCfg() {
    return {
      /**
       * 是否是统计对象
       * @type {Boolean}
       */
      isStat: true
    };
  }

  constructor(cfg) {
    Util.mix(this, this.getDefaultCfg(), cfg);
  }

  initDims(/* dims*/) {

  }

  /**
   * 统计对象关联的字段
   * @return {Array} 关联字段
   */
  getDims() {
    return this.dims;
  }

  getStatDims() {
    return this.getDims();
  }

  /**
   * 初始化统计对象
   * @chainable
   */
  init() {
    const self = this;
    let dims = self.dims;

    // 划分dims，当前版本仅支持 cross : 'x*y'
    if (Util.isString(dims)) {
      dims = dims.split('*');
      self.dims = dims;
    }
    // 嵌套统计函数
    if (dims && dims.isStat) {
      const nstat = dims;
      nstat.init();
      self.stat = nstat;
      dims = nstat.dims;
      self.dims = dims;
    }

    if (!dims) {
      dims = [];
      self.dims = dims;
    }
    self.initDims(dims);
  }

  /**
   * @protected
   * some thing to do before stat exec
   */
  preExecute(/* arrs*/) {

  }

  /**
   * Perform statistical transform
   * @param  {Array} arrs A collection of data arr
   * @return {Array} The transform of collection
   */
  exec(arrs) {
    const self = this;
    self.preExecute(arrs);
    const rst = [];
    if (this.stat) {
      arrs = this.stat.exec(arrs);
    }
    Util.each(arrs, function(arr) {
      const execResult = self.execArray(arr, arrs);
      rst.push(execResult);

      /* if (Util.isArray(execResult)) {
        rst = rst.concat(execResult);
      } else {
      } */
    });
    return rst;
  }

  /**
   * Execute each Frame
   * @protected
   * @param  {Array} arr data frame for translate
   * @return {Array} 处理后的数组，注意不要改变原始数据源的信息
   */
  execArray(arr/* ,frames*/) {
    return arr;
  }

}


module.exports = Stat;
