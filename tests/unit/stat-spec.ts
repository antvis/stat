
import Stat from '../../src/stat';
import {sum} from '../../src/statistics';
import {colValues} from '../../src/util';

class Sum extends Stat {
  protected execArray(arr) {
    const dims = this.dims;
    const asDim = this.as;
    const field = dims[0];
    const asField = asDim ? asDim[0] : field;
    const values = colValues(arr, field);
    const first = arr[0];
    const obj = {};
    Object.assign(obj, first);
    obj[asField] = sum(values);
    return [
      obj
    ];
  }
}

describe('test base stat', () => {
  const stat = new Sum({
    dims: ['value']
  });
  stat.init();
  const data = [
    [
      {name: '1', value: 2, type: '1'},
      {name: '2', value: 4, type: '1'},
      {name: '3', value: 5, type: '1'},
    ],
    [
      {name: '1', value: 1, type: '2'},
      {name: '2', value: 3, type: '2'},
      {name: '3', value: 2, type: '2'},
    ]
  ]
  it('test sum', () => {
    const rst = stat.execute(data);
    expect(rst[0][0].value).toBe(11);
    expect(rst[0][0]).toEqual({name: '1', value: 11, type: '1'});
    expect(rst[1][0].value).toBe(6);
  });
});