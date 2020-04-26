import DocumentClient, {
  Item,
  UpdateItemInput,
  UpdateItemOutput,
} from '../DocumentClient';
import Query, { QueryRequest } from './Query';
import {
  ConditionExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues,
  UpdateExpression,
} from '../expressions';
import { SetValue } from '../expressions/UpdateExpression';
import { ConditionGenerator } from '../expressions/ConditionExpression';

type QueryInput<K> = Omit<UpdateItemInput, 'Key'> & { Key: K };
type QueryOutput<T> = Omit<UpdateItemOutput, 'Attributes'> & {
  Attributes?: T;
};

export default class UpdateQuery<T extends K, K extends Item> extends Query<
  QueryInput<K>,
  QueryOutput<T>
> {
  private names!: ExpressionAttributeNames<T>;
  private values!: ExpressionAttributeValues;
  private conditions!: ConditionExpression<T>;
  private update!: UpdateExpression<T>;

  public constructor(client: DocumentClient, params: QueryInput<K>) {
    super(
      client.update.bind(client) as QueryRequest<QueryInput<K>, QueryOutput<T>>,
      params,
    );
  }

  protected handleParamsUpdated(): void {
    this.names = new ExpressionAttributeNames(
      this.params.ExpressionAttributeNames,
    );

    this.values = new ExpressionAttributeValues(
      this.params.ExpressionAttributeValues,
    );

    this.conditions = new ConditionExpression(
      this.names,
      this.values,
      this.params.ConditionExpression,
    );

    this.update = new UpdateExpression(
      this.names,
      this.values,
      this.params.UpdateExpression,
    );
  }

  protected updateParams(): void {
    this.params.ExpressionAttributeNames = this.names.serialize();
    this.params.ExpressionAttributeValues = this.values.serialize();
    this.params.ConditionExpression = this.conditions.serialize();
    this.params.UpdateExpression = this.update.serialize();
  }

  public condition(fn: ConditionGenerator<T>): this {
    this.conditions.and(fn);
    return this;
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
    this.update.set(path as [K1, K2, K3, K4, K5, K6, K7, K8], value);
    return this;
  }

  public return(
    values: 'ALL_OLD' | 'ALL_NEW' | 'UPDATED_OLD' | 'UPDATED_NEW' | 'NONE',
  ): this {
    this.params.ReturnValues = values;
    return this;
  }
}
