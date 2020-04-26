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
  set?: {
    type: 'String';
    values: string[];
  };
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
  });

  describe('set()', (): void => {
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
  });
});
