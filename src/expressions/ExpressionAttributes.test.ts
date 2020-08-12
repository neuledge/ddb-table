import 'mocha';
import { assert } from 'chai';
import ExpressionAttributes from './ExpressionAttributes';

describe('ExpressionAttributes', () => {
  it('Empty constructor', () => {
    const attrs = new ExpressionAttributes();

    assert.deepEqual(attrs.serialize(), undefined);
  });

  it('constructor init', () => {
    const attrs = new ExpressionAttributes({
      foo: 1,
      bar: { hello: 'world' },
    });

    assert.deepEqual(attrs.serialize(), {
      foo: 1,
      bar: { hello: 'world' },
    });
  });
});
