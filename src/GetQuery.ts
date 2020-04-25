import DocumentClient, {
  GetItemInput,
  GetItemOutput,
  Item,
} from './DocumentClient';
import Query, { ItemProjection, ProjectionFields, QueryRequest } from './Query';
import ExpressionAttributeNames from './ExpressionAttributeNames';

type QueryOutput<T> = Omit<GetItemOutput, 'Item'> & { Item: T };

export default class GetQuery<T extends Item> extends Query<
  GetItemInput,
  QueryOutput<T>
> {
  public constructor(client: DocumentClient, params: GetItemInput) {
    super(
      client.get.bind(client) as QueryRequest<GetItemInput, QueryOutput<T>>,
      params,
    );
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

  public project<P extends ProjectionFields<T>>(
    fields: P,
  ): GetQuery<ItemProjection<T, P>> {
    const attrNames = new ExpressionAttributeNames<T>(
      this.params.ExpressionAttributeNames,
    );

    this.params.ProjectionExpression =
      (this.params.ProjectionExpression?.trim()
        ? `${this.params.ProjectionExpression}, `
        : '') + attrNames.project(fields).join(', ');

    this.params.ExpressionAttributeNames = attrNames.serialize();

    return this;
  }
}
