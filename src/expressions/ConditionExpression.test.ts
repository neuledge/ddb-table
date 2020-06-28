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

  describe('.name', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      assert.equal(exp.name('foo'), '#foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      assert.equal(exp.name('foo', 'bar'), '#foo.#bar');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
    });
  });

  describe('.value', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      assert.equal(exp.value('foo', 1), ':foo');
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });

    it('duplicate name', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      assert.equal(exp.value('foo', 1), ':foo');
      assert.equal(exp.value('foo', 2), ':foo2');
      assert.deepEqual(values.serialize(), { ':foo': 1, ':foo2': 2 });
    });
  });

  describe('.eq', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.eq('foo', 1);

      assert.equal(exp.serialize(), '#foo = :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });

  describe('.nq', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.nq('foo', 1);

      assert.equal(exp.serialize(), '#foo <> :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });

  describe('.lt', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.lt('foo', 1);

      assert.equal(exp.serialize(), '#foo < :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });

  describe('.lte', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.lte('foo', 1);

      assert.equal(exp.serialize(), '#foo <= :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });

  describe('.gt', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.gt('foo', 1);

      assert.equal(exp.serialize(), '#foo > :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });

  describe('.gte', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.gte('foo', 1);

      assert.equal(exp.serialize(), '#foo >= :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });

  describe('comparator', () => {
    it('foo <> 1', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.comparator('<>', 'foo', 1);

      assert.equal(exp.serialize(), '#foo <> :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });

    it('foo.bar = 1', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      exp.comparator('<>', ['foo', 'bar'], 1);

      assert.equal(exp.serialize(), '#foo.#bar <> :bar');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), { ':bar': 1 });
    });

    it('foo <> function', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.comparator('<>', ['foo'], (path, cn) => cn.fn('size', path));

      assert.equal(exp.serialize(), '#foo <> size(#foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), {});
    });
  });

  describe('.between', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.between('foo', 1, 2);

      assert.equal(exp.serialize(), '#foo BETWEEN :foo AND :foo2');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1, ':foo2': 2 });
    });
  });

  describe('.attributeExists', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.attributeExists('foo');

      assert.equal(exp.serialize(), 'attribute_exists(#foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), {});
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      exp.attributeExists(['foo', 'bar']);

      assert.equal(exp.serialize(), 'attribute_exists(#foo.#bar)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), {});
    });
  });

  describe('.attributeNotExists', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.attributeNotExists('foo');

      assert.equal(exp.serialize(), 'attribute_not_exists(#foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), {});
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      exp.attributeNotExists(['foo', 'bar']);

      assert.equal(exp.serialize(), 'attribute_not_exists(#foo.#bar)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), {});
    });
  });

  describe('.attributeType', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.attributeType('foo', Number);

      assert.equal(exp.serialize(), 'attribute_type(#foo, :foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 'N' });
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      exp.attributeType(['foo', 'bar'], [String]);

      assert.equal(exp.serialize(), 'attribute_type(#foo.#bar, :bar)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), { ':bar': 'SS' });
    });
  });

  describe('.beginsWith', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.beginsWith('foo', 'str');

      assert.equal(exp.serialize(), 'begins_with(#foo, :foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 'str' });
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      exp.beginsWith(['foo', 'bar'], 'str2');

      assert.equal(exp.serialize(), 'begins_with(#foo.#bar, :bar)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), { ':bar': 'str2' });
    });
  });

  describe('.contains', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.contains('foo', 'str');

      assert.equal(exp.serialize(), 'contains(#foo, :foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 'str' });
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      exp.contains(['foo', 'bar'], 'str2');

      assert.equal(exp.serialize(), 'contains(#foo.#bar, :bar)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), { ':bar': 'str2' });
    });
  });

  describe('.size', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.size('foo');

      assert.equal(exp.serialize(), 'size(#foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), {});
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      exp.size(['foo', 'bar']);

      assert.equal(exp.serialize(), 'size(#foo.#bar)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), {});
    });
  });

  describe('.and', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.and((cn) => cn.attributeExists('foo'));
      exp.and((cn) => cn.eq('foo', 1));

      assert.equal(exp.serialize(), 'attribute_exists(#foo) AND #foo = :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });

  describe('.or', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.or((cn) => cn.attributeExists('foo'));
      exp.or((cn) => cn.eq('foo', 1));

      assert.equal(exp.serialize(), 'attribute_exists(#foo) OR #foo = :foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1 });
    });
  });
});
