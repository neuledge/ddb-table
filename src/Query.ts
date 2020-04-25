import { AWSRequest, Item } from './DocumentClient';

export type ProjectionFields<T extends Item> = {
  [K in keyof T]?: [T[K]] extends [object]
    ? ProjectionFields<T[K]> | true | false | 1 | 0
    : boolean | 1 | 0;
};

type ProjectionFieldsKeys<
  T extends Item,
  P extends ProjectionFields<T>
> = Exclude<
  {
    [K in keyof T]: [P[K]] extends [true | 1 | object] ? K : never;
  }[keyof T],
  undefined
>;

type ProjectionFieldsMaybeKeys<
  T extends Item,
  P extends ProjectionFields<T>
> = Exclude<
  {
    [K in keyof T]: [P[K]] extends [boolean]
      ? [P[K]] extends [false]
        ? never
        : K
      : never;
  }[keyof T],
  undefined
>;

export type ItemProjection<T extends Item, P extends ProjectionFields<T>> = {
  [K in ProjectionFieldsKeys<T, P>]: [P[K]] extends [object]
    ? ItemProjection<T[K], P[K]>
    : T[K];
} &
  { [K in ProjectionFieldsMaybeKeys<T, P>]?: T[K] };

export type QueryRequest<I, O> = (params: I) => AWSRequest<O>;

export default class Query<T, O> {
  public readonly params: T;
  private readonly request: QueryRequest<T, O>;

  protected constructor(request: QueryRequest<T, O>, params: T) {
    this.params = params;
    this.request = request;
  }

  public extend(params: T): this {
    Object.assign(this.params, params);
    return this;
  }

  public serialize(): T {
    return this.params;
  }

  public requestOnly(): ReturnType<QueryRequest<T, O>> {
    return this.request(this.params);
  }

  public exec(): Promise<O> {
    return this.requestOnly().promise();
  }
}
