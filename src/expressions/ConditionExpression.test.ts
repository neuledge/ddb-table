import 'mocha';
import { assert } from 'chai';
import ExpressionAttributeNames from './ExpressionAttributeNames';
import ConditionExpression from './ConditionExpression';
import ExpressionAttributeValues from './ExpressionAttributeValues';

describe('ConditionExpression', () => {
  describe('.getAttributeTypeString', () => {
    it('String', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('S'), 'S');
      assert.equal(ConditionExpression.getAttributeTypeString(String), 'S');

      // Custom strings throws on type checks but returned as is
      assert.equal(
        ConditionExpression.getAttributeTypeString('test' as never),
        'test',
      );
    });

    it('String Set', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('SS'), 'SS');
      assert.equal(ConditionExpression.getAttributeTypeString([String]), 'SS');

      assert.throws(() =>
        ConditionExpression.getAttributeTypeString(['string'] as never),
      );
    });

    it('Number', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('N'), 'N');
      assert.equal(ConditionExpression.getAttributeTypeString(Number), 'N');

      assert.throws(() =>
        ConditionExpression.getAttributeTypeString(2 as never),
      );
    });

    it('Number Set', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('NS'), 'NS');
      assert.equal(ConditionExpression.getAttributeTypeString([Number]), 'NS');
    });

    it('Binary', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('B'), 'B');
      assert.equal(ConditionExpression.getAttributeTypeString(Buffer), 'B');
      assert.equal(
        ConditionExpression.getAttributeTypeString(ArrayBuffer),
        'B',
      );
    });

    it('Buffer Set', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('BS'), 'BS');
      assert.equal(ConditionExpression.getAttributeTypeString([Buffer]), 'BS');
      assert.equal(
        ConditionExpression.getAttributeTypeString([ArrayBuffer]),
        'BS',
      );
    });

    it('Boolean', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('BOOL'), 'BOOL');
      assert.equal(ConditionExpression.getAttributeTypeString(Boolean), 'BOOL');

      assert.throws(() =>
        ConditionExpression.getAttributeTypeString(true as never),
      );
    });

    it('Null', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('NULL'), 'NULL');
      assert.equal(ConditionExpression.getAttributeTypeString(null), 'NULL');

      assert.throws(() =>
        ConditionExpression.getAttributeTypeString(undefined as never),
      );
    });

    it('List', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('L'), 'L');
      assert.equal(ConditionExpression.getAttributeTypeString(Array), 'L');

      assert.throws(() =>
        ConditionExpression.getAttributeTypeString([] as never),
      );
    });

    it('Map', () => {
      assert.equal(ConditionExpression.getAttributeTypeString('M'), 'M');
      assert.equal(ConditionExpression.getAttributeTypeString(Object), 'M');

      assert.throws(() =>
        ConditionExpression.getAttributeTypeString({} as never),
      );
    });
  });

  describe('init', () => {
    it('from other expression', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression(names, values, '#foo = :foo');

      const exp2 = new ConditionExpression(names, values, exp);

      assert.equal(exp.serialize(), exp2.serialize());
    });
  });

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
      assert.deepEqual(values.serialize(), undefined);
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
      assert.deepEqual(values.serialize(), undefined);
    });
  });

  describe('.value', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      assert.equal(exp.value('foo', 1), ':foo');
      assert.deepEqual(names.serialize(), undefined);
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
      assert.deepEqual(names.serialize(), undefined);
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
      assert.deepEqual(values.serialize(), undefined);
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

    it('inner key', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: number } }>(
        names,
        values,
      );

      exp.between(['foo', 'bar'], 1, 2);

      assert.equal(exp.serialize(), '#foo.#bar BETWEEN :bar AND :bar2');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), { ':bar': 1, ':bar2': 2 });
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
      assert.deepEqual(values.serialize(), undefined);
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
      assert.deepEqual(values.serialize(), undefined);
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
      assert.deepEqual(values.serialize(), undefined);
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
      assert.deepEqual(values.serialize(), undefined);
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
      const exp = new ConditionExpression<{ foo: string }>(names, values);

      exp.contains('foo', 'str');

      assert.equal(exp.serialize(), 'contains(#foo, :foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 'str' });
    });

    it('string set use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: Set<string> }>(names, values);

      exp.contains('foo', 'str');

      assert.equal(exp.serialize(), 'contains(#foo, :foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 'str' });
    });

    it('number set use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: Set<number> }>(names, values);

      exp.contains('foo', 123);

      assert.equal(exp.serialize(), 'contains(#foo, :foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 123 });
    });

    it('nullable string set use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo?: Set<string> | null }>(
        names,
        values,
      );

      exp.contains('foo', 'str');

      assert.equal(exp.serialize(), 'contains(#foo, :foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 'str' });
    });

    it('nullable number set use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo?: Set<number> | null }>(
        names,
        values,
      );

      exp.contains('foo', 3);

      assert.equal(exp.serialize(), 'contains(#foo, :foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 3 });
    });

    it('other path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: string; bar: string }>(
        names,
        values,
      );

      exp.contains('foo', (cn) => cn.name('bar'));

      assert.equal(exp.serialize(), 'contains(#foo, #bar)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo', '#bar': 'bar' });
      assert.deepEqual(values.serialize(), undefined);
    });

    it('inner path', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: { bar: string } }>(
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
      assert.deepEqual(values.serialize(), undefined);
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
      assert.deepEqual(values.serialize(), undefined);
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

    it('inner AND', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.or((cn) => cn.attributeExists('foo'));
      exp.or((cn) => cn.gt('foo', 1).and((cn) => cn.lt('foo', 10)));

      assert.equal(
        exp.serialize(),
        'attribute_exists(#foo) OR (#foo > :foo AND #foo < :foo2)',
      );
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1, ':foo2': 10 });
    });

    it('freestyle string', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.or((cn) => cn.attributeExists('foo'));
      exp.or(() => '#foo = #foo');

      assert.equal(exp.serialize(), 'attribute_exists(#foo) OR #foo = #foo');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), undefined);
    });
  });

  describe('.not', () => {
    it('basic use case', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.not((cn) => cn.attributeExists('foo'));

      assert.equal(exp.serialize(), 'NOT attribute_exists(#foo)');
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), undefined);
    });

    it('inner AND', () => {
      const names = new ExpressionAttributeNames();
      const values = new ExpressionAttributeValues();
      const exp = new ConditionExpression<{ foo: number }>(names, values);

      exp.not((cn) => cn.attributeExists('foo'));
      exp.or((cn) => cn.gt('foo', 1).not((cn) => cn.lt('foo', 10)));

      assert.equal(
        exp.serialize(),
        'NOT attribute_exists(#foo) OR (#foo > :foo AND NOT #foo < :foo2)',
      );
      assert.deepEqual(names.serialize(), { '#foo': 'foo' });
      assert.deepEqual(values.serialize(), { ':foo': 1, ':foo2': 10 });
    });
  });
});
