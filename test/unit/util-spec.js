const expect = require('chai').expect;
const Util = require('../../src/util');
const Statistics = require('../../src/statistics');


describe('test util array', () => {

  it('test merge', function() {
    const arr1 = [ 'a', 'b', 'c' ];
    const arr2 = [ 'd', 'e', 'f' ];
    const rst = Util.merge([ arr1, arr2 ]);
    expect(rst.length).equal(6);
  });

  it('group by arr', function() {
    const data = [
      { x: [ 1, 2 ], y: 10 },
      { x: [ 3, 4 ], y: 8 },

      { x: [ 1, 2 ], y: 4 },
      { x: [ 3, 4 ], y: 7 }
    ];
    const groups = Util.group(data, [ 'x' ]);
    expect(groups.length).equal(2);
    expect(Util.group(data).length).equal(1);

  });
  it('colValues', function() {
    const data = [
      { x: [ 1, 2 ], y: 10 },
      { x: [ 3, 4 ], y: 8 },

      { x: [ 1, 2 ], y: 4 },
      { x: [ 3, 4 ], y: 7 },
      { x: null, y: null }
    ];
    expect(Util.colValues(data, 'x').length).eqls(8);
    expect(Util.colValues(data, 'y')).eqls([ 10, 8, 4, 7 ]);
  });
  it('range', function() {
    const data = [
      { x: 1, y: 1 },
      { x: 5, y: 2 },
      { x: 3, y: 10 },
      { x: 6, y: 0 },
      { x: null, y: null }
    ];
    expect(Util.range(data, 'x')).eqls([ 1, 6 ]);
    expect(Util.range(data, 'y')).eqls([ 0, 10 ]);
    expect(Util.range([], 'x')).eqls([ -Infinity, -Infinity ]);
  });
  it('sort', function() {
    const data = [
      { x: 1, y: 1 },
      { x: 5, y: 2 },
      { x: 3, y: 10 },
      { x: 6, y: 0 }
    ];
    Util.sort(data, 'x');
    expect(data[1].x).equal(3);
  });

  it('test group', () => {
    const data = [
      { name: 453, carat: 0.71, cut: 'Ideal', color: 'I', clarity: 'VVS2', depth: 60.2, table: 56, price: 2817, x: 5.84, y: 5.89, z: 3.53 },
      { name: 662, carat: 0.72, cut: 'VeryGood', color: 'F', clarity: 'VS1', depth: 60.2, table: 59, price: 2846, x: 5.79, y: 5.84, z: 3.5 },
      { name: 499, carat: 0.7, cut: 'Ideal', color: 'D', clarity: 'SI1', depth: 60.7, table: 56, price: 2822, x: 5.75, y: 5.72, z: 3.48 },
      { name: 235, carat: 0.64, cut: 'Ideal', color: 'D', clarity: 'VS1', depth: 61.5, table: 56, price: 2787, x: 5.54, y: 5.55, z: 3.41 },
      { name: 280, carat: 0.72, cut: 'Good', color: 'F', clarity: 'VS1', depth: 60.7, table: 60, price: 2795, x: 5.74, y: 5.72, z: 3.48 },
      { name: 87, carat: 0.24, cut: 'Premium', color: 'H', clarity: 'VVS1', depth: 61.2, table: 58, price: 554, x: 4.01, y: 3.96, z: 2.44 },
      { name: 574, carat: 0.85, cut: 'Ideal', color: 'H', clarity: 'SI2', depth: 62.5, table: 57, price: 2833, x: 6.02, y: 6.07, z: 3.78 },
      { name: 251, carat: 0.55, cut: 'Ideal', color: 'G', clarity: 'IF', depth: 60.9, table: 57, price: 2789, x: 5.28, y: 5.3, z: 3.22 },
      { name: 206, carat: 0.78, cut: 'Premium', color: 'F', clarity: 'SI1', depth: 62.4, table: 58, price: 2777, x: 5.83, y: 5.8, z: 3.63 },
      { name: 507, carat: 0.7, cut: 'Ideal', color: 'D', clarity: 'SI1', depth: 61.8, table: 56, price: 2822, x: 5.73, y: 5.63, z: 3.51 }
    ];
    expect(Util.group(data, [ 'cut' ]).length).equal(4);
    expect(Util.group(data, [ 'cut', 'color' ]).length).equal(8);
  });

  it('test group map', () => {
    const groups = Util.groupToMap([]);
    expect(groups[0]).eqls([]);
  });

  it('stat method', () => {
    expect(Statistics.min).not.equal(undefined);
  });

});
