import DocumentClient, {
  Item,
  PutItemInput,
  PutItemOutput,
} from '../DocumentClient';
import Query, { QueryRequest } from './Query';
import {
  ConditionExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues,
} from '../expressions';
import { ConditionGenerator } from '../expressions/ConditionExpression';

type QueryInput<T> = Omit<PutItemInput, 'Item'> & { Item: T };
type QueryOutput<T> = Omit<PutItemOutput, 'Attributes'> & {
  Attributes?: T;
};

export default class PutQuery<T extends Item> extends Query<
  QueryInput<T>,
  QueryOutput<T>
> {
  private names!: ExpressionAttributeNames<T>;
  private values!: ExpressionAttributeValues;
  private conditions!: ConditionExpression<T>;

  public constructor(client: DocumentClient, params: QueryInput<T>) {
    super(
      client.put.bind(client) as QueryRequest<QueryInput<T>, QueryOutput<T>>,
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
  }

  protected updateParams(): void {
    this.params.ExpressionAttributeNames = this.names.serialize();
    this.params.ExpressionAttributeValues = this.values.serialize();
    this.params.ConditionExpression = this.conditions.serialize();
  }

  public condition(fn: ConditionGenerator<T>): this {
    this.conditions.and(fn);
    return this;
  }

  public return(values: 'ALL_OLD' | 'NONE'): this {
    this.params.ReturnValues = values;
    return this;
  }
}
