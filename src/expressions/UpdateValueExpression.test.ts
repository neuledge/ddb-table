import 'mocha';
import { assert } from 'chai';
import ExpressionAttributeNames from './ExpressionAttributeNames';
import ExpressionAttributeValues from './ExpressionAttributeValues';
import UpdateValueExpression from './UpdateValueExpression';

describe('UpdateValueExpression', () => {
  describe('.name', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<{ foo: number }, number>(
        names,
        values,
        '#foo',
        'foo',
      );

      assert.equal(exp.name('foo'), '#foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), {});
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<{ foo: { bar: number } }, number>(
        names,
        values,
        '#foo',
        'foo',
      );

      assert.equal(exp.name('foo', 'bar'), '#foo.#bar');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), {});
    });
  });

  describe('.value', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<{ foo: number }, number>(
        names,
        values,
        '#foo',
        'foo',
      );

      assert.equal(exp.value(1), ':foo');
      assert.deepEqual(names.serialize(), {});
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });

  describe('.inc', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<{ foo: number }, number>(
        names,
        values,
        '#foo',
        'foo',
      );

      assert.equal(exp.inc(3), '#foo + :foo');
      assert.deepEqual(names.serialize(), {});
      assert.deepEqual(values.serialize(), { ':foo': 3 });
    });

    it('2 values', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<
        { foo: number; bar: string },
        number
      >(names, values, '#foo', 'foo');

      assert.equal(
        exp.inc((exp) => exp.name('bar'), 2),
        '#bar + :foo',
      );
      assert.deepEqual(names.serialize(), { '#bar': 'bar' });
      assert.deepEqual(values.serialize(), { ':foo': 2 });
    });
  });

  describe('.dec', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<{ foo: number }, number>(
        names,
        values,
        '#foo',
        'foo',
      );

      assert.equal(exp.dec(3), '#foo - :foo');
      assert.deepEqual(names.serialize(), {});
      assert.deepEqual(values.serialize(), { ':foo': 3 });
    });

    it('2 values', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<
        { foo: number; bar: string },
        number
      >(names, values, '#foo', 'foo');

      assert.equal(
        exp.dec((exp) => exp.name('bar'), 2),
        '#bar - :foo',
      );
      assert.deepEqual(names.serialize(), { '#bar': 'bar' });
      assert.deepEqual(values.serialize(), { ':foo': 2 });
    });
  });

  describe('.listAppend', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<{ foo: number[] }, number[]>(
        names,
        values,
        '#foo',
        'foo',
      );

      assert.equal(exp.listAppend([3]), 'list_append(#foo, :foo)');
      assert.deepEqual(names.serialize(), {});
      assert.deepEqual(values.serialize(), { ':foo': [3] });
    });

    it('2 lists', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<
        { foo: number[]; bar: number[] },
        number[]
      >(names, values, '#foo', 'foo');

      assert.equal(
        exp.listAppend((exp) => exp.name('bar'), [3]),
        'list_append(#bar, :foo)',
      );
      assert.deepEqual(names.serialize(), { '#bar': 'bar' });
      assert.deepEqual(values.serialize(), { ':foo': [3] });
    });
  });

  describe('.ifNotExists', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new UpdateValueExpression<{ foo: number }, number>(
        names,
        values,
        '#foo',
        'foo',
      );

      assert.equal(exp.ifNotExists(3), 'if_not_exists(#foo, :foo)');
      assert.deepEqual(names.serialize(), {});
      assert.deepEqual(values.serialize(), { ':foo': 3 });
    });
  });
});
