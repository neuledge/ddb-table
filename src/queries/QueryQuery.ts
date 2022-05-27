import DynamoDBDocument, {
  Item,
  QueryCommandInput,
  QueryCommandOutput,
} from '../DocumentClient';
import { QueryRequest } from './Query';
import {
  ItemProjection,
  ProjectionFields,
} from '../expressions/ProjectionExpression';
import ItemsQuery from './ItemsQuery';
import { ConditionExpression } from '../expressions';
import { ConditionGenerator } from '../expressions/ConditionExpression';

type QueryInput = QueryCommandInput;
type QueryOutput<T, K> = Omit<QueryCommandOutput, 'Items'> & {
  Items?: T[];
  LastEvaluatedKey?: K;
};

export default class QueryQuery<T extends K, K extends Item> extends ItemsQuery<
  T,
  K,
  QueryInput,
  QueryOutput<T, K>
> {
  protected keyConditions!: ConditionExpression<T>;

  public constructor(client: DynamoDBDocument, params: QueryInput) {
    super(
      client.query.bind(client) as QueryRequest<QueryInput, QueryOutput<T, K>>,
      params,
    );

    this.handleInputUpdated();
  }

  protected handleInputUpdated(): void {
    super.handleInputUpdated();

    this.keyConditions = new ConditionExpression(
      this.names,
      this.values,
      this.input.KeyConditionExpression,
    );
  }

  protected syncInput(): void {
    super.syncInput();

    this.input.KeyConditionExpression = this.keyConditions.serialize();
  }

  public reverseIndex(flag = true): this {
    this.input.ScanIndexForward = !flag;

    return this;
  }

  public project<P extends ProjectionFields<T>>(
    fields: P,
  ): this & QueryQuery<K & ItemProjection<T, P>, K> {
    return super.project(fields);
  }

  public keyCondition(fn: ConditionGenerator<K>): this {
    this.keyConditions.and(fn);
    return this;
  }
}
