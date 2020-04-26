import 'mocha';
import { assert } from 'chai';
import ExpressionAttributeNames from './ExpressionAttributeNames';

interface DemoItem {
  foo: {
    bar: string;
  };
  list: { name: string; value: number }[];
  prop: number;
}

describe('ExpressionAttributeNames', () => {
  it('Basic Usage', () => {
    const names = new ExpressionAttributeNames<DemoItem>();

    assert.equal(names.add('foo'), '#foo');
    assert.equal(names.add('foo', 'bar'), '#foo.#bar');
    assert.equal(names.add('foo', 'bar'), '#foo.#bar');
    assert.equal(names.add('list', 2, 'name'), '#list[2].#name');

    assert.deepEqual(names.serialize(), {
      '#foo': 'foo',
      '#bar': 'bar',
      '#list': 'list',
      '#name': 'name',
    });
  });

  // it('Basic Proxy Usage', () => {
  //   const names = new ExpressionAttributeNames<DemoItem>();
  //   const proxy = names.proxy();
  //
  //   assert.equal(String(proxy.foo), '#foo');
  //   assert.equal(String(proxy.foo.bar), '#foo.#bar');
  //   assert.equal(String(proxy.foo.bar), '#foo.#bar');
  //   assert.equal(String(proxy.list[2].name), '#list[2].#name');
  //
  //   assert.deepEqual(names.serialize(), {
  //     '#foo': 'foo',
  //     '#bar': 'bar',
  //     '#name': 'name',
  //     '#list': 'list',
  //   });
  // });
});
