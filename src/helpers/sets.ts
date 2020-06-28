import {
  StringSet as AWSStringSet,
  NumberSet as AWSNumberSet,
  BinarySet as AWSBinarySet,
} from '../DocumentClient';

export interface StringSet<T extends string = string> extends AWSStringSet {
  values: T[];
}

export interface NumberSet<T extends number = number> extends AWSNumberSet {
  values: T[];
}

export interface BinarySet<T extends Buffer | ArrayBuffer = Buffer>
  extends AWSBinarySet {
  type: 'Binary';
  values: T[];
}

export type Set<T extends Buffer | ArrayBuffer | number | string> = [
  T,
] extends [string]
  ? StringSet<T>
  : [T] extends [number]
  ? NumberSet<T>
  : [T] extends [Buffer | ArrayBuffer]
  ? BinarySet<T>
  : never;

export function setOf<T extends Buffer | ArrayBuffer | number | string>(
  ...values: T[]
): Set<T> {
  const firstType = typeof values[0];

  return ({
    type:
      firstType === 'string'
        ? 'String'
        : firstType === 'number'
        ? 'Number'
        : 'Binary',
    values,
  } as unknown) as Set<T>;
}
