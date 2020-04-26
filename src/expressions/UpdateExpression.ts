import { UpdateExpression as UpdateExpressionStr } from '../DocumentClient';
import ExpressionAttributeNames from './ExpressionAttributeNames';
import ExpressionAttributeValues from './ExpressionAttributeValues';

// Docs:
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AddDeleteValue<T> = [T] extends [{ type: string; values: any[] }]
  ? T['values'][number]
  : [T] extends number
  ? T
  : never;

export type SetValue<T, V> =
  | V
  | ((
      path: string,
      names: ExpressionAttributeNames<T>,
      values: ExpressionAttributeValues,
    ) => string);

export default class UpdateExpression<T> {
  private names: ExpressionAttributeNames<T>;
  private values: ExpressionAttributeValues;

  private sets: { [key: string]: string };
  private removes: { [key: string]: 1 };
  private adds: { [key: string]: string };
  private deletes: { [key: string]: string };

  public constructor(
    names: ExpressionAttributeNames<T>,
    values: ExpressionAttributeValues,
    init?: UpdateExpressionStr,
  ) {
    this.names = names;
    this.values = values;

    this.sets = {};
    this.removes = {};
    this.adds = {};
    this.deletes = {};

    if (!init) return;

    const parts = init
      .trim()
      .split(/(?:^|\s+)(SET|REMOVE|ADD|DELETE)(?:\s+)/gi);
    for (let i = 1; i < parts.length; i += 2) {
      const action = parts[i];
      const terms = parts[i + 1].split(/\s*,\s*/g);

      switch (action.toUpperCase()) {
        case 'SET': {
          for (const term of terms) {
            const [path, value] = term.split(/\s*=\s*/);
            this.sets[path] = value;
          }
          break;
        }

        case 'REMOVE': {
          for (const term of terms) {
            this.removes[term] = 1;
          }
          break;
        }

        case 'ADD': {
          for (const term of terms) {
            const [path, value] = term.split(/\s+/);
            this.adds[path] = value;
          }
          break;
        }

        case 'DELETE': {
          for (const term of terms) {
            const [path, value] = term.split(/\s+/);
            this.deletes[path] = value;
          }
          break;
        }
      }
    }
  }

  public set<K1 extends keyof T>(
    path: K1 | [K1],
    value: SetValue<T, T[K1]>,
  ): this;
  public set<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: SetValue<T, T[K1][K2]>,
  ): this;
  public set<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: SetValue<T, T[K1][K2][K3]>): this;
  public set<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: SetValue<T, T[K1][K2][K3][K4]>): this;
  public set<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    path: [K1, K2, K3, K4, K5],
    value: SetValue<T, T[K1][K2][K3][K4][K5]>,
  ): this;
  public set<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: SetValue<T, T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public set<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: SetValue<T, T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public set<
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
    value: SetValue<T, T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public set<
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
    value: SetValue<T, unknown>,
  ): this {
    if (!Array.isArray(path)) {
      path = [path];
    }

    const pathName = this.names.add(...path);

    this.sets[pathName] =
      typeof value === 'function'
        ? value(pathName, this.names, this.values)
        : this.values.add(String(path[path.length - 1]), value);

    return this;
  }

  public remove<
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
  ): this {
    this.removes[this.names.add(...path)] = 1;

    return this;
  }

  public add<K1 extends keyof T>(
    path: K1 | [K1],
    value: AddDeleteValue<T[K1]>,
  ): this;
  public add<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: AddDeleteValue<T[K1][K2]>,
  ): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: AddDeleteValue<T[K1][K2][K3]>): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: AddDeleteValue<T[K1][K2][K3][K4]>): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    path: [K1, K2, K3, K4, K5],
    value: AddDeleteValue<T[K1][K2][K3][K4][K5]>,
  ): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: AddDeleteValue<T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: AddDeleteValue<T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public add<
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
    value: AddDeleteValue<T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public add<
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
    value: unknown,
  ): this {
    if (!Array.isArray(path)) {
      path = [path];
    }

    this.adds[this.names.add(...path)] = this.values.add(
      String(path[path.length - 1]),
      value,
    );

    return this;
  }

  public delete<K1 extends keyof T>(
    path: K1 | [K1],
    value: AddDeleteValue<T[K1]>,
  ): this;
  public delete<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: AddDeleteValue<T[K1][K2]>,
  ): this;
  public delete<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: AddDeleteValue<T[K1][K2][K3]>): this;
  public delete<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: AddDeleteValue<T[K1][K2][K3][K4]>): this;
  public delete<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    path: [K1, K2, K3, K4, K5],
    value: AddDeleteValue<T[K1][K2][K3][K4][K5]>,
  ): this;
  public delete<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: AddDeleteValue<T[K1][K2][K3][K4][K5][K6]>,
  ): this;
  public delete<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6]
  >(
    path: [K1, K2, K3, K4, K5, K6, K7],
    value: AddDeleteValue<T[K1][K2][K3][K4][K5][K6][K7]>,
  ): this;
  public delete<
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
    value: AddDeleteValue<T[K1][K2][K3][K4][K5][K6][K7][K8]>,
  ): this;
  public delete<
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
    value: unknown,
  ): this {
    if (!Array.isArray(path)) {
      path = [path];
    }

    this.deletes[this.names.add(...path)] = this.values.add(
      String(path[path.length - 1]),
      value,
    );

    return this;
  }

  public serialize(): UpdateExpressionStr | undefined {
    const exp: string[] = [];

    const sets = Object.entries(this.sets).map(
      ([key, value]) => `${key} = ${value}`,
    );
    if (sets.length) {
      exp.push(`SET ${sets.join(', ')}`);
    }

    const removes = Object.keys(this.removes);
    if (removes.length) {
      exp.push(`REMOVE ${removes.join(', ')}`);
    }

    const adds = Object.entries(this.adds).map(
      ([key, value]) => `${key} ${value}`,
    );
    if (adds.length) {
      exp.push(`ADD ${adds.join(', ')}`);
    }

    const deletes = Object.entries(this.deletes).map(
      ([key, value]) => `${key} ${value}`,
    );
    if (deletes.length) {
      exp.push(`DELETE ${deletes.join(', ')}`);
    }

    return exp.join(' ') || undefined;
  }
}
