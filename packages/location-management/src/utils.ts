/**
 * Find the pivot/mid index of an array
 *
 * @param {number[] | string[]} array Array of ParsedHierarchyNode
 * @param {number} start stating index to look for pivot
 * @returns {number} returns the pivot/mid index of an array
 */
function pivot(array: number[] | string[], start = 0) {
  const pivot = array[start];
  let pointer = start;

  for (let i = start; i < array.length; i++) {
    if (array[i] < pivot) {
      pointer++;
      [array[pointer], array[i]] = [array[i], array[pointer]];
    }
  }

  if (pointer < array.length) [array[start], array[pointer]] = [array[pointer], array[start]];

  return pointer;
}

/**
 * Sort the Base ParsedHierarchyNode by name
 *
 * @param {number[] | string[]} array Array of ParsedHierarchyNode
 * @param {number} start starting index for array
 * @param {number} end ending index for array
 * @returns {number} returns Sorted ParsedHierarchyNode
 */
export function quickSort(array: number[] | string[], start = 0, end: number = array.length) {
  const pivotIndex = pivot(array, start);

  if (start >= end) return array;
  quickSort(array, start, pivotIndex);
  quickSort(array, pivotIndex + 1, end);

  return array;
}
