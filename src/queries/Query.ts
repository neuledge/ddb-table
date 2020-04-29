import {
  AWSRequest,
  DeleteItemInput,
  GetItemInput,
  Item,
  PutItemInput,
  QueryInput,
  ScanInput,
  UpdateItemInput,
} from '../DocumentClient';
import { ExpressionAttributeNames } from '../expressions';

export type QueryRequest<I, O> = (params: I) => AWSRequest<O>;

type Inputs =
  | PutItemInput
  | GetItemInput
  | ScanInput
  | QueryInput
  | UpdateItemInput
  | DeleteItemInput;

export default class Query<T extends Item, I extends Inputs, O> {
  protected readonly input: I;
  private readonly request: QueryRequest<I, O>;
  protected names!: ExpressionAttributeNames<T>;

  protected constructor(request: QueryRequest<I, O>, params: I) {
    this.input = params;
    this.request = request;

    this.handleInputUpdated();
  }

  protected handleInputUpdated(): void {
    this.names = new ExpressionAttributeNames(
      this.input.ExpressionAttributeNames,
    );
  }

  protected syncInput(): void {
    this.input.ExpressionAttributeNames = this.names.serialize();
  }

  public calcCapacity(mode: 'INDEXES' | 'TOTAL' | 'NONE'): this {
    this.input.ReturnConsumedCapacity = mode;
    return this;
  }

  public extend(input: I): this {
    Object.assign(this.input, input);
    this.handleInputUpdated();

    return this;
  }

  public serialize(): I {
    this.syncInput();

    return this.input;
  }

  public requestOnly(): ReturnType<QueryRequest<I, O>> {
    return this.request(this.input);
  }

  public exec(): Promise<O> {
    return this.requestOnly().promise();
  }
}
