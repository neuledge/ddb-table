import DocumentClient, { Item, ScanInput, ScanOutput } from '../DocumentClient';
import { QueryRequest } from './Query';
import {
  ItemProjection,
  ProjectionFields,
} from '../expressions/ProjectionExpression';
import ItemsQuery from './ItemsQuery';

type QueryInput = ScanInput;
type QueryOutput<T, K> = Omit<ScanOutput, 'Items'> & {
  Items?: T[];
  LastEvaluatedKey?: K;
};

export default class ScanQuery<T extends K, K extends Item> extends ItemsQuery<
  T,
  K,
  QueryInput,
  QueryOutput<T, K>
> {
  public constructor(client: DocumentClient, params: QueryInput) {
    super(
      client.scan.bind(client) as QueryRequest<QueryInput, QueryOutput<T, K>>,
      params,
    );

    this.handleInputUpdated();
  }

  public project<P extends ProjectionFields<T>>(
    fields: P,
  ): this & ScanQuery<K & ItemProjection<T, P>, K> {
    return super.project(fields);
  }

  public segment(index: number, total: number): this {
    this.input.Segment = index;
    this.input.TotalSegments = total;

    return this;
  }
}
