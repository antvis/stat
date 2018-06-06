/**
 * @fileOverview The hex binning method partitions a space with equally spaced cutpoints
 *  __
 * /  \
 * \  /
 *  --
 * @author minnuo <audrey.tm@alipay.com>
 */

const Bin = require('./bin');
const Util = require('../util');
//
function getXOffset(arr, binWidth, ratio) {
  const rst = [];
  Util.each(arr, function(value) {
    rst.push(value * binWidth * ratio / 2);
  });
  return rst;
}

function getYOffset(arr, binWidth) {
  const rst = [];
  Util.each(arr, function(value) {
    rst.push(value * binWidth / 2);
  });
  return rst;
}

const Hex = function(dims, binWidth, ratio) {

  return new Bin({
    /**
     * the ratio of width and height,change this parameter to make a regular hexagon
     * @type {Number}
     */
    ratio: ratio || 0.5,

    dims,

    binWidth: binWidth || 0.03,

    _getDimVaues(value, dim, offsetArr) {
      const self = this;
      const range = self.getDimRange(dim);
      const spread = range.max - range.min;
      const rst = [];
      Util.each(offsetArr, function(offset) {
        rst.push(value + spread * offset);
      });
      return rst;
    },
    /**
     * find the center point of a hexagon which contain the input point
     * @param  {Object} obj the coordinate of input point
     */
    toBin(obj) {
      const self = this;
      const dims = self.getBinDims();
      if (dims.length < 2) {
        throw 'the bin.rect method only support 2 dimenssion!';
      }
      const xDim = dims[0];
      const yDim = dims[1];
      const binWidth = self.binWidth;
      const ratio = self.ratio;
      const centerPoint = self._center([ obj[xDim], obj[yDim] ]);
      const xOffsetArray = getXOffset([ -0.5, -1.5, -0.5, 0.5, 1.5, 0.5 ], binWidth, ratio);
      const yOffsetArray = getYOffset([ -1, 0, 1, 1, 0, -1 ], binWidth);
      obj[xDim] = self._getDimVaues(centerPoint[0], xDim, xOffsetArray);
      obj[yDim] = self._getDimVaues(centerPoint[1], yDim, yOffsetArray);
    },
    // 根据点和单位，求中心点
    _center(point) {
      const self = this;
      const binWidth = self.binWidth;
      const dims = self.getBinDims();
      const xDim = dims[0];
      const xRange = self.getDimRange(xDim);
      const xUnit = binWidth * (xRange.max - xRange.min) / 2;
      const yDim = dims[1];
      const yRange = self.getDimRange(yDim);
      const yUnit = binWidth * (yRange.max - yRange.min) / 2;
      const ratio = self.ratio;

      // 根据倍数处理坐标，对unit的数字和字符串类型做容错
      const _point = [ point[0] / (xUnit * ratio), point[1] / yUnit ];
      const _tempCenter = self._centerForBasis(_point);
      const _center = [ _tempCenter[0] * xUnit, _tempCenter[1] * yUnit ];

      return _center;
    },
    // 返回奇数
    _chkOdd(num) {
      const _num = parseInt(num);
      return _num ? !!(_num % 2) : '0';
    },

    // 计算点相邻的X轴范围
    _aroundX(num) {
      const self = this;
      let pointX1,
        pointX2;
      // 边界处理
      num = num < 1 ? 1 : num;

      if (self._chkOdd(num)) {
        // 如果入参是奇数,可以直接确认中心点横坐标
        pointX1 = pointX2 = parseInt(num) + 0.5;
      } else if (num % 2 === 0) {
        // 如果入参是偶数正整数,可以直接确认中心点横坐标
        pointX1 = pointX2 = parseInt(num) - 0.5;
      } else {
        // 如果是偶数，返回中心店横坐标范围
        pointX1 = parseInt(num) - 0.5;
        pointX2 = pointX1 + 2;
      }
      const scope = [ pointX1, pointX2 ];
      return scope;
    },

    // 计算点相邻的Y轴范围
    _aroundY(num) {
      // 边界处理
      num = num < 1 ? 1 : num;
      const pointY1 = parseInt(num);
      const pointY2 = pointY1 + 1;
      const scope = [ pointY1, pointY2 ];
      return scope;
    },

    _shortPoint(xScope, yScope, point) {
      const self = this;
      let center1,
        center2;
      const position = ((xScope[1] - 0.5) % 4);
      if (position === 1) {
        if (self._chkOdd(yScope[1])) {
          center1 = [ xScope[0], yScope[0] ];
          center2 = [ xScope[1], yScope[1] ];
        } else {
          center1 = [ xScope[1], yScope[0] ];
          center2 = [ xScope[0], yScope[1] ];
        }
      } else {
        if (self._chkOdd(yScope[0])) {
          center1 = [ xScope[0], yScope[0] ];
          center2 = [ xScope[1], yScope[1] ];
        } else {
          center1 = [ xScope[1], yScope[0] ];
          center2 = [ xScope[0], yScope[1] ];
        }
      }

      const n1 = Math.abs(point[0] - center1[0]) + Math.abs(point[1] - center1[1]);
      const n2 = Math.abs(point[0] - center2[0]) + Math.abs(point[1] - center2[1]);

      // 如果目标点到两中心点距离相等，取X轴小的为中心点,否则取离目标点近的点为中心
      if (n1 === n2) {
        if (center1[0] < center2[0]) {
          return center1;
        }
        return center2;

      } else if (n1 < n2) {
        return center1;
      }
      return center2;


    },

    _centerForBasis(point) {
      const self = this;
      // 输入点坐标，返回所在六边形中心点和六个顶点
      let center;
      let yScope;
      const xScope = self._aroundX(point[0]);
      let x,
        y;
      const ratio = self.ratio;

      if (xScope[0] === xScope[1]) {
        // 如果中心点X轴已经可以确认，开始计算Y轴所属范围
        x = xScope[0];
        if (x > 2 && self._chkOdd(x / 2)) {
          // 如果x在3,7,11……数列范围里
          // 边界处理
          point[1] = point[1] < 1 ? 1 : point[1];

          if (self._chkOdd(parseInt(point[1]))) {
            y = parseInt(point[1]) + 1;
          } else {
            y = parseInt(point[1]);
          }
        } else {
          // 如果x在1，5，9……数列范围里
          point[1] = point[1] < 1 ? 1 : point[1];
          if (self._chkOdd(parseInt(point[1]))) {
            y = parseInt(point[1]);
          } else {
            y = parseInt(point[1]) - 1;
          }
        }
        center = [ x, y ];
      } else {
        // 如果中心点X轴不能确认，开始计算范围
        // 边界处理
        point[1] = point[1] < 1 ? 1 : point[1];

        // 计算Y轴的范围
        yScope = self._aroundY(point[1]);
        // 根据目标点到周围2个中点的距离求出最短坐标，同等情况下，取XY轴小的点
        center = self._shortPoint(xScope, yScope, point);

      }
      center[0] = center[0] * ratio;
      return center;
    }
  });
};

module.exports = Hex;
