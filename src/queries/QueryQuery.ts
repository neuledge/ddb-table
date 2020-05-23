import DocumentClient, {
  Item,
  QueryInput as AWSQueryInput,
  QueryOutput as AWSQueryOutput,
} from '../DocumentClient';
import { QueryRequest } from './Query';
import {
  ItemProjection,
  ProjectionFields,
} from '../expressions/ProjectionExpression';
import ItemsQuery from './ItemsQuery';
import { ConditionExpression } from '../expressions';
import { ConditionGenerator } from '../expressions/ConditionExpression';

type QueryInput = AWSQueryInput;
type QueryOutput<T, K> = Omit<AWSQueryOutput, 'Items'> & {
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

  public constructor(client: DocumentClient, params: QueryInput) {
    super(
      client.query.bind(client) as QueryRequest<QueryInput, QueryOutput<T, K>>,
      params,
    );
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

  public keyCondition(fn: ConditionGenerator<T>): this {
    this.keyConditions.and(fn);
    return this;
  }
}
