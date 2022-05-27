import 'mocha';
import { assert } from 'chai';
import UpdateExpression from './UpdateExpression';
import ExpressionAttributeNames from './ExpressionAttributeNames';
import ExpressionAttributeValues from './ExpressionAttributeValues';

interface DemoItem {
  foo: {
    bar: number;
  };
  hello?: string;
  list: number[];
  set?: Set<string>;
}

describe('UpdateExpression', () => {
  describe('init -> serialize()', () => {
    function assetSerialize(
      test: string,
      expected: string = test.trim().replace(/\s+/g, ' '),
    ): void {
      it(test, () => {
        const names = new ExpressionAttributeNames();
        const values = new ExpressionAttributeValues();
        const exp = new UpdateExpression(names, values, test);

        assert.equal(exp.serialize(), expected);
      });
    }

    assetSerialize('SET #foo = :foo');
    assetSerialize('SET foo = :foo');
    assetSerialize('set foo = :foo', 'SET foo = :foo');
    assetSerialize(' SET  foo = :foo ');
    assetSerialize('SET\nfoo=:foo', 'SET foo = :foo');

    assetSerialize('SET foo = :foo ADD #delete :d');
    assetSerialize('SET foo = :foo REMOVE #c ADD #delete :d DELETE #a[2] :a');
    assetSerialize('DELETE #a[2] :a');
  });

  describe('.set()', (): void => {
    it('Set foo.bar', (): void => {
      const names = new ExpressionAttributeNames<DemoItem>();
      const values = new ExpressionAttributeValues();
      const update = new UpdateExpression<DemoItem>(names, values);

      update.set(['foo', 'bar'], 23);

      assert.deepEqual(update.serialize(), 'SET #foo.#bar = :bar');
      assert.deepEqual(names.serialize(), {
        '#foo': 'foo',
        '#bar': 'bar',
      });
      assert.deepEqual(values.serialize(), {
        ':bar': 23,
      });
    });

    it('Set list', (): void => {
      const names = new ExpressionAttributeNames<DemoItem>();
      const values = new ExpressionAttributeValues();
      const update = new UpdateExpression<DemoItem>(names, values);

      update.set('list', [123, 1]);

      assert.deepEqual(update.serialize(), 'SET #list = :list');
      assert.deepEqual(names.serialize(), {
        '#list': 'list',
      });
      assert.deepEqual(values.serialize(), {
        ':list': [123, 1],
      });
    });

    it('Set list', (): void => {
      const names = new ExpressionAttributeNames<DemoItem>();
      const values = new ExpressionAttributeValues();
      const update = new UpdateExpression<DemoItem>(names, values);

      update.set('list', [123, 1]);

      assert.deepEqual(update.serialize(), 'SET #list = :list');
      assert.deepEqual(names.serialize(), {
        '#list': 'list',
      });
      assert.deepEqual(values.serialize(), {
        ':list': [123, 1],
      });
    });

    it('Set exp', (): void => {
      const names = new ExpressionAttributeNames<DemoItem>();
      const values = new ExpressionAttributeValues();
      const update = new UpdateExpression<DemoItem>(names, values);

      update.set('list', (exp) => exp.listAppend([123]));

      assert.deepEqual(
        update.serialize(),
        'SET #list = list_append(#list, :list)',
      );
      assert.deepEqual(names.serialize(), {
        '#list': 'list',
      });
      assert.deepEqual(values.serialize(), {
        ':list': [123],
      });
    });
  });

  describe('.remove()', (): void => {
    it('Basic use case', (): void => {
      const names = new ExpressionAttributeNames<DemoItem>();
      const values = new ExpressionAttributeValues();
      const update = new UpdateExpression<DemoItem>(names, values);

      update.remove('set');
      update.remove('foo', 'bar');

      assert.deepEqual(update.serialize(), 'REMOVE #set, #foo.#bar');
      assert.deepEqual(names.serialize(), {
        '#set': 'set',
        '#foo': 'foo',
        '#bar': 'bar',
      });
    });
  });

  describe('.add()', (): void => {
    it('number', (): void => {
      const names = new ExpressionAttributeNames<DemoItem>();
      const values = new ExpressionAttributeValues();
      const update = new UpdateExpression<DemoItem>(names, values);

      update.add(['foo', 'bar'], 4);

      assert.deepEqual(update.serialize(), 'ADD #foo.#bar :bar');
      assert.deepEqual(names.serialize(), {
        '#foo': 'foo',
        '#bar': 'bar',
      });
      assert.deepEqual(values.serialize(), {
        ':bar': 4,
      });
    });

    it('set', (): void => {
      const names = new ExpressionAttributeNames<DemoItem>();
      const values = new ExpressionAttributeValues();
      const update = new UpdateExpression<DemoItem>(names, values);

      update.add('set', new Set(['test']));

      assert.deepEqual(update.serialize(), 'ADD #set :set');
      assert.deepEqual(names.serialize(), {
        '#set': 'set',
      });
      assert.deepEqual(values.serialize(), {
        ':set': new Set(['test']),
      });
    });
  });

  describe('.delete()', (): void => {
    it('set', (): void => {
      const names = new ExpressionAttributeNames<DemoItem>();
      const values = new ExpressionAttributeValues();
      const update = new UpdateExpression<DemoItem>(names, values);

      update.delete('set', new Set(['test']));

      assert.deepEqual(update.serialize(), 'DELETE #set :set');
      assert.deepEqual(names.serialize(), {
        '#set': 'set',
      });
      assert.deepEqual(values.serialize(), {
        ':set': new Set(['test']),
      });
    });
  });
});
