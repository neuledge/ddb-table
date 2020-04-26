import ExpressionAttributeNames from './ExpressionAttributeNames';
import ExpressionAttributeValues from './ExpressionAttributeValues';

// Docs:
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html

export type ConditionGenerator<T> = (
  names: ExpressionAttributeNames<T>,
  values: ExpressionAttributeValues,
) => string;

export default class ConditionExpression<T> {
  private names: ExpressionAttributeNames<T>;
  private values: ExpressionAttributeValues;

  private expression: string;

  public constructor(
    names: ExpressionAttributeNames<T>,
    values: ExpressionAttributeValues,
    init?: string,
  ) {
    this.names = names;
    this.values = values;

    this.expression = init?.trim().replace(/\s+/g, ' ') || '';
  }

  public and(fn: ConditionGenerator<T>): this {
    if (this.expression) {
      this.expression += ' AND ';
    }

    let condition = fn(this.names, this.values).trim().replace(/\s+/g, ' ');
    if (condition.match(/[ )]OR[ (]/i) && !condition.match(/^\(.*\)$/)) {
      condition = `(${condition})`;
    }

    this.expression += condition;

    return this;
  }

  public serialize(): string | undefined {
    return this.expression || undefined;
  }
}
