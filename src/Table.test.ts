import 'mocha';
import { assert } from 'chai';
import Table from './Table';
import { GetQuery } from './queries';
import { TableKey } from './TableIndex';

interface DemoItem {
  Id: string;
  Ver: number;
  foo: number;
  inner: {
    obj: string;
  };
  set?: Set<string>;
  maybe?: boolean;
  hidden: boolean;
}

type DemoIndex = Pick<DemoItem, 'Id' | 'foo' | 'maybe'>;

describe('Table', () => {
  describe('.index()', () => {
    it('Basic Usage', () => {
      const table = new Table<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        documentClient: null as never,
      });

      const index = table.index<DemoIndex, 'Id', 'foo'>('Id-foo', 'Id', 'foo');

      assert.deepEqual(index.scan().serialize(), {
        TableName: 'MyTable',
        IndexName: 'Id-foo',
      });
    });
  });

  describe('.put()', () => {
    it('Basic Usage', () => {
      const table = new Table<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        documentClient: null as never,
      });

      assert.deepEqual(
        table
          .put({
            Id: '12',
            Ver: 2,
            foo: 12.33,
            inner: {
              obj: 'foo',
            },
            hidden: false,
          })
          .condition((cn) => cn.attributeNotExists('Id'))
          .return('NONE')
          .serialize(),
        {
          TableName: 'MyTable',
          ConditionExpression: 'attribute_not_exists(#Id)',
          ExpressionAttributeNames: {
            '#Id': 'Id',
          },
          Item: {
            Id: '12',
            Ver: 2,
            foo: 12.33,
            inner: {
              obj: 'foo',
            },
            hidden: false,
          },
          ReturnValues: 'NONE',
        },
      );
    });
  });

  describe('.get()', () => {
    it('Basic Usage', () => {
      const table = new Table<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        documentClient: null as never,
      });

      assert.deepEqual(
        table
          .get('ss', 1)
          .project({ foo: false as boolean, maybe: 1 })
          .serialize(),
        {
          TableName: 'MyTable',
          Key: {
            Id: 'ss',
            Ver: 1,
          },
          ProjectionExpression: '#maybe',
          ExpressionAttributeNames: {
            '#maybe': 'maybe',
          },
        },
      );
    });

    it('project(fields) type', () => {
      const table = new Table<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        documentClient: null as never,
      });

      const query = table
        .get('ss', 1)
        .project({ foo: false as boolean, maybe: 1 });

      assert.ok<
        GetQuery<
          Omit<DemoItem, 'foo' | 'hidden' | 'inner'> & { foo?: number },
          TableKey<DemoItem, 'Id', 'Ver'>
        >
      >(query);
    });

    it('project(fields) query', () => {
      const table = new Table<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        documentClient: null as never,
      });

      const query = table.get('ss', 1);

      assert.ok<Required<Parameters<typeof query.project>[0]>>({
        foo: 1,
        // Id2kk: true,
        maybe: true,
        hidden: false,
        set: false,
        inner: {
          obj: false,
        },
      });
    });
  });

  describe('.update()', () => {
    it('Basic Usage', () => {
      const table = new Table<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        documentClient: null as never,
      });

      assert.deepEqual(
        table
          .update('12', 2)
          .condition((cn) => cn.attributeExists('Id'))
          .set(['inner', 'obj'], 'hello')
          .add('foo', 5)
          .delete('set', new Set(['del']))
          .remove('hidden')
          .serialize(),
        {
          TableName: 'MyTable',
          Key: {
            Id: '12',
            Ver: 2,
          },
          UpdateExpression:
            'SET #inner.#obj = :obj REMOVE #hidden ADD #foo :foo DELETE #set :set',
          ConditionExpression: 'attribute_exists(#Id)',
          ExpressionAttributeNames: {
            '#Id': 'Id',
            '#foo': 'foo',
            '#hidden': 'hidden',
            '#inner': 'inner',
            '#obj': 'obj',
            '#set': 'set',
          },
          ExpressionAttributeValues: {
            ':foo': 5,
            ':obj': 'hello',
            ':set': {
              type: 'String',
              values: ['del'],
            },
          },
        },
      );
    });
  });

  describe('.delete()', () => {
    it('Basic Usage', () => {
      const table = new Table<DemoItem, 'Id', 'Ver'>({
        tableName: 'MyTable',
        primaryKey: 'Id',
        sortKey: 'Ver',
        documentClient: null as never,
      });

      assert.deepEqual(
        table
          .delete('12', 2)
          .condition((cn) => cn.eq('foo', 12))
          .serialize(),
        {
          TableName: 'MyTable',
          Key: {
            Id: '12',
            Ver: 2,
          },
          ConditionExpression: '#foo = :foo',
          ExpressionAttributeNames: {
            '#foo': 'foo',
          },
          ExpressionAttributeValues: {
            ':foo': 12,
          },
        },
      );
    });
  });
});
