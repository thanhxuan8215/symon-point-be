/**
 * Paginate data
 * @param array
 * @param offset
 * @param limit
 */
 export function getPaginatedData(
  array: Array<any>,
  offset: number,
  limit: number,
): Array<any> {
  if (
    limit === undefined ||
    offset === undefined ||
    +limit < 0 ||
    +offset < 0
  ) {
    return array;
  }
  return array.slice(+offset, +offset + +limit);
}