import DynamoDBDocument, {
  Item,
  PutCommandInput,
  PutCommandOutput,
} from '../DocumentClient';
import Query, { QueryRequest } from './Query';
import { ConditionExpression, ExpressionAttributeValues } from '../expressions';
import { ConditionGenerator } from '../expressions/ConditionExpression';

type QueryInput<T> = Omit<PutCommandInput, 'Item'> & { Item: T };
type QueryOutput<T> = Omit<PutCommandOutput, 'Attributes'> & {
  Attributes?: T;
};

export default class PutQuery<T extends Item> extends Query<
  T,
  QueryInput<T>,
  QueryOutput<T>
> {
  private values!: ExpressionAttributeValues;
  private conditions!: ConditionExpression<T>;

  public constructor(client: DynamoDBDocument, params: QueryInput<T>) {
    super(
      client.put.bind(client) as QueryRequest<QueryInput<T>, QueryOutput<T>>,
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
  }

  protected syncInput(): void {
    super.syncInput();

    this.input.ExpressionAttributeValues = this.values.serialize();
    this.input.ConditionExpression = this.conditions.serialize();
  }

  public condition(fn: ConditionGenerator<T>): this {
    this.conditions.and(fn);
    return this;
  }

  public return(values: 'ALL_OLD' | 'NONE'): this {
    this.input.ReturnValues = values;
    return this;
  }
}
