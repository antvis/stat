/**
 * @fileOverview 四分位
 * @author dxq613@gmail.com
 */

const Quantile = require('./quantile');

const Letter = function(dims, binWidth) {
  return new Quantile({
    dims,
    binWidth,
    fractions: 4
  });
};

module.exports = Letter;
