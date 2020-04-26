import { AWSRequest } from '../DocumentClient';

export type QueryRequest<I, O> = (params: I) => AWSRequest<O>;

export default class Query<T, O> {
  protected readonly params: T;
  private readonly request: QueryRequest<T, O>;

  protected constructor(request: QueryRequest<T, O>, params: T) {
    this.params = params;
    this.request = request;

    this.handleParamsUpdated();
  }

  protected handleParamsUpdated(): void {
    // nothing to do
  }

  protected updateParams(): void {
    // nothing to do
  }

  public extend(params: T): this {
    Object.assign(this.params, params);
    this.handleParamsUpdated();

    return this;
  }

  public serialize(): T {
    this.updateParams();

    return this.params;
  }

  public requestOnly(): ReturnType<QueryRequest<T, O>> {
    return this.request(this.params);
  }

  public exec(): Promise<O> {
    return this.requestOnly().promise();
  }
}
