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

  // describe('.createNamesMap()', () => {
  //   it('Basic use case', () => {
  //     const table = new TableIndex<DemoItem, 'Id'>({
  //       tableName: 'MyTable',
  //       primaryKey: 'Id',
  //     });
  //
  //     const names = table.createNamesMap();
  //
  //     assert.equal(names.add('foo'), '#foo');
  //     assert.deepEqual(names.serialize(), {
  //       '#foo': 'foo',
  //     });
  //   });
  // });

  // describe('.createValuesMap()', () => {
  //   it('Basic use case', () => {
  //     const table = new TableIndex<DemoItem, 'Id'>({
  //       tableName: 'MyTable',
  //       primaryKey: 'Id',
  //     });
  //
  //     const values = table.createValuesMap();
  //
  //     assert.equal(values.add('foo', 3), ':foo');
  //     assert.deepEqual(values.serialize(), {
  //       ':foo': 3,
  //     });
  //   });
  // });

  describe('.scan()', () => {
    it('Basic use case', () => {
      const table = new TableIndex<DemoItem, 'Id'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
      });

      assert.deepEqual(table.scan().serialize(), {
        TableName: 'MyTable',
      });
    });

    it('Full use case', () => {
      const table = new TableIndex<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        indexName: 'Test',
      });

      assert.deepEqual(
        table
          .scan()
          .filter((cn) => cn.nq('hidden', true))
          .select('ALL_ATTRIBUTES')
          .limit(20)
          .startKey({ Id: '111', Ver: 5 })
          .project({ inner: 1 })
          .segment(1, 10)
          .serialize(),
        {
          TableName: 'MyTable',
          FilterExpression: '#hidden <> :hidden',
          IndexName: 'Test',
          ExpressionAttributeNames: {
            '#hidden': 'hidden',
            '#inner': 'inner',
          },
          ExpressionAttributeValues: {
            ':hidden': true,
          },
          ProjectionExpression: '#inner',
          Select: 'ALL_ATTRIBUTES',
          Limit: 20,
          ExclusiveStartKey: {
            Id: '111',
            Ver: 5,
          },
          Segment: 1,
          TotalSegments: 10,
        },
      );
    });

    it('Empty startKey', () => {
      const table = new TableIndex<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        indexName: 'Test',
      });

      assert.deepEqual(
        table.scan().startKey({ Id: '111', Ver: 5 }).startKey(null).serialize(),
        {
          TableName: 'MyTable',
          IndexName: 'Test',
        },
      );
    });
  });

  describe('.query()', () => {
    it('Basic use case', () => {
      const table = new TableIndex<DemoItem, 'Id'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
      });

      assert.deepEqual(
        table
          .query()
          .keyCondition((cn) => cn.eq('Id', '123'))
          .serialize(),
        {
          TableName: 'MyTable',
          KeyConditionExpression: '#Id = :Id',
          ExpressionAttributeNames: {
            '#Id': 'Id',
          },
          ExpressionAttributeValues: {
            ':Id': '123',
          },
        },
      );
    });

    it('Full use case', () => {
      const table = new TableIndex<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        indexName: 'Test',
      });

      assert.deepEqual(
        table
          .query()
          .keyCondition((cn) => cn.eq('Id', '123').and((cn) => cn.gt('Ver', 5)))
          .project({ inner: 1 })
          .reverseIndex()
          .calcCapacity('TOTAL')
          .extend({
            ConsistentRead: true,
          })
          .serialize(),
        {
          TableName: 'MyTable',
          KeyConditionExpression: '#Id = :Id AND #Ver > :Ver',
          IndexName: 'Test',
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
          ScanIndexForward: false,
          ReturnConsumedCapacity: 'TOTAL',
          ConsistentRead: true,
        },
      );
    });
  });
});
