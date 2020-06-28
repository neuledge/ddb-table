import 'mocha';
import { assert } from 'chai';
import ExpressionAttributeNames from './ExpressionAttributeNames';
import ProjectionExpression from './ProjectionExpression';

describe('ProjectionExpression', () => {
  describe('init -> serialize()', () => {
    function assetSerialize(
      test: string,
      expected: string = test.trim().replace(/\s+/g, ' '),
    ): void {
      it(test, () => {
        const names = new ExpressionAttributeNames();
        const exp = new ProjectionExpression(names, test);

        assert.equal(exp.serialize(), expected);
      });
    }

    assetSerialize('#foo');
    assetSerialize('#foo, #bar');
    assetSerialize(' #foo  ,  #bar ', '#foo, #bar');
    assetSerialize(' foo,  #hello, #testme ');
  });

  describe('.add', () => {
    it('Basic use case', () => {
      const names = new ExpressionAttributeNames();
      const exp = new ProjectionExpression<
        {
          sku: string;
          name: string;
          description: string;
          price: {
            amount: number;
            currency: 'USD' | 'EUR';
          };
        },
        { sku: string }
      >(names);

      exp.add({
        name: 1,
        description: 0,
        price: {
          amount: 1,
        },
      });

      assert.equal(exp.serialize(), '#name, #price.#amount');
      assert.deepEqual(names.serialize(), {
        '#name': 'name',
        '#price': 'price',
        '#amount': 'amount',
      });
    });
  });
});
