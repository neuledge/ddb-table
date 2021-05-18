import { Item } from './DocumentClient';
import { GetQuery, PutQuery, UpdateQuery } from './queries';
import DeleteQuery from './queries/DeleteQuery';
import TableIndex, {
  TableIndexOptions,
  TableIndexOptionsArg,
  TableKey,
  TableKeyArgs,
} from './TableIndex';

export type TableOptions<H, S> = Omit<TableIndexOptions<H, S>, 'indexName'>;

export default class Table<
  T extends Item,
  H extends keyof T,
  S extends keyof T = never,
> extends TableIndex<T, H, S> {
  public constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    opts: TableOptions<H, S> & ([S] extends [never] ? {} : { sortKey: S }),
  ) {
    super(opts);
  }

  public index<P extends Partial<T>, H extends keyof P>(
    name: string,
    primaryKey: H,
  ): TableIndex<P, H, never>;
  public index<P extends Partial<T>, H extends keyof P, S extends keyof P>(
    name: string,
    primaryKey: H,
    sortKey: S,
  ): TableIndex<P, H, S>;
  public index<
    P extends Partial<T>,
    H extends keyof P,
    S extends keyof P = never,
  >(name: string, primaryKey: H, sortKey?: S): TableIndex<P, H, S> {
    return new TableIndex({
      tableName: this.name,
      indexName: name,
      primaryKey,
      sortKey,
      documentClient: this.client,
    } as unknown as TableIndexOptionsArg<H, S>);
  }

  public put(item: T): PutQuery<T> {
    return new PutQuery<T>(this.client, {
      TableName: this.name,
      Item: item,
    });
  }

  public get(...args: TableKeyArgs<T, H, S>): GetQuery<T, TableKey<T, H, S>> {
    return new GetQuery(this.client, {
      TableName: this.name,
      Key: this.key(...args),
    });
  }

  public update(
    ...args: TableKeyArgs<T, H, S>
  ): UpdateQuery<T, TableKey<T, H, S>> {
    return new UpdateQuery(this.client, {
      TableName: this.name,
      Key: this.key(...args),
    });
  }

  public delete(
    ...args: TableKeyArgs<T, H, S>
  ): DeleteQuery<T, TableKey<T, H, S>> {
    return new DeleteQuery(this.client, {
      TableName: this.name,
      Key: this.key(...args),
    });
  }
}
