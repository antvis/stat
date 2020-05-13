export interface IStat {
  /**
   * 初始化
   */
  init();

  /**
   * 执行统计
   * @param data 数据
   */
  execute(data: any[][]): any[][];
}
