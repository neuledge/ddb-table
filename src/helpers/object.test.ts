import 'mocha';
import { assert } from 'chai';
import { isEmpty } from './object';

describe('object', () => {
  describe('isEmpty', () => {
    it('basic use cases', () => {
      assert.equal(isEmpty({}), true);
      assert.equal(isEmpty({ foo: 1 }), false);
      assert.equal(isEmpty(3), true);
      assert.equal(isEmpty(0), true);
      assert.equal(isEmpty('string'), false);
      assert.equal(isEmpty(''), true);
      assert.equal(isEmpty(true), true);
      assert.equal(isEmpty(false), true);
      assert.equal(isEmpty([]), true);
      assert.equal(isEmpty([1]), false);
    });
  });
});
