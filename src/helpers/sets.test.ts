import 'mocha';
import { assert } from 'chai';
import { setOf } from './sets';

describe('sets', () => {
  describe('setOf', () => {
    it('should create string set', () => {
      const s1 = setOf('foo');
      assert.equal(s1.type, 'String');
      assert.deepEqual(s1.values, ['foo']);

      const s2 = setOf('foo', 'bar');
      assert.equal(s2.type, 'String');
      assert.deepEqual(s2.values, ['foo', 'bar']);
    });

    it('should create number set', () => {
      const s1 = setOf(1);
      assert.equal(s1.type, 'Number');
      assert.deepEqual(s1.values, [1]);

      const s2 = setOf(1, 2);
      assert.equal(s2.type, 'Number');
      assert.deepEqual(s2.values, [1, 2]);
    });

    it('should create binary set', () => {
      const s1 = setOf(Buffer.from('a'));
      assert.equal(s1.type, 'Binary');
      assert.deepEqual(s1.values, [Buffer.from('a')]);

      const s2 = setOf(Buffer.from('a'), Buffer.from('b'));
      assert.equal(s2.type, 'Binary');
      assert.deepEqual(s2.values, [Buffer.from('a'), Buffer.from('b')]);
    });
  });
});
