import ExpressionAttributes from './ExpressionAttributes';

export default class ExpressionAttributeNames<
  T
> extends ExpressionAttributes<string> {
  public static escape(name: string): string {
    return `#${name.replace(/[^\w_]/, '')}`;
  }

  public add<
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
    K4 extends keyof T[K1][K2][K3],
    K5 extends keyof T[K1][K2][K3][K4],
    K6 extends keyof T[K1][K2][K3][K4][K5],
    K7 extends keyof T[K1][K2][K3][K4][K5][K6],
    K8 extends keyof T[K1][K2][K3][K4][K5][K6][K7]
  >(
    ...path: [K1, K2?, K3?, K4?, K5?, K6?, K7?, K8?, ...(string | number)[]]
  ): string {
    let res = '';
    for (const key of path) {
      if (res && typeof key === 'number') {
        res += `[${key}]`;
        continue;
      }

      const keyStr = String(key);
      const escapedName = ExpressionAttributeNames.escape(keyStr);
      const name = this.setValue(escapedName, keyStr);

      res = res ? `${res}.${name}` : name;
    }

    return res;
  }
}
