import {
  AttributeName,
  ExpressionAttributeNameMap,
  Item,
} from './DocumentClient';
import { ProjectionFields } from './Query';

export type NameProxy<T> = {
  [K in keyof T]: T[K] extends object ? NameProxy<T[K]> : string;
};

export default class ExpressionAttributeNames<T extends Item> {
  private readonly nameMap: ExpressionAttributeNameMap;
  private readonly prefix?: string;

  public constructor(nameMap?: ExpressionAttributeNameMap, prefix?: string) {
    this.nameMap = nameMap || {};
    this.prefix = prefix;
  }

  public static escape(name: string): string {
    return `#${name.replace(/[^\w_]/, '')}`;
  }

  public get(key: keyof T): string {
    if (typeof key === 'number') {
      return this.prefix ? `${this.prefix}[${key}]` : `[${key}]`;
    }

    const keyStr = String(key);

    const escapedName = ExpressionAttributeNames.escape(keyStr);

    let name = escapedName;
    let i = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const record = this.nameMap[name];

      if (!record) {
        this.nameMap[name] = keyStr;
        break;
      } else if (record === keyStr) {
        break;
      }

      name = `${escapedName}${i}`;
      i += 1;
    }

    return this.prefix ? `${this.prefix}.${name}` : name;
  }

  public path<K extends keyof T>(key: K): ExpressionAttributeNames<T[K]> {
    return new ExpressionAttributeNames<T[K]>(this.nameMap, this.get(key));
  }

  public project<P extends ProjectionFields<T>>(fields: P): AttributeName[] {
    const attributeNames: AttributeName[] = [];

    Object.entries(fields).forEach(([key, value]) => {
      if (!value) return;

      if (typeof value !== 'object') {
        attributeNames.push(this.get(key));
        return;
      }

      attributeNames.push(...this.path(key).project(value));
    });

    return attributeNames;
  }

  public serialize(): ExpressionAttributeNameMap {
    return this.nameMap;
  }

  public proxy(): NameProxy<T> {
    return this.createProxy();
  }

  private createProxy(value?: string): NameProxy<T> {
    return new Proxy<T>({} as T, {
      get: (target, prop: keyof T): (() => string) | NameProxy<T> => {
        if (prop === Symbol.toPrimitive) {
          return (): string => value || this.toString();
        } else {
          if ((prop as string).match(/^\d+$/)) {
            prop = Number(prop);
          }

          return this.path(prop).createProxy(this.get(prop));
        }
      },
    });
  }
}
