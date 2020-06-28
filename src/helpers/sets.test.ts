import 'mocha';
import { assert } from 'chai';
import { setOf } from './sets';

describe('sets', () => {
  describe('setOf', () => {
    it('should create string set', () => {
      assert.deepEqual(setOf('foo'), { type: 'String', values: ['foo'] });
      assert.deepEqual(setOf('foo', 'bar'), {
        type: 'String',
        values: ['foo', 'bar'],
      });
    });

    it('should create number set', () => {
      assert.deepEqual(setOf(1), { type: 'Number', values: [1] });
      assert.deepEqual(setOf(1, 2), {
        type: 'Number',
        values: [1, 2],
      });
    });

    it('should create binary set', () => {
      assert.deepEqual(setOf(Buffer.from('a')), {
        type: 'Binary',
        values: [Buffer.from('a')],
      });
      assert.deepEqual(setOf(Buffer.from('a'), Buffer.from('b')), {
        type: 'Binary',
        values: [Buffer.from('a'), Buffer.from('b')],
      });
    });
  });
});
