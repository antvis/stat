/**
 * @fileOverview the method of partitions a space with point
 * @author dxq613@gmail.com
 */


const Bin = require('./bin');

const Dot = function(dims, binWidth) {
  return new Bin({
    dims,
    binWidth
  });
};

module.exports = Dot;
