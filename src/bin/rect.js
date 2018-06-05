/**
 * @fileOverview The rect binning method partitions a space with equally spaced cutpoints
 * @author dxq613@gmail.com
 * 4-3
 * | |
 * 1-2
 */

const Bin = require('./bin');

const Rect = function(dims, binWidth) {
  return new Bin({
    dims,
    binWidth,
    // parse to bin
    toBin(obj) {
      const self = this;
      const dims = self.getBinDims();
      // var binWidth = self.getBinWidth();
      if (dims.length < 1) { // 仅支持1，2维
        throw 'the bin.rect method support for minimum one dimension!';
      }
      if (dims.length === 1) { // 只处理一维的情况
        const dim = dims[0];
        obj[dim] = self._getValueRange(dim, obj[dim]);
      } else {
        const dimX = dims[0];
        const dimY = dims[1]; // 为了便于理解，所以使用x,y
        const xValueRange = self._getValueRange(dimX, obj[dimX]);
        const yValueRange = self._getValueRange(dimY, obj[dimY]);
        obj[dimX] = [ xValueRange[0], xValueRange[0], xValueRange[1], xValueRange[1] ];
        obj[dimY] = [ yValueRange[0], yValueRange[1], yValueRange[1], yValueRange[0] ];
      }
    },
    _getValueRange(dim, value) {
      const self = this;
      const binWidth = self.binWidth;
      const range = self.getDimRange(dim);
      const spread = range.max - range.min;
      const center = self.getCenterValue(value, range.max, range.min);
      return [ center - spread * binWidth * 1 / 2, center + spread * binWidth * 1 / 2 ];
    }
  });
};

module.exports = Rect;
