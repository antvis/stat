const expect = require('chai').expect;
const Stat = require('../../src/index');
const Util = require('../../src/util');

describe('stat bin', function() {
  const data = [];
  for (let i = 0; i <= 100; i++) {
    data.push({
      x: i,
      y: i
    });
  }

  describe('bin', function() {
    const stat = Stat.bin.dot('x', 0.1);
    stat.init();
    it('bin init', function() {
      expect(stat.isStat).equal(true);
      expect(stat.type).equal('bin');
    });

    it('bin exec', function() {
      const nf = stat.exec([ data ])[0];
      const group = Util.group(nf, 'x');
      expect(group.length).equal(10);
    });

  });

  describe('bin rect', function() {
    const stat = Stat.bin.rect('x*y', 0.1);
    stat.init();
    const nf = stat.exec([ data ])[0];
    // expect(nf.length).equal(10);

    it('bin region', function() {
      expect(nf[0].x.length).equal(4);
      expect(nf[0].y.length).equal(4);
    });

    it('bin value', function() {
      const obj = nf[91];
      /* var box = stat.getBinBox({
        x: 91,
        y: 91
      });*/
      expect(obj.x[0]).equal(90);
      expect(obj.y[0]).equal(90);

      expect(obj.x[1]).equal(90);
      expect(obj.y[2]).equal(100);
    });
    it('bin one dim', function() {
      const stat1 = Stat.bin.rect('x', 0.1);
      stat1.init();

      const n1 = stat1.exec([ data ])[0];
      expect(n1[0].x.length).equal(2);
      const obj = n1[91];
      expect(obj.x[0]).equal(90);
      expect(obj.y).equal(91);
    });
  });

  describe('bin quantile', function() {
    it('letter', function() {
      const data1 = [];
      for (let i = 0; i < 100; i++) {
        const obj = {
          x: parseInt(i / 10),
          y: i % 10
        };
        data1.push(obj);
      }
      const stat = Stat.bin.quantile.letter('x*y', 0.1);
      stat.init();
      stat.binDims = [ 'x' ];
      const nf = stat.exec([ data1 ])[0];
      expect(nf.length).equal(10);
      expect(nf[0].y).eqls([ 0, 2, 4.5, 7, 9 ]);
      // console.log(nf.s());
    });

  });

  describe('bin hex', function() {
    const stat = Stat.bin.hex('x*y', 0.1);
    stat.init();

    const nf = stat.exec([ data ])[0];

    it('bin group', function() {
      const group = Util.group(nf, [ 'x', 'y' ]);
      expect(group.length < 100).equal(true);
    });

    it('bin value', function() {
      const first = nf[0];
      expect(first.x.length).equal(6);
      expect(first.x.length).equal(6);
    });

  });
});
