import ExpressionAttributeNames from './ExpressionAttributeNames';

export type ProjectionFields<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: [T[P]] extends [object]
    ? ProjectionFields<T[P]> | true | false | 1 | 0
    : true | false | 1 | 0;
};

type ProjectionFieldsKeys<T, P extends ProjectionFields<T>> = Exclude<
  {
    // eslint-disable-next-line @typescript-eslint/ban-types
    [K in keyof T]: [P[K]] extends [true | 1 | object] ? K : never;
  }[keyof T],
  undefined
>;

type ProjectionFieldsMaybeKeys<T, P extends ProjectionFields<T>> = Exclude<
  {
    [K in keyof T]: [P[K]] extends [boolean]
      ? [P[K]] extends [false]
        ? never
        : K
      : never;
  }[keyof T],
  undefined
>;

export type ItemProjection<T, P extends ProjectionFields<T>> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in ProjectionFieldsKeys<T, P>]: [P[K]] extends [object]
    ? ItemProjection<T[K], P[K]>
    : T[K];
} & { [K in ProjectionFieldsMaybeKeys<T, P>]?: T[K] };

export default class ProjectionExpression<T extends K, K> {
  private names: ExpressionAttributeNames<T>;
  private paths: { [key: string]: 1 };

  public constructor(names: ExpressionAttributeNames<T>, init?: string) {
    this.names = names;
    this.paths = {};

    if (!init) return;

    const parts = init.trim().split(/\s*,\s*/g);
    for (const part of parts) {
      this.paths[part] = 1;
    }
  }

  public add<P extends ProjectionFields<Omit<T, keyof K>>>(fields: P): this {
    const iterateFields = (
      path: (string | number)[],
      fields: Record<string, unknown>,
    ): void => {
      Object.entries(fields).forEach(([key, value]) => {
        if (!value) return;

        const keyPath = [...path, key.match(/^\d+$/) ? Number(key) : key];

        if (typeof value !== 'object') {
          this.paths[this.names.add(...(keyPath as [keyof T]))] = 1;
          return;
        }

        iterateFields(keyPath, value as Record<string, unknown>);
      });
    };

    iterateFields([], fields);
    return this;
  }

  public serialize(): string | undefined {
    return Object.keys(this.paths).join(', ') || undefined;
  }
}
