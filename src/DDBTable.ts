// import { between, AttributePath } from '@aws/dynamodb-expressions';
import DocumentClient, {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
  Item,
} from './DocumentClient';
import {
  ExpressionAttributeNames,
  ExpressionAttributeValues,
} from './expressions';
import { GetQuery, PutQuery, UpdateQuery } from './queries';
import ScanQuery from './queries/ScanQuery';
import DeleteQuery from './queries/DeleteQuery';
import QueryQuery from './queries/QueryQuery';

export interface TableOptions<P, S> {
  tableName: string;
  primaryKey: P;
  sortKey?: S;
  documentClient?: DocumentClient;
}

export type TableKeyArgs<T, P extends keyof T, S extends keyof T = never> = [
  S,
] extends [keyof T]
  ? [T[P], T[S]]
  : [T[P], undefined?];

export type TableKey<T, P extends keyof T, S extends keyof T = never> = {
  [K in keyof T & (P | S)]: [K] extends [P | S] ? T[K] : never;
};

export default class DDBTable<
  T extends Item,
  P extends keyof T,
  S extends keyof T = never
> {
  public readonly name: string;
  public readonly primaryKey: keyof T;
  public readonly sortKey?: keyof T;
  private readonly client: DocumentClient;

  public constructor(
    opts: TableOptions<P, S> & ([S] extends [never] ? {} : { sortKey: S }),
  ) {
    this.client = opts.documentClient || new DocumentClient();

    this.name = opts.tableName;
    this.primaryKey = opts.primaryKey;
    this.sortKey = opts.sortKey;
  }

  public key(
    ...[primaryKey, sortKey]: TableKeyArgs<T, P, S>
  ): TableKey<T, P, S> {
    return {
      [this.primaryKey]: primaryKey,
      ...(this.sortKey ? { [this.sortKey]: sortKey } : null),
    } as TableKey<T, P, S>;
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

  public get(...args: TableKeyArgs<T, P, S>): GetQuery<T, TableKey<T, P, S>> {
    return new GetQuery(this.client, {
      TableName: this.name,
      Key: this.key(...args),
    });
  }

  public scan(): ScanQuery<T, TableKey<T, P, S>> {
    return new ScanQuery(this.client, {
      TableName: this.name,
    });
  }

  public query(): QueryQuery<T, TableKey<T, P, S>> {
    return new QueryQuery(this.client, {
      TableName: this.name,
    });
  }

  public update(
    ...args: TableKeyArgs<T, P, S>
  ): UpdateQuery<T, TableKey<T, P, S>> {
    return new UpdateQuery(this.client, {
      TableName: this.name,
      Key: this.key(...args),
    });
  }

  public delete(
    ...args: TableKeyArgs<T, P, S>
  ): DeleteQuery<T, TableKey<T, P, S>> {
    return new DeleteQuery(this.client, {
      TableName: this.name,
      Key: this.key(...args),
    });
  }
}
