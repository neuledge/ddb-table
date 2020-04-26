import 'mocha';
import { assert } from 'chai';
import ExpressionAttributeValues from './ExpressionAttributeValues';

describe('ExpressionAttributeValues', () => {
  it('Basic Usage', () => {
    const values = new ExpressionAttributeValues();

    const foo = { foo: 1 };

    assert.equal(values.add('foo', foo), ':foo');
    assert.equal(values.add(':foo', foo), ':foo');
    assert.equal(values.add('bar', 'bar'), ':bar');

    assert.deepEqual(values.serialize(), {
      ':foo': foo,
      ':bar': 'bar',
    });
  });
});
