import DocumentClient, {
  Item,
  PutItemInput,
  PutItemOutput,
} from './DocumentClient';
import Query, { QueryRequest } from './Query';

export default class PutQuery<T extends Item> extends Query<
  PutItemInput,
  PutItemOutput & { Attributes?: T }
> {
  public constructor(client: DocumentClient, params: PutItemInput) {
    super(
      client.put.bind(params) as QueryRequest<
        PutItemInput,
        PutItemOutput & { Attributes?: T }
      >,
      params,
    );
  }
}
