import 'mocha';
import { assert } from 'chai';
import ExpressionAttributeNames from './ExpressionAttributeNames';
import ConditionExpression from './ConditionExpression';
import ExpressionAttributeValues from './ExpressionAttributeValues';

describe('ConditionExpression', () => {
  describe('init -> serialize()', () => {
    function assetSerialize(
      test: string,
      expected: string = test.trim().replace(/\s+/g, ' '),
    ): void {
      it(test, () => {
        const names = new ExpressionAttributeNames();
        const values = new ExpressionAttributeValues();
        const exp = new ConditionExpression(names, values, test);

        assert.equal(exp.serialize(), expected);
      });
    }

    assetSerialize('#foo = :foo');
    assetSerialize(':foo = #foo');
    assetSerialize('#foo = :foo AND #bar <> :bar');
    assetSerialize('#foo = :foo OR #bar > :bar');
    assetSerialize('#foo < :foo AND #bar >= :bar OR #zoo = :zoo');
  });
});
