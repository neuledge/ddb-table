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
});
