import { Item, Key, ScanInput, QueryInput } from '../DocumentClient';
import Query from './Query';
import {
  ConditionExpression,
  ExpressionAttributeValues,
  ProjectionExpression,
} from '../expressions';
import { ProjectionFields } from '../expressions/ProjectionExpression';
import { ConditionGenerator } from '../expressions/ConditionExpression';

export default class ItemsQuery<
  T extends K,
  K extends Item,
  I extends ScanInput | QueryInput,
  O extends { Items?: T[]; LastEvaluatedKey?: K },
> extends Query<T, I, O> {
  protected values!: ExpressionAttributeValues;
  protected projection!: ProjectionExpression<T, K>;
  protected filters!: ConditionExpression<T>;

  protected handleInputUpdated(): void {
    super.handleInputUpdated();

    this.values = new ExpressionAttributeValues(
      this.input.ExpressionAttributeValues,
    );

    this.projection = new ProjectionExpression(
      this.names,
      this.input.ProjectionExpression,
    );

    this.filters = new ConditionExpression(
      this.names,
      this.values,
      this.input.FilterExpression,
    );
  }

  protected syncInput(): void {
    super.syncInput();

    this.input.ExpressionAttributeValues = this.values.serialize();
    this.input.ProjectionExpression = this.projection.serialize();
    this.input.FilterExpression = this.filters.serialize();
  }

  public project<P extends ProjectionFields<T>>(fields: P): this {
    this.projection.add(fields);
    return this;
  }

  public filter(fn: ConditionGenerator<T>): this {
    this.filters.and(fn);
    return this;
  }

  public select(
    select:
      | 'ALL_ATTRIBUTES'
      | 'ALL_PROJECTED_ATTRIBUTES'
      | 'SPECIFIC_ATTRIBUTES'
      | 'COUNT',
  ): this {
    this.input.Select = select;
    return this;
  }

  public limit(limit: number): this {
    this.input.Limit = limit;

    return this;
  }

  public startKey(key: K | Key | null | undefined): this {
    this.input.ExclusiveStartKey = key || undefined;

    return this;
  }

  public async *entries(): AsyncIterableIterator<T> {
    do {
      const { Items, LastEvaluatedKey } = await this.exec();

      if (Items) {
        yield* Items;
      }

      this.startKey(LastEvaluatedKey);
    } while (this.input.ExclusiveStartKey);
  }
}
