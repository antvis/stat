const Summary = require('./summary');

require('./aggregate');
Summary.cumulative = require('./cumulative');
Summary.proportion = require('./proportion');
Summary.percent = require('./percent');

module.exports = Summary;
