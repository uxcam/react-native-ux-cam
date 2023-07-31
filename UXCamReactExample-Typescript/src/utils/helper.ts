export function isEmpty(string: string) {
  return typeof string === 'string' && string.trim().length === 0;
}
