import 'mocha';
import { assert } from 'chai';
import TableIndex, { TableKey } from './TableIndex';

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

  describe('.scan()', () => {
    it('Basic use case', () => {
      const table = new TableIndex<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
      });

      assert.deepEqual(
        table
          .scan()
          .filter((cn) => cn.nq('hidden', true))
          .select('ALL_ATTRIBUTES')
          .limit(20)
          .startKey({ Id: '111', Ver: 5 })
          .serialize(),
        {
          TableName: 'MyTable',
          FilterExpression: '#hidden <> :hidden',
          IndexName: undefined,
          ExpressionAttributeNames: {
            '#hidden': 'hidden',
          },
          ExpressionAttributeValues: {
            ':hidden': true,
          },
          ProjectionExpression: undefined,
          Select: 'ALL_ATTRIBUTES',
          Limit: 20,
          ExclusiveStartKey: {
            Id: '111',
            Ver: 5,
          },
        },
      );
    });
  });

  describe('.query()', () => {
    it('Basic use case', () => {
      const table = new TableIndex<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
      });

      assert.deepEqual(
        table
          .query()
          .keyCondition((cn) => cn.eq('Id', '123').and((cn) => cn.gt('Ver', 5)))
          .project({ inner: 1 })
          .reverseIndex()
          .serialize(),
        {
          TableName: 'MyTable',
          KeyConditionExpression: '#Id = :Id AND #Ver > :Ver',
          IndexName: undefined,
          ExpressionAttributeNames: {
            '#Id': 'Id',
            '#Ver': 'Ver',
            '#inner': 'inner',
          },
          ExpressionAttributeValues: {
            ':Id': '123',
            ':Ver': 5,
          },
          ProjectionExpression: '#inner',
          FilterExpression: undefined,
          ScanIndexForward: false,
        },
      );
    });
  });
});
