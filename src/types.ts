export interface StatCfg {
  /**
   * 作用到的字段名
   */
  dims: string[];
  // 扩展任意属性
  [key: string]: any;
}
