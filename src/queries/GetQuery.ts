import DocumentClient, {
  GetItemInput,
  GetItemOutput,
  Item,
} from '../DocumentClient';
import Query, { QueryRequest } from './Query';
import { ProjectionExpression } from '../expressions';
import {
  ItemProjection,
  ProjectionFields,
} from '../expressions/ProjectionExpression';

type QueryInput<K> = Omit<GetItemInput, 'Key'> & { Key: K };
type QueryOutput<T> = Omit<GetItemOutput, 'Item'> & { Item?: T };

export default class GetQuery<T extends K, K extends Item> extends Query<
  T,
  QueryInput<K>,
  QueryOutput<T>
> {
  private projection!: ProjectionExpression<T, K>;

  public constructor(client: DocumentClient, params: QueryInput<K>) {
    super(
      client.get.bind(client) as QueryRequest<QueryInput<K>, QueryOutput<T>>,
      params,
    );

    this.handleInputUpdated();
  }

  protected handleInputUpdated(): void {
    super.handleInputUpdated();

    this.projection = new ProjectionExpression(
      this.names,
      this.input.ProjectionExpression,
    );
  }

  protected syncInput(): void {
    super.syncInput();

    this.input.ProjectionExpression = this.projection.serialize();
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
