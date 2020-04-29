import ExpressionAttributeNames from './ExpressionAttributeNames';
import ExpressionAttributeValues from './ExpressionAttributeValues';

// Docs:
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

export type ConditionGenerator<T> = (
  condition: ConditionExpression<T>,
) => ConditionExpression<T> | string;

export type ValueFn<T, V> = V | ((path: string) => string);

export type Comparator = '=' | '<>' | '<' | '<=' | '>' | '>=';

const OppsiteOperandMatch = {
  AND: /[ )]OR[ (]/i,
  OR: /[ )]AND[ (]/i,
};

export default class ConditionExpression<T> {
  private names: ExpressionAttributeNames<T>;
  private values: ExpressionAttributeValues;

  private expression: string;

  public constructor(
    names: ExpressionAttributeNames<T>,
    values: ExpressionAttributeValues,
    init?: string | ConditionExpression<T>,
  ) {
    this.names = names;
    this.values = values;

    if (init) {
      if (typeof init === 'string') {
        this.expression =
          init
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/\(\s+/g, '(')
            .replace(/\s+\)/g, ')') || '';
      } else {
        this.expression = init.expression;
      }
    } else {
      this.expression = '';
    }
  }

  public name<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    ...path: [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]]
  ): string {
    return this.names.add(...path);
  }

  public value(key: string, value: unknown): string {
    return this.values.add(key, value);
  }

  public eq<K1 extends keyof T>(
    path: K1 | [K1],
    value: ValueFn<T, T[K1]>,
  ): this;
  public eq<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: ValueFn<T, T[K1][K2]>,
  ): this;
  public eq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: ValueFn<T, T[K1][K2][K3]>): this;
  public eq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: ValueFn<T, T[K1][K2][K3][K4]>): this;
  public eq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5], value: ValueFn<T, T[K1][K2][K3][K4][K5]>): this;
  public eq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public eq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public eq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7, K8],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public eq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: K1 | [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]],
    value: ValueFn<T, unknown>,
  ): this {
    return this.comparator(
      '=',
      path as [K1, K2, K3, K4, K5, K6, K7, K8],
      value as ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
    );
  }

  public nq<K1 extends keyof T>(
    path: K1 | [K1],
    value: ValueFn<T, T[K1]>,
  ): this;
  public nq<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: ValueFn<T, T[K1][K2]>,
  ): this;
  public nq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: ValueFn<T, T[K1][K2][K3]>): this;
  public nq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: ValueFn<T, T[K1][K2][K3][K4]>): this;
  public nq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5], value: ValueFn<T, T[K1][K2][K3][K4][K5]>): this;
  public nq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public nq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public nq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7, K8],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public nq<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: K1 | [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]],
    value: ValueFn<T, unknown>,
  ): this {
    return this.comparator(
      '<>',
      path as [K1, K2, K3, K4, K5, K6, K7, K8],
      value as ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
    );
  }

  public lt<K1 extends keyof T>(
    path: K1 | [K1],
    value: ValueFn<T, T[K1]>,
  ): this;
  public lt<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: ValueFn<T, T[K1][K2]>,
  ): this;
  public lt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: ValueFn<T, T[K1][K2][K3]>): this;
  public lt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: ValueFn<T, T[K1][K2][K3][K4]>): this;
  public lt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5], value: ValueFn<T, T[K1][K2][K3][K4][K5]>): this;
  public lt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public lt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public lt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7, K8],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public lt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: K1 | [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]],
    value: ValueFn<T, unknown>,
  ): this {
    return this.comparator(
      '<',
      path as [K1, K2, K3, K4, K5, K6, K7, K8],
      value as ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
    );
  }

  public lte<K1 extends keyof T>(
    path: K1 | [K1],
    value: ValueFn<T, T[K1]>,
  ): this;
  public lte<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: ValueFn<T, T[K1][K2]>,
  ): this;
  public lte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: ValueFn<T, T[K1][K2][K3]>): this;
  public lte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: ValueFn<T, T[K1][K2][K3][K4]>): this;
  public lte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5], value: ValueFn<T, T[K1][K2][K3][K4][K5]>): this;
  public lte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public lte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public lte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7, K8],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public lte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: K1 | [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]],
    value: ValueFn<T, unknown>,
  ): this {
    return this.comparator(
      '<=',
      path as [K1, K2, K3, K4, K5, K6, K7, K8],
      value as ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
    );
  }

  public gt<K1 extends keyof T>(
    path: K1 | [K1],
    value: ValueFn<T, T[K1]>,
  ): this;
  public gt<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: ValueFn<T, T[K1][K2]>,
  ): this;
  public gt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: ValueFn<T, T[K1][K2][K3]>): this;
  public gt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: ValueFn<T, T[K1][K2][K3][K4]>): this;
  public gt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5], value: ValueFn<T, T[K1][K2][K3][K4][K5]>): this;
  public gt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public gt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public gt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7, K8],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public gt<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: K1 | [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]],
    value: ValueFn<T, unknown>,
  ): this {
    return this.comparator(
      '>',
      path as [K1, K2, K3, K4, K5, K6, K7, K8],
      value as ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
    );
  }

  public gte<K1 extends keyof T>(
    path: K1 | [K1],
    value: ValueFn<T, T[K1]>,
  ): this;
  public gte<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: ValueFn<T, T[K1][K2]>,
  ): this;
  public gte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: ValueFn<T, T[K1][K2][K3]>): this;
  public gte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: ValueFn<T, T[K1][K2][K3][K4]>): this;
  public gte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5], value: ValueFn<T, T[K1][K2][K3][K4][K5]>): this;
  public gte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public gte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public gte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7, K8],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public gte<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: K1 | [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]],
    value: ValueFn<T, unknown>,
  ): this {
    return this.comparator(
      '>=',
      path as [K1, K2, K3, K4, K5, K6, K7, K8],
      value as ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
    );
  }

  public comparator<K1 extends keyof T>(
    comparator: Comparator,
    path: K1 | [K1],
    value: ValueFn<T, T[K1]>,
  ): this;
  public comparator<K1 extends keyof T, K2 extends keyof T[K1]>(
    comparator: Comparator,
    path: [K1, K2],
    value: ValueFn<T, T[K1][K2]>,
  ): this;
  public comparator<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(
    comparator: Comparator,
    path: [K1, K2, K3],
    value: ValueFn<T, T[K1][K2][K3]>,
  ): this;
  public comparator<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(
    comparator: Comparator,
    path: [K1, K2, K3, K4],
    value: ValueFn<T, T[K1][K2][K3][K4]>,
  ): this;
  public comparator<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    comparator: Comparator,
    path: [K1, K2, K3, K4, K5],
    value: ValueFn<T, T[K1][K2][K3][K4][K5]>,
  ): this;
  public comparator<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    comparator: Comparator,
    path: [K1, K2, K3, K4, K5, K6],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public comparator<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    comparator: Comparator,
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public comparator<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    comparator: Comparator,
    path: [K1, K2, K3, K4, K5, K6, K7, K8],
    value: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public comparator<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    comparator: Comparator,
    path: K1 | [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]],
    value: ValueFn<T, unknown>,
  ): this {
    if (!Array.isArray(path)) {
      path = [path];
    }

    const pathName = this.names.add(...path);

    const valueStr =
      typeof value === 'function'
        ? value(pathName)
        : this.values.add(String(path[path.length - 1]), value);

    return this.append('AND', `${pathName} ${comparator} ${valueStr}`);
  }

  public between<K1 extends keyof T>(
    path: K1 | [K1],
    from: ValueFn<T, T[K1]>,
    to: ValueFn<T, T[K1]>,
  ): this;
  public between<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    from: ValueFn<T, T[K1][K2]>,
    to: ValueFn<T, T[K1][K2]>,
  ): this;
  public between<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(
    path: [K1, K2, K3],
    from: ValueFn<T, T[K1][K2][K3]>,
    to: ValueFn<T, T[K1][K2][K3]>,
  ): this;
  public between<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(
    path: [K1, K2, K3, K4],
    from: ValueFn<T, T[K1][K2][K3][K4]>,
    to: ValueFn<T, T[K1][K2][K3][K4]>,
  ): this;
  public between<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    path: [K1, K2, K3, K4, K5],
    from: ValueFn<T, T[K1][K2][K3][K4][K5]>,
    to: ValueFn<T, T[K1][K2][K3][K4][K5]>,
  ): this;
  public between<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    from: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
    to: ValueFn<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public between<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    from: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
    to: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public between<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7, K8],
    from: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
    to: ValueFn<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public between<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    path: K1 | [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]],
    from: ValueFn<T, unknown>,
    to: ValueFn<T, unknown>,
  ): this {
    if (!Array.isArray(path)) {
      path = [path];
    }

    const pathName = this.names.add(...path);
    const valueName = String(path[path.length - 1]);

    const fromStr =
      typeof from === 'function'
        ? from(pathName)
        : this.values.add(valueName, from);

    const toStr =
      typeof to === 'function' ? to(pathName) : this.values.add(valueName, to);

    return this.append('AND', `${pathName} BETWEEN ${fromStr} AND ${toStr}`);
  }

  public and(fn: ConditionGenerator<T>): this {
    return this.append(
      'AND',
      fn(new ConditionExpression(this.names, this.values)),
    );
  }

  public or(fn: ConditionGenerator<T>): this {
    return this.append(
      'OR',
      fn(new ConditionExpression(this.names, this.values)),
    );
  }

  private append(
    operand: keyof typeof OppsiteOperandMatch,
    item: ConditionExpression<T> | string,
  ): this {
    const condition =
      typeof item === 'string'
        ? new ConditionExpression(this.names, this.values, item)
        : item;

    const conditionStr = condition.serialize();
    if (conditionStr) {
      if (this.expression) {
        if (
          this.expression.match(OppsiteOperandMatch[operand]) &&
          !this.expression.match(/^\(.*\)$/)
        ) {
          this.expression = `(${this.expression})`;
        }

        this.expression += ` ${operand} `;
      }

      if (
        conditionStr.match(OppsiteOperandMatch[operand]) &&
        !conditionStr.match(/^\(.*\)$/)
      ) {
        this.expression += `(${conditionStr})`;
      } else {
        this.expression += conditionStr;
      }
    }

    return this;
  }

  public serialize(): string | undefined {
    return this.expression || undefined;
  }
}
