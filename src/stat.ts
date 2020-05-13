import { IStat } from './interfaces';
import { each } from './util';
class Stat implements IStat {
  public dims: string[] = [];
  public as: string[] = null;
  private cfg = null;

  constructor(cfg) {
    this.cfg = cfg;
  }

  public init() {
    // 将 cfg 的属性附加到自身
    Object.assign(this, this.cfg);
  }

  public execute(data: any[][]): any[][] {
    this.preExecute(data);
    const rst = [];
    each(data, (arr) => {
      rst.push(this.execArray(arr));
    });
    return rst;
  }

  /**
   * @protected
   * 执行前的一些操作
   * @param data 数据
   */
  protected preExecute(data: any[][]) {}

  /**
   * @protected
   * 对单个数组进行统计
   * @param arr 数组
   */
  protected execArray(arr: any[]) {
    return arr;
  }
}

export default Stat;
