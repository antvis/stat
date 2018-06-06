const Util = {
  each: require('@antv/util/lib/each'),
  mix: require('@antv/util/lib/mix'),
  isString: require('@antv/util/lib/type/isString'),
  isFunction: require('@antv/util/lib/type/isFunction'),
  isNil: require('@antv/util/lib/type/isNil'),
  isArray: require('@antv/util/lib/type/isArray'),
  merge(dataArray) {
    let rst = [];
    for (let i = 0; i < dataArray.length; i++) {
      rst = rst.concat(dataArray[i]);
    }
    return rst;
  },
  group(array, condition) {
    if (!condition) {
      return [ array ];
    }
    const groups = groupToMap(array, condition);
    const arrays = [];
    for (const i in groups) {
      if (groups.hasOwnProperty(i)) {
        arrays.push(groups[i]);
      }
    }
    return arrays;
  },
  colValues(data, field) {
    let rst = [];
    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      const value = obj[field];
      if (!Util.isNil(value)) {
        if (!Util.isArray(value)) {
          rst.push(value);
        } else {
          rst = rst.concat(value);
        }
      }
    }
    return rst;
  },
  sort(array, field) {
    return array.sort(function(obj1, obj2) {
      return obj1[field] - obj2[field];
    });
  },
  range(array, field) {
    let max = -Infinity;
    let min = Infinity;
    for (let i = 0; i < array.length; i++) {
      const obj = array[i];
      if (obj && !Util.isNil(obj[field])) {
        const value = obj[field];
        if (value > max) {
          max = value;
        }
        if (value < min) {
          min = value;
        }
      }
    }
    if (max < min) {
      min = max;
    }
    return [ min, max ];
  },
  groupToMap
};


// 对数据进行分组
function groupToMap(array, condition) {
  const groups = {};

  if (!condition) {
    return {
      0: array
    };
  }

  if (!Util.isFunction(condition)) {
    const paramsCondition = condition;
    condition = function(row) {
      let unique = '';
      for (let i = 0, l = paramsCondition.length; i < l; i++) {
        unique += row[paramsCondition[i]].toString();
      }
      return unique;
    };
  }

  Util.each(array, function(row) {
    const key = condition(row);
    if (groups[key]) {
      groups[key].push(row);
    } else {
      groups[key] = [ row ];
    }
  });

  return groups;
}

module.exports = Util;
