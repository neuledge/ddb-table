import ExpressionAttributeNames from './ExpressionAttributeNames';
import ExpressionAttributeValues from './ExpressionAttributeValues';

// Docs:
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html#Expressions.UpdateExpressions.SET

export type Operand = '+' | '-';

export type ValueFn<T, V> = V | ((exp: UpdateValueExpression<T, V>) => string);

export type ListValue<V> = [V] extends [unknown[]] ? V : never;

export default class UpdateValueExpression<T, V> {
  private names: ExpressionAttributeNames<T>;
  private values: ExpressionAttributeValues;
  private pathName: string;
  private valueKey: string;

  public constructor(
    names: ExpressionAttributeNames<T>,
    values: ExpressionAttributeValues,
    pathName: string,
    valueKey: string,
  ) {
    this.names = names;
    this.values = values;
    this.pathName = pathName;
    this.valueKey = valueKey;
  }

  public name<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7],
  >(
    ...path: [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]]
  ): string {
    return this.names.add(...path);
  }

  public value(value: V): string {
    return this.values.add(this.valueKey, value);
  }

  public inc(a: ValueFn<T, V>, b?: ValueFn<T, V>): string {
    return this.operand('+', a, b);
  }

  public dec(a: ValueFn<T, V>, b?: ValueFn<T, V>): string {
    return this.operand('-', a, b);
  }

  public operand(
    operand: Operand,
    a: ValueFn<T, V>,
    b?: ValueFn<T, V>,
  ): string {
    if (b === undefined) {
      return `${this.pathName} ${operand} ${this.calcValueFn(a)}`;
    }

    return `${this.calcValueFn(a)} ${operand} ${this.calcValueFn(b)}`;
  }

  public listAppend(
    list1: ValueFn<T, ListValue<V>>,
    list2?: ValueFn<T, ListValue<V>>,
  ): string {
    if (list2 === undefined) {
      return `list_append(${this.pathName}, ${this.calcValueFn(list1)})`;
    }

    return `list_append(${this.calcValueFn(list1)}, ${this.calcValueFn(
      list2,
    )})`;
  }

  public ifNotExists(value: ValueFn<T, V>): string {
    return `if_not_exists(${this.pathName}, ${this.calcValueFn(value)})`;
  }

  protected calcValueFn(value: ValueFn<T, V>): string {
    if (typeof value !== 'function') {
      return this.values.add(this.valueKey, value);
    }

    return (value as (exp: UpdateValueExpression<T, V>) => string)(this);
  }
}
