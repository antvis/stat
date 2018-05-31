const Util = {
  each: require('@antv/util/src/each'),
  mix: require('@antv/util/src/mix'),
  isString: require('@antv/util/src/type/isString'),
  isFunction: require('@antv/util/src/type/isFunction'),
  isNil: require('@antv/util/src/type/isNil'),
  isArray: require('@antv/util/src/type/isArray'),
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
    const rst = [];
    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      const value = obj[field];
      if (!Util.isNil(value)) {
        if (!Util.isArray(value)) {
          rst.push(value);
        } else {
          rst.concat(value);
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
