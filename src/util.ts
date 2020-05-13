export { default as each } from '@antv/util/lib/each';
export { default as mix } from '@antv/util/lib/mix';
export { default as isString } from '@antv/util/lib/is-string';
export { default as isFunction } from '@antv/util/lib/is-function';
import isArray from '@antv/util/lib/is-array';
import isNil from '@antv/util/lib/is-nil';

export function colValues(data, field) {
  let rst = [];
  for (const obj of data) {
    const value = obj[field];
    if (!isNil(value)) {
      if (!isArray(value)) {
        rst.push(value);
      } else {
        rst = rst.concat(value);
      }
    }
  }
  return rst;
}

export { isNil, isArray };
