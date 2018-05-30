const Summary = require('./summary');

require('./aggregate');
Summary.cumulative = require('./cumulative');

/*
{
  proportion: require('./proportion'),
  percent: require('./percent')


};*/

module.exports = Summary;
