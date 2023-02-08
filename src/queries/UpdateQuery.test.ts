import UpdateQuery from './UpdateQuery';
import { assert } from 'chai';

describe('queries/UpdateQuery', () => {
  const dummyClient = { update: () => null } as never;

  describe('.set()', () => {
    it('Basic Usage', () => {
      const query = new UpdateQuery<
        { id: number; foo: { bar: string }; baz: number },
        { id: number }
      >(dummyClient, {
        TableName: 'Test',
        Key: { id: 123 },
      });

      query.set('foo', { bar: 'baz' });
      query.set(['baz'], 456);

      assert.deepEqual(query.serialize(), {
        TableName: 'Test',
        Key: { id: 123 },
        UpdateExpression: 'SET #foo = :foo, #baz = :baz',
        ExpressionAttributeNames: { '#foo': 'foo', '#baz': 'baz' },
        ExpressionAttributeValues: { ':foo': { bar: 'baz' }, ':baz': 456 },
      });
    });

    it('should support partial deep objects', () => {
      const query = new UpdateQuery<
        { id: number; foo?: { bar: string }; baz: number },
        { id: number }
      >(dummyClient, {
        TableName: 'Test',
        Key: { id: 123 },
      });

      query.set(['foo', 'bar'], 'ddd');

      assert.deepEqual(query.serialize(), {
        TableName: 'Test',
        Key: { id: 123 },
        UpdateExpression: 'SET #foo.#bar = :bar',
        ExpressionAttributeNames: { '#foo': 'foo', '#bar': 'bar' },
        ExpressionAttributeValues: { ':bar': 'ddd' },
      });
    });

    it('should remove optional properties', () => {
      const query = new UpdateQuery<
        { id: number; foo?: { bar: string }; baz: number },
        { id: number }
      >(dummyClient, {
        TableName: 'Test',
        Key: { id: 123 },
      });

      query.set('foo', undefined);

      assert.deepEqual(query.serialize(), {
        TableName: 'Test',
        Key: { id: 123 },
        UpdateExpression: 'REMOVE #foo',
        ExpressionAttributeNames: { '#foo': 'foo' },
      });
    });
  });
});
