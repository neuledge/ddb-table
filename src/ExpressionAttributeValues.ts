import { ExpressionAttributeValueMap } from './DocumentClient';

export default class ExpressionAttributeValues {
  private readonly valueMap: ExpressionAttributeValueMap;

  public constructor(valueMap?: ExpressionAttributeValueMap) {
    this.valueMap = valueMap || {};
  }

  public static escape(name: string): string {
    return `:${name.replace(/[^\w_]/, '')}`;
  }

  public set(key: string, value: unknown): string {
    const escapedName = ExpressionAttributeValues.escape(key);

    let name = escapedName;
    let i = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const record = this.valueMap[name];

      if (!record) {
        this.valueMap[name] = value;
        break;
      } else if (record === value) {
        break;
      }

      name = `${escapedName}${i}`;
      i += 1;
    }

    return name;
  }

  public serialize(): ExpressionAttributeValueMap {
    return this.valueMap;
  }
}
