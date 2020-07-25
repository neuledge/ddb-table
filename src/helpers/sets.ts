import DocumentClient, {
  StringSet as AWSStringSet,
  NumberSet as AWSNumberSet,
  BinarySet as AWSBinarySet,
  BinaryType,
} from '../DocumentClient';

export interface StringSet<T extends string = string> extends AWSStringSet {
  values: T[];
}

export interface NumberSet<T extends number = number> extends AWSNumberSet {
  values: T[];
}

export interface BinarySet<T extends BinaryType = Buffer> extends AWSBinarySet {
  values: T[];
}

export type Set<T extends BinaryType | number | string> = [T] extends [string]
  ? StringSet<T>
  : [T] extends [number]
  ? NumberSet<T>
  : [T] extends [BinaryType]
  ? BinarySet<T>
  : never;

export function setOf<T extends BinaryType | number | string>(
  ...values: T[]
): Set<T> {
  return DocumentClient.prototype.createSet.call(null, values) as Set<T>;
}
