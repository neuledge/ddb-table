import 'mocha';
import { assert } from 'chai';
import { TableKey } from './TableIndex';

interface DemoItem {
  Id: string;
  Ver: number;
  foo: number;
  inner: {
    obj: string;
  };
  maybe?: boolean;
  hidden: boolean;
}

describe('TableIndex', () => {
  it('TableKey type', () => {
    assert.ok<TableKey<DemoItem, 'Id'>>({
      Id: 'foo',
    });

    assert.ok<TableKey<DemoItem, 'Id', 'Ver'>>({
      Id: 'foo',
      Ver: 1,
    });
  });
});
