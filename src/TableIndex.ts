import DynamoDBDocument, { Item } from './DocumentClient';
import ScanQuery from './queries/ScanQuery';
import QueryQuery from './queries/QueryQuery';

export interface TableIndexOptions<H, S> {
  tableName: string;
  indexName?: string;
  primaryKey: H;
  sortKey?: S;
  documentClient: DynamoDBDocument;
}
export type TableIndexOptionsArg<H, S> = TableIndexOptions<H, S> &
  // eslint-disable-next-line @typescript-eslint/ban-types
  ([S] extends [never] ? {} : { sortKey: S });

export type TableKeyArgs<T, H extends keyof T, S extends keyof T = never> = [
  S,
] extends [never]
  ? [T[H], undefined?]
  : [T[H], T[S]];

export type TableKey<T, H extends keyof T, S extends keyof T = never> = {
  [K in keyof T & (H | S)]: [K] extends [H | S] ? T[K] : never;
};

export default class TableIndex<
  T extends Item,
  H extends keyof T,
  S extends keyof T = never,
  // P extends keyof T = keyof T
> {
  public readonly name: string;
  public readonly indexName?: string;
  public readonly primaryKey: H;
  public readonly sortKey?: S;
  protected readonly client: DynamoDBDocument;

  public constructor(opts: TableIndexOptionsArg<H, S>) {
    this.client = opts.documentClient;

    this.name = opts.tableName;
    this.indexName = opts.indexName;
    this.primaryKey = opts.primaryKey;
    this.sortKey = opts.sortKey;
  }

  public key(
    ...[primaryKey, sortKey]: TableKeyArgs<T, H, S>
  ): TableKey<T, H, S> {
    return {
      [this.primaryKey]: primaryKey,
      ...(this.sortKey ? { [this.sortKey]: sortKey } : null),
    } as TableKey<T, H, S>;
  }

  public scan(): ScanQuery<T, TableKey<T, H, S>> {
    return new ScanQuery(this.client, {
      TableName: this.name,
      IndexName: this.indexName,
    });
  }

  public query(): QueryQuery<T, TableKey<T, H, S>> {
    return new QueryQuery(this.client, {
      TableName: this.name,
      IndexName: this.indexName,
    });
  }
}
