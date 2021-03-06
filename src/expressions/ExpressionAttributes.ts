import { isEmpty } from '../helpers/object';

export type ExpressionAttributesMap<T> = { [key: string]: T };

export default class ExpressionAttributes<T> {
  private readonly attributesMap: ExpressionAttributesMap<T>;

  public constructor(init?: ExpressionAttributesMap<T>) {
    this.attributesMap = { ...init };
  }

  protected setValue(requestedKey: string, value: T): string {
    let key = requestedKey;
    let i = 2;

    while (key in this.attributesMap) {
      if (this.attributesMap[key] === value) {
        return key;
      }

      key = `${requestedKey}${i}`;
      i += 1;
    }

    this.attributesMap[key] = value;
    return key;
  }

  public serialize(): ExpressionAttributesMap<T> | undefined {
    if (isEmpty(this.attributesMap)) {
      return undefined;
    }

    return this.attributesMap;
  }
}
