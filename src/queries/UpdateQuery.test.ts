import UpdateQuery from './UpdateQuery';

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
    });
  });
});
