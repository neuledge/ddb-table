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

  public extend(input: Partial<I>): this {
    this.syncInput();
    Object.assign(this.input, input);
    this.handleInputUpdated();

    return this;
  }

  public serialize(): I {
    this.syncInput();

    for (const key in this.input) {
      if (this.input[key] === undefined) {
        delete this.input[key];
      }
    }

    return this.input;
  }

  public requestOnly(): ReturnType<QueryRequest<I, O>> {
    return this.request(this.serialize());
  }

  public exec(): Promise<O> {
    return this.requestOnly().promise();
  }
}
