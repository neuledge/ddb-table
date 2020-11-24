import ExpressionAttributes from './ExpressionAttributes';

export default class ExpressionAttributeValues extends ExpressionAttributes<unknown> {
  public static escape(name: string): string {
    return `:${name.replace(/[^\w_]/, '')}`;
  }

  public add(key: string, value: unknown): string {
    return this.setValue(ExpressionAttributeValues.escape(key), value);
  }
}
