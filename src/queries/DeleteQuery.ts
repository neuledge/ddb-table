import DynamoDBDocument, {
  DeleteCommandInput,
  DeleteCommandOutput,
  Item,
} from '../DocumentClient';
import Query, { QueryRequest } from './Query';
import { ConditionExpression, ExpressionAttributeValues } from '../expressions';
import { ConditionGenerator } from '../expressions/ConditionExpression';

type QueryInput<K> = Omit<DeleteCommandInput, 'Key'> & { Key: K };
type QueryOutput<T> = Omit<DeleteCommandOutput, 'Attributes'> & {
  Attributes?: T;
};

export default class DeleteQuery<T extends K, K extends Item> extends Query<
  T,
  QueryInput<K>,
  QueryOutput<T>
> {
  private values!: ExpressionAttributeValues;
  private conditions!: ConditionExpression<T>;

  public constructor(client: DynamoDBDocument, params: QueryInput<K>) {
    super(
      client.delete.bind(client) as QueryRequest<QueryInput<K>, QueryOutput<T>>,
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
}
