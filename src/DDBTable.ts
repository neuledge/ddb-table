// import { between, AttributePath } from '@aws/dynamodb-expressions';
import DocumentClient, {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
  Item,
} from './DocumentClient';
import PutQuery from './PutQuery';
import ExpressionAttributeNames from './ExpressionAttributeNames';
import ExpressionAttributeValues from './ExpressionAttributeValues';
import GetQuery from './GetQuery';

export interface TableOptions<P, S> {
  tableName: string;
  primaryKey: P;
  sortKey?: S;
  documentClient?: DocumentClient;
}

export interface TableKey<P, S> {
  primaryKey: P;
  sortKey: S;
}

export default class DDBTable<
  T extends Item,
  P extends keyof T,
  S extends keyof T | undefined = undefined
> {
  public readonly name: string;
  public readonly primaryKey: keyof T;
  public readonly sortKey?: keyof T;
  private readonly client: DocumentClient;

  public constructor(
    opts: TableOptions<P, S> & ([S] extends [undefined] ? {} : { sortKey: S }),
  ) {
    this.client = opts.documentClient || new DocumentClient();

    this.name = opts.tableName;
    this.primaryKey = opts.primaryKey;
    this.sortKey = opts.sortKey;
  }

  public createExpressionAttributeNames(
    nameMap?: ExpressionAttributeNameMap,
  ): ExpressionAttributeNames<T> {
    return new ExpressionAttributeNames<T>(nameMap);
  }

  public createExpressionAttributeValues(
    valueMap?: ExpressionAttributeValueMap,
  ): ExpressionAttributeValues {
    return new ExpressionAttributeValues(valueMap);
  }

  public put(item: T): PutQuery<T> {
    return new PutQuery<T>(this.client, {
      TableName: this.name,
      Item: item,
    });
  }

  public get(
    ...[primaryKey, sortKey]: [S] extends [keyof T]
      ? [T[P], T[S]]
      : [T[P], undefined?]
  ): GetQuery<T> {
    return new GetQuery(this.client, {
      TableName: this.name,
      Key: {
        [this.primaryKey]: primaryKey,
        ...(this.sortKey ? { [this.sortKey]: sortKey } : null),
      },
    });
  }
}
