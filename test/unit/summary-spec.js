const expect = require('chai').expect;
const Util = require('../../src/util');
const summary = require('../../src/summary/index');

describe('test summary', () => {
  const data = [
    { x: 'red', y: 1, z: '1' },
    { x: 'red', y: 2, z: '2' },
    { x: 'red', y: 3, z: '4' },
    { x: 'red', y: 4, z: '1' },

    { x: 'blue', y: 1, z: '3' },
    { x: 'blue', y: 2, z: '1' },
    { x: 'blue', y: 3, z: '2' },
    { x: 'blue', y: 4, z: '4' },
    { x: 'blue', y: 5, z: '2' },

    { x: 'yellow', y: 1, z: '4' },
    { x: 'yellow', y: 2, z: '3' },
    { x: 'yellow', y: 3, z: '1' },
    { x: 'yellow', y: 4, z: '2' },
    { x: 'yellow', y: 5, z: '1' },
    { x: 'yellow', y: 6, z: '1' },
    { x: 'yellow', y: 2, z: '2' }

  ];

  describe('count', () => {
    it('dims', function() {
      const stat = summary.count('x');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
      expect(stat.dims.length).equal(2);

      expect(stat.dims.indexOf('..count')).equal(1);
    });

    it('no dim', function() {
      const stat = summary.count();
      stat.init();

      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(1);
      expect(nf[0]['..count']).equal(data.length);
      expect(stat.dims.indexOf('..count')).equal(0);
    });

    it('three dim', function() {
      const stat = summary.count('x*z');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(11);
    });

    it('multiple datas', function() {
      const dataArray = Util.arrayUtil.group(data, 'z');
      const stat = summary.count('x');
      stat.init();
      const nfs = stat.exec(dataArray);
      expect(nfs.length).equal(dataArray.length);
    });
  });

  describe('aggregate', () => {
    it('max', function() {
      const stat = summary.max('x*y');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
      expect(nf[0].y).equal(4);
    });

    it('min', function() {
      const stat = summary.min('x*y');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
      expect(nf[0].y).equal(1);
    });

    it('sum', function() {
      const stat = summary.sum('x*y');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
      expect(nf[0].y).equal(10);
    });

    it('mean', function() {
      const stat = summary.mean('x*y');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
      expect(nf[0].y).equal(2.5);
    });
    it('range', function() {
      const stat = summary.range('x*y');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
      // expect(nf[2].y[0]).equal(1);
      expect(nf[2].y).equal(5);
    });

    it('sd', function() {
      const stat = summary.sd('x*y');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
    });

    it('mode', function() {
      const stat = summary.mode('y');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(1);
      expect(nf[0].y).equal(2);
    });

    it('cumulative', function() {
      const stat = summary.cumulative('x*y');
      stat.init();
      const nfs = stat.exec([ data ]);
      const nf = nfs[0];
      expect(nf[2].y).equal(6);

    });

    it('count cumulative', function() {
      const stat = summary.cumulative(summary.count('x'));
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
    });
  });

  describe('percent', () => {
    it('proportion', function() {
      const stat = summary.proportion('x');
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf.length).equal(3);
    });

    it('group proportion', function() {

      const dataArray = Util.arrayUtil.group(data, [ 'z' ]);
      const stat = summary.proportion('x');
      stat.init();
      const nf = stat.exec(dataArray)[0];
      expect(nf.length).equal(3);
      expect(nf[0]['..proportion']).equal(0.5);
    });

    it('proportion multiple dim', function() {
      const stat = summary.proportion('x*z', true);
      stat.init();
      const nf = stat.exec([ data ])[0];
      expect(nf[0]['..proportion']).equal(0.125);
    });


    it('percent', function() {

      const stat = summary.percent('x*y');
      stat.init();
      const dataArray = Util.arrayUtil.group(data, [ 'z' ]);
      const nf = stat.exec(dataArray)[0];
      expect(nf[0]['..percent']).equal(0.5);
    });
  });

});
