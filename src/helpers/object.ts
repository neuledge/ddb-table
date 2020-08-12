// eslint-disable-next-line @typescript-eslint/ban-types
export function isEmpty(obj: {}): boolean {
  for (const key in obj) {
    return false;
  }

  return true;
}
