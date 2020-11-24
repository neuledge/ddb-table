import DocumentClient, {
  Item,
  UpdateItemInput,
  UpdateItemOutput,
} from '../DocumentClient';
import Query, { QueryRequest } from './Query';
import {
  ConditionExpression,
  ExpressionAttributeValues,
  UpdateExpression,
} from '../expressions';
import {
  SetValue,
  AddValue,
  DeleteValue,
} from '../expressions/UpdateExpression';
import { ConditionGenerator } from '../expressions/ConditionExpression';

type QueryInput<K> = Omit<UpdateItemInput, 'Key'> & { Key: K };
type QueryOutput<T> = Omit<UpdateItemOutput, 'Attributes'> & {
  Attributes?: T;
};

export default class UpdateQuery<T extends K, K extends Item> extends Query<
  T,
  QueryInput<K>,
  QueryOutput<T>
> {
  private values!: ExpressionAttributeValues;
  private conditions!: ConditionExpression<T>;
  private update!: UpdateExpression<T>;

  public constructor(client: DocumentClient, params: QueryInput<K>) {
    super(
      client.update.bind(client) as QueryRequest<QueryInput<K>, QueryOutput<T>>,
      params,
    );

    this.handleInputUpdated();
  }

  protected handleInputUpdated(): void {
    super.handleInputUpdated();

    this.values = new ExpressionAttributeValues(
      this.input.ExpressionAttributeValues,
    );

    this.conditions = new ConditionExpression(
      this.names,
      this.values,
      this.input.ConditionExpression,
    );

    this.update = new UpdateExpression(
      this.names,
      this.values,
      this.input.UpdateExpression,
    );
  }

  protected syncInput(): void {
    super.syncInput();

    this.input.ExpressionAttributeValues = this.values.serialize();
    this.input.ConditionExpression = this.conditions.serialize();
    this.input.UpdateExpression = this.update.serialize();
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
    this.update.set(path as [K1, K2, K3, K4, K5, K6, K7, K8], value as never);
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
    this.update.remove(...path);

    return this;
  }

  public add<K1 extends keyof T>(path: K1 | [K1], value: AddValue<T[K1]>): this;
  public add<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: AddValue<T[K1][K2]>,
  ): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: AddValue<T[K1][K2][K3]>): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: AddValue<T[K1][K2][K3][K4]>): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(path: [K1, K2, K3, K4, K5], value: AddValue<T[K1][K2][K3][K4][K5]>): this;
  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5]
  >(
    path: [K1, K2, K3, K4, K5, K6],
    value: AddValue<T[K1][K2][K3][K4][K5][K6]>,
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
    value: AddValue<T[K1][K2][K3][K4][K5][K6][K7]>,
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
    value: AddValue<T[K1][K2][K3][K4][K5][K6][K7][K8]>,
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
    this.update.add(path as [K1, K2, K3, K4, K5, K6, K7, K8], value as never);
    return this;
  }

  public delete<K1 extends keyof T>(
    path: K1 | [K1],
    value: DeleteValue<T[K1]>,
  ): this;
  public delete<K1 extends keyof T, K2 extends keyof T[K1]>(
    path: [K1, K2],
    value: DeleteValue<T[K1][K2]>,
  ): this;
  public delete<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(path: [K1, K2, K3], value: DeleteValue<T[K1][K2][K3]>): this;
  public delete<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3]
  >(path: [K1, K2, K3, K4], value: DeleteValue<T[K1][K2][K3][K4]>): this;
  public delete<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4]
  >(
    path: [K1, K2, K3, K4, K5],
    value: DeleteValue<T[K1][K2][K3][K4][K5]>,
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
    value: DeleteValue<T[K1][K2][K3][K4][K5][K6]>,
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
    value: DeleteValue<T[K1][K2][K3][K4][K5][K6][K7]>,
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
    value: DeleteValue<T[K1][K2][K3][K4][K5][K6][K7][K8]>,
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
    this.update.delete(
      path as [K1, K2, K3, K4, K5, K6, K7, K8],
      value as never,
    );
    return this;
  }

  public return(
    values: 'ALL_OLD' | 'ALL_NEW' | 'UPDATED_OLD' | 'UPDATED_NEW' | 'NONE',
  ): this {
    this.input.ReturnValues = values;
    return this;
  }
}
