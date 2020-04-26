import DocumentClient, {
  GetItemInput,
  GetItemOutput,
  Item,
} from '../DocumentClient';
import Query, { QueryRequest } from './Query';
import { ExpressionAttributeNames, ProjectionExpression } from '../expressions';
import {
  ItemProjection,
  ProjectionFields,
} from '../expressions/ProjectionExpression';

type QueryInput<K> = Omit<GetItemInput, 'Key'> & { Key: K };
type QueryOutput<T> = Omit<GetItemOutput, 'Item'> & { Item?: T };

export default class GetQuery<T extends K, K extends Item> extends Query<
  QueryInput<K>,
  QueryOutput<T>
> {
  private names!: ExpressionAttributeNames<T>;
  private projection!: ProjectionExpression<T, K>;

  public constructor(client: DocumentClient, params: QueryInput<K>) {
    super(
      client.get.bind(client) as QueryRequest<QueryInput<K>, QueryOutput<T>>,
      params,
    );
  }

  protected handleParamsUpdated(): void {
    this.names = new ExpressionAttributeNames<T>(
      this.params.ExpressionAttributeNames,
    );

    this.projection = new ProjectionExpression(
      this.names,
      this.params.ProjectionExpression,
    );
  }

  protected updateParams(): void {
    this.params.ExpressionAttributeNames = this.names.serialize();
    this.params.ProjectionExpression = this.projection.serialize();
  }

  // public attributeNames(): ExpressionAttributeNames<T> {
  //   if (!this.params.ExpressionAttributeNames) {
  //     this.params.ExpressionAttributeNames = {};
  //   }
  //
  //   return new ExpressionAttributeNames<T>(
  //     this.params.ExpressionAttributeNames,
  //   );
  // }

  public project<P extends ProjectionFields<Omit<T, keyof K>>>(
    fields: P,
  ): GetQuery<ItemProjection<Omit<T, keyof K>, P> & K, K> {
    this.projection.add(fields);
    return this;
  }
}
